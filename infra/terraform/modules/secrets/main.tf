resource "aws_secretsmanager_secret" "database_url" {
  name = "${var.prefix}/database-url"

  tags = {
    Project = "gblockparty"
  }
}

resource "aws_secretsmanager_secret" "github_app_private_key" {
  name = "${var.prefix}/github-app-private-key"

  tags = {
    Project = "gblockparty"
  }
}

resource "aws_secretsmanager_secret" "github_webhook_secret" {
  name = "${var.prefix}/github-webhook-secret"

  tags = {
    Project = "gblockparty"
  }
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name = "${var.prefix}/jwt-secret"

  tags = {
    Project = "gblockparty"
  }
}

resource "aws_secretsmanager_secret" "encryption_key" {
  name = "${var.prefix}/encryption-key"

  tags = {
    Project = "gblockparty"
  }
}
