# Containerizing-wordpress-app
and migrating from database

## Old files


Dockerfile for wordpress
![[hello-ss-wordpress-container.png]]

docker-compose file
![[docker-compose-file-for-wordpress.png]]

mysql docker file
![[hello-ss-mysql-container.png]]

myPassw0rd

'wpuser123'@'localhost' IDENTIFIED BY 'wpuserPassw0rd';
  


|Site Title|wp-testsite|
|Username|wpwebuser |
|password|)5S@PsG1J$VACnJ@%Q|
|email|myemail@example.com|
|||


Docker mariadb password
wpuser123Passw0rd

https://linux.how2shout.com/how-to-install-wordpress-on-ubuntu-22-04-lts-server/

https://devhints.io/mysql

https://docs.docker.com/engine/install/ubuntu/

https://kifarunix.com/how-to-deploy-wordpress-as-a-docker-container/


```sh
#exporting/backuping old mysql data
mysqldump -u wpuser123 -pwpuserPassw0rd new_db > dump.sql

#current mysql configuration
mysql user: wpuser123
mysql passwd: wpuserPassw0rd
db name: new_db

#login to ec2 and run the backup command
mysqldump -u wpuser123 -p new_db > mywpold_db.sql

```
## steps

1. create new folder in wordpress
cd into it
```sh
mkdir wordpress && cd wordpress
```

2. pull wordpress and mariadb containers
`sudo docker pull wordpress`
`sudo docker pull mariadb`

3. create custom docker network
`sudo docker network wp-app`
`sudo docker network ls`

4. Creation of mariadb database container
- hash the password of db first
```sh
echo `openssl passwd` | sudo tee $PWD/.db-pass
```
  now hashed password file must be in `.db-pass` file
  here i have set `myPassw0rd` password
```sh
cat .db-pass
$1$Nyql5zO2$H9e0n0m44qJ8xQfPt79Pn0
```

- Create mariaDB data directory to mount container database with /var/lib/mysql
 `sudo mkdir -p data`

```sh
~/wordpress 
	- data
```
 - Create and run Mariadb Docker container
```sh
sudo docker run -d --network=wp-app -e MARIADB_ROOT_PASSWORD_HASH=/home/ubuntu/wordpress/.db-pass --restart unless-stopped -v '/home/ubuntu/wordpress/data:/var/lib/mysql' --name wp-mariadb mariadb
```

 -  check health and logs
 `docker ps`
```sh
sudo tail -f /var/lib/docker/containers/<container-ID>/<container-ID>-json.log
```

example:
```sh
sudo tail -f /var/lib/docker/containers/8c07234611094796605b37b5822255dcdd35aa4325e7729aa2ff5c8be6dcefa6/8c07234611094796605b37b5822255dcdd35aa4325e7729aa2ff5c8be6dcefa6-json.log
```

- check mounted volume for generated data
`ls -1 data`

regarding migration of old database
copy the backup file into container db folder
`cp mywpold_db.sql wordpress/data/`

5. login to mariadb container
```sh
docker exec -it wp-mariadb bash
```

restore old db
```sh
cd /var/lib/mysql
mariadb -u wpuser123 -p new_db < mywpold_db.sql;
```

## REFERENCES:
1. https://kifarunix.com/how-to-deploy-wordpress-as-a-docker-container/
2. https://mariadb.com/kb/en/moving-mariadb-to-docker-installation/#comment_3811
3. https://mariadb.com/kb/en/backup-and-restore-overview/
4. https://www.reddit.com/r/docker/comments/tj8qp2/containerize_an_existing_wordpress_site/?rdt=49217