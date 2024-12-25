---
Title: Host Tomcat based Student-Registration-App
tags:
  - EC2
  - RDS
  - tomcat
---
## Step 1: Create Database

![[rds-logos-database-selections.png]]
1. Goto RDS dashboard and click on **Create Database** 
2. Select **Standard create** for **database creation method**
3. I chose **MariaDB** engine
4. Engine Version selected n-1 that is one step behind the latest one
5. Select **Free Tier** Template
6. I leave **database-1** as DB instance identifier name
7. **Self Managed** Credential Management
8. and inputed desired **Master Password** i.e `Passw0rd123`
9. In instance configuration I selected **Burstable classes** for DB instance class
10. and selected **db.t3.micro**
11. for storage I selected **General Purpose SSD gp2** and allocated 20GB of storage
12. I left default setting as it is and clicked on **Create Database**

![[database-created-successfully.png]]
Also add security group rules for port 3306 for database
![[{26BC9CA5-9BB0-4D39-9B13-454B992FE55F}.png]]
## Step 2: Configure Instance for Mariadb
![[launching-ec2-instance-button.png]]
1. Launch ec2 instance
2. I gave name of ec2 instance **db-test**
3. Selected **Amazon linux** free tier 
4. and added security group for 3306 port
[make sure to have same security group for both ec2 and rds]
5. Clicked on create instance
6. Log into instance

## Step 3: Connect to RDS via ec2
1. After login to ec2 install mariadb client
```sh
yum install mariadb105
```

2. Login to endpoint of RDS we just created
```sh
mysql -h <hostname> -u <user> -p
mysql -h database-1.czsumoyo8fx5.us-west-2.rds.amazonaws.com -u admin -p
```
Input the password and congrats you just logged into your fresh sql database.

![[mariadb-installed-success.png]]

### Reference: 
https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql

### Create User (Optional)

```sql
CREATE USER 'sammy'@'localhost' IDENTIFIED BY 'password';
grant create, alter, drop, insert, update, delete, select on demo.persons to 'sammy'@'localhost';
grant select on demo.* to 'sammy'@'localhost';           
show grants for 'sammy'@'localhost';

```

## Install packages

Install tomcat, git, maven
### Install tomcat from source
Install this specific version from source
```bash
curl -O https://dlcdn.apache.org/tomcat/tomcat-9/v9.0.97/bin/apache-tomcat-9.0.97.zip
unzip apache-tomcat-9.0.97.zip
yum install java-17 -y 
cd apache-tomcat-9.0.97/bin/
bash ./catalina.sh start 

```

hit the instance ip:8080 / curl the ip 
You should see tomcat webpage
![[{BF5D483E-E314-42B8-A790-36EC904C637B}.png]]

### Install git
```
sudo yum install git -y
```

### Install maven
```
sudo yum install maven -y
```

## Clone the webapp repo
```bash
git clone https://github.com/Pritam-Khergade/student-ui
```


build application
```sh
cd student-ui
mvn clean package
```

this must have created .war file in target folder
rename it to suitable short name and move to apache-tomcat's webapps directory

```sh
mv target/studentapp-2.2-SNAPSHOT.war target/studentapp.war
mv target/studentapp.war ../apache-tomcat-9.0.97/webapps/
```

hit the instance ip:8080/studentapp
![[{17627F7C-22F9-448B-B926-BE826D130D98}.png]]

Upon filling the form if you get this 
![[{9A94ABEB-EA83-48BB-A58B-36203206528C}.png]]
It means you have not connected RDS with this webapp
lets do this

## Login to mysql
```sh
mysql -h database-1.czsumoyo8fx5.us-west-2.rds.amazonaws.com -u admin -p
```

## create database with studentapp tables

```mysql
CREATE DATABASE studentapp;
use studentapp;
CREATE TABLE if not exists students(student_id INT NOT NULL AUTO_INCREMENT,
	student_name VARCHAR(100) NOT NULL,
    student_addr VARCHAR(100) NOT NULL,
	student_age VARCHAR(3) NOT NULL,
	student_qual VARCHAR(20) NOT NULL,
	student_percent VARCHAR(10) NOT NULL,
	student_year_passed VARCHAR(10) NOT NULL,
	PRIMARY KEY (student_id)
);
```

```mysql
show database;
use studentapp;
show tables;
desc students;
```

![[{E35F872A-AB74-43BC-BACD-DE202683E43E}.png]]

Ir should look like this 
![[{5ABCCE77-EF84-4615-957E-4DD5E23E430E}.png]]
## Configure tomcat to talk to RDS

goto conf folder in apache-tomcat source folder
```bash
cd ../conf
#and edit context.xml file
vi context.xml
```

and paste this code between `<context></context>` block
```xml
<Resource name="jdbc/TestDB" auth="Container" type="javax.sql.DataSource"
           maxTotal="500" maxIdle="30" maxWaitMillis="1000"
           username="admin" password="Passw0rd123" driverClassName="com.mysql.jdbc.Driver"
           url="jdbc:mysql://database-1.czsumoyo8fx5.us-west-2.rds.amazonaws.com:3306/studentapp?useUnicode=yes&amp;characterEncoding=utf8"/>
```

make sure to **edit username** and **password** values with your own and **url** to your **hostaname** of database

### Installing the mysql connector library file 
copy this url - https://s3-us-west-2.amazonaws.com/studentapi-cit/mysql-connector.jar

Place the **mysql connector** library (`mysql-connector.jar`) into `/lib` folder of `apache-tomcat` directory by using curl or wget

```sh
cd ../lib
curl -O https://s3-us-west-2.amazonaws.com/studentapi-cit/mysql-connector.jar
```

now that library file is placed into its correct location lets restart catalina
but first navigate back to bin directory where catalina.sh binary is located


```sh
cd ../bin
bash catalina.sh stop
bash catalina.sh start
```


Now navigate to browser with this url 
ec2-instance-ip:8080/studentapp

now registration data should be able to passed into database

After the filling the registration form login to mysql database and check if the data is present in the table now.

```mysql
mysql -h <rds endpoint> -u admin -p
show databases;
use studentapp;
show tables;
select * from students;
```


