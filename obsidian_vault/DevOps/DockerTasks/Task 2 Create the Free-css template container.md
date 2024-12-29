---
Title: "Task-2: Create the Free-CSS Template container"
tags:
  - devops_tasks
  - practical
  - devops
  - docker
  - containerisation
date: 2024-12-28
---
# Task 2: Create the Free-css template container 
## Instructions
- [ ] get the docker image of Amazon linux 
- [ ] install nginx 
- [ ] add free-css template

## Steps Performed:

### Getting the Amazon Linux docker image

1. Goto docker hub --> https://hub.docker.com
2. Click on Search and search for ---> amazonlinux
3. Here I found this official image
   ![[{BACB7514-FD34-4BC8-9CB6-0314BF45113F}.png]]

4. I simply pulled the image into my ec2 instance
   `docker pull amazonlinux`

   here is successful pull looks like
   
   ![[{BD7598CF-AF45-41FB-82E8-A7E26163D176}.png]]

5. We can further confirm if the image is really present in the system with `docker images`

   ![[Pasted image 20241227205640.png]]
   Looks like amazonlinux is successfully pulled in our system
   lets start the container using this image

6. Running the container from image
   `sudo docker run -d -p 32768:80 --name free-css-template amazonlinux`

   We used `-d` to run the container in detached mode meaning its output wont occupy the terminal screen and quietly run in the background after running this command it will simply give us `container-id` and gives us prompt. 
   `--name` flag will assign the name for our container instead of their random funny names and with `-p` we are forwarding the network traffic of port 80 of the container to 32768 port of our host machine in this case ec2-instance.
   ![[{5005E6A5-9A5C-44EE-B8B4-37364CD7D1E2}.png]]

   We can check for the further detail of the container with
   `docker ps` 
   Upon inspection we can see there is no container running 
   lets check again with `docker ps -a` and for our surprise container is exited just after it run. Thats because its an Operating system container which doesnt really do anything itself unless we assign it a task or a process that will run in background constantly so we can enter into the container to perform our tasks.

   We can achieve this by running the container interactively

   but first clean up the exited container with `docker rm <container-id>`
   
### Getting the shell into container
7. Run a container interactively.

```sh
docker run -it -d -p 32768:80 --name free-css-template amazonlinux
```

   I run the container with `-it` and `-d` so it opened the interactive stdin shell session for me to interact with it and the container itself is in detached mode allowing us to enter into it anytime with `exec` command

```sh
docker exec -it <container-id> <shell-command>
```

![[{8DD627B8-39AA-4F0D-8320-CF6DA2D7BB33}.png]]

we got bash shell session inside container
Now we need to update the packages inside the container

### Installing packages inside container
```sh
yum update
```

![[{FEF2B4B8-3A70-49CA-B07C-475B398724EC}.png]]

8. Install nginx package start it
```sh
yum install nginx -y
```

 since this `amazonlinux` container image doesn't come with `systemd` preinstalled we cannot start *nginx daemon* so we need to run this command *manually in background*
 
```sh   
nginx &
```
   
and our nginx server is successfully started at *port 32768* on our host ec2-instance

![[{E0754AEE-5490-497B-AA74-428CD4B239A9}.png]]

### Installing Free-CSS template

Lets add free css template in it 
Head on to https://www.free-css.com/ and download any free css template you want by right clicking on the **download button** and copying link address
![[{B54DF9F8-AC7B-420B-9EAA-54AE5D0B261F}.png]]
and go to your containers terminal session and download this file in nginx server directory with curl or wget

```sh
cd /usr/share/nginx/html
curl -O https://www.free-css.com/assets/files/free-css-templates/download/page296/carvilla.zip

# Extract the zip file
unzip carvilla.zip

# If unzip is not found install unzip package
sudo yum install unzip
```

extracting the zip has extracted all contents into folder named `carvilla-v1.0`
I'll rename it for my convenient. 

```
mv carvilla-v1.0 mywebsite
```

and the website is running at port `32768/mywebsite`

now we can get out of this container with `exit` command.

![[{ADBAE0E2-C52F-4FE1-9DBE-85A5BABFF759}.png]]

We have our container **successfully** hosting our free-css template on port *http://instance-ip:32768/mywebsite* 
Lets create the image out of this container so we can spin many containers as we want and save the hustle to do all these steps all over again.
### Creating and Storing the Image on Dockerhub
9. Creating the image 
![[{FE045571-00F2-44B6-B1CB-E7F26EE9AE7E}.png]]
Now that we have our container running and our site is visible I want to make image out of it and push it to docker hub 

for that we use `docker commit <container-id>`

it returns with the sha-id
![[{83AC20A6-5137-45BC-8761-6AD28799FF56}.png]]

with `docker images` we can confirm the image creation
![[{9EE50687-0A6E-4930-966B-D6D50B9E78B7}.png]]

our image shown in first row doesnt have name so lets give it a tag and then push it to repo
`docker tag <image-id> <tagname>`
`docker tag local-image:tagname new-repo:tagname`

![[Pasted image 20241227225859.png]]

Here I have already created repository in docker hub so I gave its name here

and run docker hub login command before running push command
`docker login`

and push it to our docker hub
`docker push new-repo:tagname`

![[Pasted image 20241227231042.png]]

And our project is successful pushed over docker hub and can be access from here

https://hub.docker.com/r/archsarangx/amazonlinux-free-css-demo/tags

### Storing the Image on EKS 

![[{393988AE-E9F0-47A9-A960-5EBE39901FED}.png]]

To store the image into Amazon's Elastic Container Registry which is similar to docker hub but their own we need to create a repository here too.

I gave the repo same name
![[{F7CDF0B9-3C17-4D22-9547-7D65863E4BDE}.png]]

and Upon clicking create button my repo is created
![[{7B336AAA-A8CB-4F61-823E-072A4025B6A6}.png]]
Click on the Repo name in blue and click on view push commands to get instruction for pushing our image into this repo

![[{7CB87CED-E1FD-4698-BCA5-DFC2D6C53B23}.png]]

### Authenticating the docker client with EKS Registry

To push our image we need to first Authenticate with registry for that carefully use first command also we need to have aws-cli installed and configured for that luckily for me I am using amazonlinux ec2 instance so its already installed i can just run `aws configure` to configure `aws-cli` 
For those havent can check [this documentation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html) to configure their aws-cli within instance.

![[Pasted image 20241228154309.png]]

and then run this command provided in the instructions but remember to add sudo as we are using standard user
![[{AC6817B4-D44D-4A43-AEFF-16292F4D44D0}.png]]

Now that We have successfully login to ECR lets tag the image accordingly and push it to ECR

`sudo docker tag <username>/<repo-name>:<tag-name> <amazon-account-id>.dkr.ecr.<region>.amazonaws.com/<username>/<newname>:<newtag>`

![[{19760D25-4AB9-4A59-9757-62575607EF5A}.png]]
and push to ECR

`sudo docker push <amazon-account-id>.dkr.ecr.<region>.amazonaws.com/<username>/<repo-name>:<tag-name>`

![[{D18E449C-3E7D-4B49-8AC1-75893D2A92F7}.png]]

and refresh the amazon EKS web site to see the latest image listed in there
![[{48017E2C-FBB3-4AB6-B125-BFEFA58746BE}.png]]


Thank you for Reading 
Have a good day!

