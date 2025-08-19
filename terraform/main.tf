/**
 * Data source to get the AWS account ID of the current caller.
 * This is used to construct ARNs and for other account-specific operations.
 */
data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "complitas_documents" {
  bucket        = "complitas-documents"
  force_destroy = false

  tags = {
    Name        = "complitas-documents"
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