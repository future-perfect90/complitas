/**
 * Data source to get the AWS account ID of the current caller.
 * This is used to construct ARNs and for other account-specific operations.
 */
data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "complitas_documents" {
  bucket        = "complitas"
  force_destroy = false

  tags = {
    Name        = "complitas"
    Environment = "prod"
  }
}

// Enforce bucket-owner control (disables ACLs)
resource "aws_s3_bucket_ownership_controls" "this" {
  bucket = aws_s3_bucket.complitas_documents.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

// Block all forms of public access
resource "aws_s3_bucket_public_access_block" "this" {
  bucket                  = aws_s3_bucket.complitas_documents.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

// Enable versioning (recommended for documents)
resource "aws_s3_bucket_versioning" "this" {
  bucket = aws_s3_bucket.complitas_documents.id

  versioning_configuration {
    status = "Enabled"
  }
}

// Default server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  bucket = aws_s3_bucket.complitas_documents.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256" # or "aws:kms" with a KMS key if preferred
    }
  }
}

// Deny any non-HTTPS (non-TLS) requests
data "aws_iam_policy_document" "deny_insecure_transport" {
  statement {
    sid    = "DenyInsecureTransport"
    effect = "Deny"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = ["s3:*"]

    resources = [
      aws_s3_bucket.complitas_documents.arn,
      "${aws_s3_bucket.complitas_documents.arn}/*"
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

resource "aws_s3_bucket_policy" "deny_insecure_transport" {
  bucket = aws_s3_bucket.complitas_documents.id
  policy = data.aws_iam_policy_document.deny_insecure_transport.json
}

resource "aws_s3_bucket_cors_configuration" "this" {
  bucket = aws_s3_bucket.complitas_documents.id

  cors_rule {
    allowed_methods = ["GET", "PUT"]
    allowed_origins = ["http://localhost:5173"] # React dev server
    allowed_headers = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_sns_topic" "user_notifications_sms" {
  name = "user-notifications-sms-topic"

  tags = {
    Environment = "Development"
    Purpose     = "User SMS Notifications"
  }
}

resource "aws_ses_domain_identity" "notification_domain" {
  domain = "complitas.co.uk"
}

resource "aws_ses_domain_mail_from" "mail_from_domain" {
  domain           = aws_ses_domain_identity.notification_domain.domain
  mail_from_domain = "bounce.${aws_ses_domain_identity.notification_domain.domain}"
}

resource "aws_ses_domain_dkim" "notification_domain_dkim" {
  domain = aws_ses_domain_identity.notification_domain.domain
}

resource "aws_iam_policy" "notification_sender_policy" {
  name        = "NotificationSenderPolicy"
  description = "Allows sending notifications via SES and SNS"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ],
        Effect   = "Allow",
        Resource = "*" # For production, you can lock this down to the specific SES domain ARN
      },
      {
        Action = [
          "sns:Publish"
        ],
        Effect   = "Allow",
        Resource = "*" # Required to publish directly to phone numbers
      }
    ]
  })
}

output "sns_topic_arn" {
  description = "The ARN of the SNS topic for SMS notifications."
  value       = aws_sns_topic.user_notifications_sms.arn
}

output "ses_domain_identity_arn" {
  description = "The ARN of the SES domain identity."
  value       = aws_ses_domain_identity.notification_domain.arn
}

output "ses_dkim_dns_records" {
  description = "DKIM CNAME records to add to your DNS provider."
  value       = aws_ses_domain_dkim.notification_domain_dkim.dkim_tokens
}

output "ses_domain_verification_record" {
  description = "The name and value for the TXT record to verify domain ownership with SES."
  value = {
    name  = "_amazonses.${aws_ses_domain_identity.notification_domain.id}"
    value = aws_ses_domain_identity.notification_domain.verification_token
    type  = "TXT"
  }
}

output "ses_mail_from_mx_record" {
  description = "The MX record for the custom MAIL FROM domain."
  value       = "10 feedback-smtp.${local.region}.amazonses.com"
}

output "ses_mail_from_spf_record" {
  description = "The TXT/SPF record for the custom MAIL FROM domain."
  value       = "\"v=spf1 include:amazonses.com ~all\""
}
