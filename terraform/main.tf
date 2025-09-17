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

# -----------------------------------------------------------------------------
# AWS SNS (Simple Notification Service) FOR SMS MESSAGES
# -----------------------------------------------------------------------------
# This creates an SNS topic. Your application will publish messages to this
# topic's ARN (Amazon Resource Name) to send notifications.
# -----------------------------------------------------------------------------
resource "aws_sns_topic" "user_notifications_sms" {
  name = "user-notifications-sms-topic"

  tags = {
    Environment = "Development"
    Purpose     = "User SMS Notifications"
  }
}

# -----------------------------------------------------------------------------
# AWS SES (Simple Email Service) FOR EMAIL MESSAGES
# -----------------------------------------------------------------------------
# STEP 1: Verify a domain you own. This proves to AWS that you have the
# right to send emails on behalf of this domain.
# -----------------------------------------------------------------------------
resource "aws_ses_domain_identity" "notification_domain" {
  domain = "complitas.co.uk"
}

resource "aws_ses_domain_mail_from" "mail_from_domain" {
  domain           = aws_ses_domain_identity.notification_domain.domain
  mail_from_domain = "bounce.${aws_ses_domain_identity.notification_domain.domain}"
}

# -----------------------------------------------------------------------------
# STEP 2: Set up DKIM (DomainKeys Identified Mail). This helps improve
# email deliverability and proves your emails aren't forged.
#
# !! ACTION REQUIRED !!
# After you run `terraform apply`, Terraform will output DKIM tokens.
# You MUST add these as CNAME records in your domain's DNS settings
# (e.g., in AWS Route 53, GoDaddy, Cloudflare, etc.).
# Email sending will not be fully functional until this is complete.
# -----------------------------------------------------------------------------
resource "aws_ses_domain_dkim" "notification_domain_dkim" {
  domain = aws_ses_domain_identity.notification_domain.domain
}

# -----------------------------------------------------------------------------
# IAM PERMISSIONS FOR YOUR APPLICATION
# -----------------------------------------------------------------------------
# Your application (e.g., a Lambda function, an EC2 instance) needs
# permissions to use SES and SNS. This policy grants the necessary access.
# You would attach this policy to the IAM role your application uses.
# -----------------------------------------------------------------------------
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
        Resource = aws_sns_topic.user_notifications_sms.arn
      }
    ]
  })
}

# -----------------------------------------------------------------------------
# OUTPUTS
# -----------------------------------------------------------------------------
# These outputs provide the critical information you'll need after deployment.
# -----------------------------------------------------------------------------
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
