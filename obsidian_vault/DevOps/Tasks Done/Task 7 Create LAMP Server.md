---
publish: "false"
draft: "true"
---
Linux
Apache
Mysql
PHP

**Lamp stack with blue-green deployment strategy**

Step 1: Create EC2 Instance

Step 2: Install docker and docker-compose
```sh
yum update && yum install docker
systemctl enable --now docker

# Download binary of docker-compose
curl -SL https://github.com/docker/compose/releases/download/v2.32.0/docker-compose-linux-x86_64 -o /usr/bin/docker-compose

# add execute permission
chmod +x /usr/bin/docker-compose

# check if its working
docker-compose --version

```

Step 3: Define directory structure

```
.
├── docker-compose.yml
├── nginx/
│   ├── nginx.conf
│   └── conf.d/
│       └── default.conf
├── DocumentRoot/
└── deploy.sh
```

```sh
#!/bin/bash 
# deploy.sh 
CURRENT_DEPLOYMENT=$(grep 'set $deployment' ./nginx/conf.d/default.conf | awk '{print $3}' | tr -d '";') if [ "$CURRENT_DEPLOYMENT" = "blue" ]; then NEW_DEPLOYMENT="green" else NEW_DEPLOYMENT="blue" fi echo "Switching from $CURRENT_DEPLOYMENT to $NEW_DEPLOYMENT" 
# Deploy new code to the inactive environment 
echo "Deploying new code to $NEW_DEPLOYMENT environment..."

# Add your deployment commands here 

# Test the new deployment echo "Testing $NEW_DEPLOYMENT deployment..." curl -f http://localhost/$NEW_DEPLOYMENT/health if [ $? -eq 0 ]; then # Switch traffic to new deployment sed -i "s/set \$deployment \"$CURRENT_DEPLOYMENT\"/set \$deployment \"$NEW_DEPLOYMENT\"/" ./nginx/conf.d/default.conf docker exec nginx-proxy nginx -s reload echo "Successfully switched to $NEW_DEPLOYMENT deployment" else echo "New deployment failed health check. Keeping $CURRENT_DEPLOYMENT active" exit 1 fi
```


```
```yaml
version: '3.7'

services:
	php-httpd:
		image: php:7.3-apache
		ports: 
			- 80:80
		volumes:
			- "./src:/var/www/html"

	mariadb:
		image: mariadb:10.5.2
		volumes:
			- mariadb-volume:/var/lib/mysql
		- 

```
