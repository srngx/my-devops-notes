## Run the Free-css template container 
- get the docker image of Amazon linux 
- install nginx 
- add free css


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
   
7. Run a container interactively.
   `docker run -it -d -p 32768:80 --name free-css-template amazonlinux`

   I run the container with `-it` and `-d` so it opened the interactive stdin session for me into interact and the container itself is in detached mode allowing us to enter into it anytime with `exec` command
   ![[{8DD627B8-39AA-4F0D-8320-CF6DA2D7BB33}.png]]

we got bash shell session inside container
Now we need to update run the packages inside the container

`yum update`

![[{FEF2B4B8-3A70-49CA-B07C-475B398724EC}.png]]

8. Install nginx package start it
   `yum install nginx -y`

   since this `amazonlinux` container doesnt come with systemd installed we cant start nginx daemon so we need to run this command manually in background
   `nginx &`
   
and our nginx server is successfully started at port 32768 our host
![[{E0754AEE-5490-497B-AA74-428CD4B239A9}.png]]

Lets add free css template in it 

Head on to https://www.free-css.com/ and download any free css template you want by right clicking on the **download button** and copying link address

and go to your containers terminal session and download this file in nginx server directory with curl or wget

`cd /usr/share/nginx/html`
and 
`curl -O https://www.free-css.com/assets/files/free-css-templates/download/page296/carvilla.zip`

Unzip the zip file
`unzip carvilla.zip`

if the unzip command not found you can always install it with `yum install unzip`

extracting the zip has extracted all contents into folder named `carvilla-v1.0`
I'll rename it for my convenient. `mv carvilla-v1.0 mywebsite`

and the website is running at port `32768/mywebsite`

now we can get out of this container with `exit`

![[{ADBAE0E2-C52F-4FE1-9DBE-85A5BABFF759}.png]]

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

Thank you!

