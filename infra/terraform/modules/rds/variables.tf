variable "identifier" {
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

variable "security_group_ids" {
  type    = list(string)
  default = []
}

variable "subnet_group_name" {
  type    = string
  default = ""
}
