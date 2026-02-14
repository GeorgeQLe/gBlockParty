variable "db_identifier" {
  type    = string
  default = "gblockparty"
}

variable "db_name" {
  type    = string
  default = "gblockparty"
}

variable "db_username" {
  type    = string
  default = "gblockparty"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "db_security_group_ids" {
  type    = list(string)
  default = []
}

variable "db_subnet_group_name" {
  type    = string
  default = ""
}

variable "s3_bucket_name" {
  type    = string
  default = "gblockparty-builds"
}

variable "secrets_prefix" {
  type    = string
  default = "gblockparty"
}
