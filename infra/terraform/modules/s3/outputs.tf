output "bucket_name" {
  value = aws_s3_bucket.builds.id
}

output "bucket_arn" {
  value = aws_s3_bucket.builds.arn
}
