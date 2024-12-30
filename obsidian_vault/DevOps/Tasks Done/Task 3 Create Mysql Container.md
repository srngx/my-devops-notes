---
Title: Create Mysql Container
date: 2024-12-29
tags:
  - devops_tasks
  - docker
  - containerisation
---
# Create the MYSQL Container
#### Instructions
- [ ] Host mysql container 
- [ ] Use -e ## environment variables
- [ ] use MYSQL_USER, MYSQL_PASSWORD

#### Steps Performed
##### Step 1: Login to Ec2-instance
##### Step 2: Pull docker image of mysql
```bash
sudo docker pull mysql
```

##### Step 3: Run the container with environment variables
```bash
sudo docker run -e MYSQL_USER=sarang -e MYSQL_PASSWORD=mysupersecretpassword -e MYSQL_RANDOM_ROOT_PASSWORD=yes -p 3306:3306 --name mysql_container -v mysql_data:/var/lib/mysql mysql:latest
```

Here we used `-e` flag to specify each *environment variables* for mysql

`MYSQL_USER=sarang`  This sets the username for our mysql database
`MYSQL_PASSWORD=mysupersecretpassword` This sets the password for our database

`MYSQL_RANDOM_ROOT_PASSWORD=yes`    # This tells the mysql to generate a random root password (it can be seen in docker logs)
`-v mysql_data:/var/lib/mysql mysql:latest` This flag sets the persistence volume for our container and it mounts `/var/lib/mysql` *directory of the container* to the `mysql_data` *directory of our host.*



