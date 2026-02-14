output "secret_arns" {
  value = {
    database_url             = aws_secretsmanager_secret.database_url.arn
    github_app_private_key   = aws_secretsmanager_secret.github_app_private_key.arn
    github_webhook_secret    = aws_secretsmanager_secret.github_webhook_secret.arn
    jwt_secret               = aws_secretsmanager_secret.jwt_secret.arn
    encryption_key           = aws_secretsmanager_secret.encryption_key.arn
  }
}
