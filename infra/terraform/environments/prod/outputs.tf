output "database_url" {
  value     = module.rds.database_url
  sensitive = true
}

output "s3_bucket_name" {
  value = module.s3.bucket_name
}

output "secret_arns" {
  value = module.secrets.secret_arns
}
