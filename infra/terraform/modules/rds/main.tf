resource "aws_db_instance" "gblockparty" {
  identifier = var.identifier

  engine         = "postgres"
  engine_version = "16"
  instance_class = "db.t4g.micro"

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp3"

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  publicly_accessible    = false
  skip_final_snapshot    = false
  final_snapshot_identifier = "${var.identifier}-final"

  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"

  vpc_security_group_ids = var.security_group_ids
  db_subnet_group_name   = var.subnet_group_name

  tags = {
    Name    = var.identifier
    Project = "gblockparty"
  }
}
