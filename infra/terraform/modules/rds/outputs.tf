output "endpoint" {
  value = aws_db_instance.gblockparty.endpoint
}

output "database_url" {
  value     = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.gblockparty.endpoint}/${var.db_name}"
  sensitive = true
}

output "arn" {
  value = aws_db_instance.gblockparty.arn
}
