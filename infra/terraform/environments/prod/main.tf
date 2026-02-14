module "rds" {
  source = "../../modules/rds"

  identifier         = var.db_identifier
  db_name            = var.db_name
  db_username        = var.db_username
  db_password        = var.db_password
  security_group_ids = var.db_security_group_ids
  subnet_group_name  = var.db_subnet_group_name
}

module "s3" {
  source = "../../modules/s3"

  bucket_name = var.s3_bucket_name
}

module "secrets" {
  source = "../../modules/secrets"

  prefix = var.secrets_prefix
}
