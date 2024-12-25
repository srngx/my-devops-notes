# Creating RDS database 

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



>[!Scratchpad]
HA - high availability
n-1
3306 maridb sql
sudo yum list
installing mariadb client
yum install mariadb105
> diagram
> default vpc
> 	3 public subnet
> 		1 subnet --> ec2
> 		2 subnet --> rds
endpoint access 
mysql -h <hostname> -u <user> -p> 

![[rds-diagram-1.png]]

```sh
create database demo;

show database;

use demo;

drop database demo;

CREATE TABLE Persons (  
    PersonID int,  
    LastName varchar(255),  
    FirstName varchar(255),  
    Address varchar(255),  
    City varchar(255)  
);

desc Persons;

Insert Into Persons (PersonID, LastName, FirstName) values (1, "DemoName", "Amir");

select * from Persons;

https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql

1. CREATE USER ' ==sammy=='@'localhost' IDENTIFIED BY '==password==';

grant create , alter drop  insert update delete select on demo.persons to sammy@&;

grant select on demo.* to "sammy"@"%";           

show grants for 

```

```
install tomcat
build application


create user
CREATE USER 'sammy'@'localhost' IDENTIFIED BY 'password';

show user
SELECT User, Host FROM mysql.user;


