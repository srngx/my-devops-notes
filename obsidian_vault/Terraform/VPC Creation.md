element()
length()

main.tf
```
# vpc

resource "aws_vpc" "main" {
  cidr_block       = var.vpc_cidr

  tags = {
    Name = "${var.tag}-vpc"
  }
}

# public subnet

resource "aws_subnet" "main" {
  count = length(var.public_subnet_cidr)
  vpc_id     = aws_vpc.main.id
  cidr_block = element( var.public_subnet_cidr, count.index )
  tags = {
    Name = "${var.tag}-public-subnet-${element( var.public_subnet_cidr, count.index )}"
  }
}

## private subnet
resource "aws_subnet" "private" {
    count = length(var.private_subnet_cidr)
  vpc_id     = aws_vpc.main.id
  cidr_block = element(var.private_subnet_cidr, count.index)

  tags = {
    Name = "${var.tag}-private-subnet-${element(var.private_subnet_cidr, count.index)}"
  }
}

# public rt

resource "aws_route_table" "main" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }


  tags = {
    Name = "${var.tag}-public-route"
  }
}


# private rt

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.nat.id
  }


  tags = {
    Name = "${var.tag}-private-route"
  }
}
# eip
resource "aws_eip" "nat" {
  domain   = "vpc"
} 

#nat 
resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.main[0].id

  tags = {
    Name = "${var.tag}-nat"
  }

  # To ensure proper ordering, it is recommended to add an explicit dependency
  # on the Internet Gateway for the VPC.
  depends_on = [aws_internet_gateway.gw]
}

# igw 
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.tag}-igw"
  }
}

# subnet association

resource "aws_route_table_association" "a" {
  count = length(var.public_subnet_cidr)
  subnet_id = aws_subnet.main[count.index].id
  route_table_id = aws_route_table.main.id
}

# private subnet association

resource "aws_route_table_association" "b" {
  count = length(var.private_subnet_cidr)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}
```

Provider.tf
```
terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.85.0"
    }
  }
}

provider "aws" {
  # Configuration options
  region = "us-east-2"

}
```

var.tf
```
variable "vpc_cidr" {
  type = string
  default = "10.0.0.0/16"
  description = "vpc cidr "
}

variable "tag" {
  type = string
  default = "cdec"
}

variable "public_subnet_cidr" {
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidr" {
  default = ["10.0.3.0/24", "10.0.4.0/24", "10.0.5.0/24","10.0.6.0/24"]
}
```

