---
Title: Task 1 - Creating Tomcat student-ui container
date: 2024-12-27
tags:
  - docker
  - devops
  - devops_tasks
  - containerisation
  - student-ui
---
# Task 1 - Creating Tomcat student-ui container
#### Instructions
 - [ ] Get the docker image of Amazon linux 
 - [ ] Add tomcat package  
 - [ ] Add student ui 
 - [ ] Then commit the image 
 - [ ] Store on ecr as well as on docker hub

#### Steps Performed

**Step 1: Getting the the Amazon Linux Image**
Upon searching the for `amazonlinux` image in [dockerhub](https://hub.docker.com) I found its official image
I pulled it into the system with `docker pull amazonlinux`

```sh
sudo docker run -it -d -p 32768:8080 --name tomcat-student-ui amazonlinux`
```
and I run the image **interactively and in detached mode** so i can execute shell command later on

![[{1CC503E6-0A58-42E5-93CF-64946C7AA1EF}.png]]

Lets dive into the container 
```sh
sudo docker exec -it <containerid> <shell-command>`
```

![[{0119C4A3-2DE3-4CB0-9692-E63934BF4F5C}.png]]

#### Step 2: Installing tomcat application

Our App student-ui required specific version of tomcat thats why we gonna install it from source

**Make sure to install dependancies and unzip package before hand**
#### Step 3: Install tomcat from source
Install this specific version from source

```bash
cd /opt # we can use this directory for temporary space
curl -O https://dlcdn.apache.org/tomcat/tomcat-9/v9.0.98/bin/apache-tomcat-9.0.98.zip
unzip apache-tomcat-9.0.98.zip # unzip the archive
yum install java-17 -y # tomcat 9 requires java-17 to work properly
cd apache-tomcat-9.0.98/bin/
bash ./catalina.sh start 
```

![[{9BD47135-6F08-466A-A3C7-A11FC17A759D}.png]]

![[{40C024BF-0490-4CFC-9507-9363489D25BD}.png]]

It looks like our *tomcat server is up and running* on desired port

#### Step 4: Installing Student-ui 

but first we need these package building tools `git` and `maven` for *building our student-ui app*
##### Installing git and maven
```
sudo yum install git maven -y
```

##### Clone the student-ui repo
```sh
git clone https://github.com/Pritam-Khergade/student-ui
```

##### build student-ui app using maven
```sh
cd student-ui
mvn clean package
```

![[{8E723B0C-8E54-4F56-94BC-F7D231F3287A}.png]]
this creates `.war` file in `./target` folder
rename it to suitable short name and move to `/opt/apache-tomcat-9.0.98/webapps` directory

```sh
mv target/studentapp-2.2-SNAPSHOT.war target/studentapp.war
mv target/studentapp.war /opt/apache-tomcat-9.0.97/webapps/
```

and the app should be accessible on tomcat server on `http://instance-ip:32768/studentapp`

![[{0DFF6CA3-CC34-4310-933F-F66D3256551D}.png]]

#### Create the image out of this running container
Before creating the image its better to remove the unnecessary packages that we no longer need to make the size of the image minimal as possible.
##### Cleanup the no-longer needed packages to reduce size of image
```sh
yum remove maven git unzip -y
```

Lets exit from container shell and build the image 
```sh
sudo docker commit <container-id>
```

![[{A2D16CE6-81BA-4DAF-A151-58EA34744A1B}.png]]

You see the created image doesnt have any name so lets give it a tag
```sh
sudo docker tag <image-id> <newtag>
```

![[{A6DFB555-CE8C-404D-AE0E-0E5BE4AECD43}.png]]
now **push it to docker hub and ECR**

#### Uploading image to docker hub

##### First create a repository at docker hub
- Login to docker hub
- Click on repositories
- Create new repository
- Give it proper name and click create

Here is my repo looks llike

![[{8E536B96-794C-49C6-B49F-257C6FEE2E9E}.png]]

Lets push our image into this repo
First rename add new tag to image appropriate according to docker hub repo name

```sh
sudo docker tag <old-tag-name> <newtag-name>
```

![[{62B7DAF9-7C95-4E53-BEB1-28F215445939}.png]]

and now push it to docker hub
```sh
sudo docker push archsarangx/tomcat-student-ui:latest
```

![[{3386541C-1516-4A09-9493-93A52B3FF2E0}.png]]

and its successfully uploaded on docker hub at 
![[{034DA07E-A936-4284-9683-BF0300BC5EB4}.png]]
and anyone can pull it with
```sh
docker pull archsarangx/tomcat-student-ui:latest
```

#### Uploading image to ECR

##### Step 1: Creating the repository at ECR
- goto amazon ECR service and create repositoy

![[Pasted image 20241228180114.png]]

then click on blue repo name and click on **view push commands**

##### Step 2: Authenticate with ECR

```sh
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 970547378605.dkr.ecr.us-west-2.amazonaws.com
```

##### Step 2: Add Tag name to image
``
```sh
docker tag archsarangx/tomcat-student-ui:latest 970547378605.dkr.ecr.us-west-2.amazonaws.com/archsarangx/tomcat-student-ui:latest
```

```sh
docker push 970547378605.dkr.ecr.us-west-2.amazonaws.com/archsarangx/tomcat-student-ui:latest
```

![[{8230C2A4-4835-4E3A-9500-E4C8B9187FB3}.png]]

![[{E9698F18-9E9B-4973-9E1A-3E629727DA11}.png]]
🎉 And our Image is successfully uploaded on both ECR and docker hub.

## Thank you for reading 
Have a good day!
