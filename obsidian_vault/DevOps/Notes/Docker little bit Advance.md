## Installing docker

### Rhel Based Distro Installation
Installing docker on amazonlinux and rhel based distros are much easier than installling on ubuntu
```sh
sudo yum install docker # rhel/amazonlinux/fedora etc
sudo pacman -S docker   # archlinux based distros
```

### Ubuntu/Debian Family based distro Installation
```sh
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh`
```
Running this script should install following package inside your ubuntu based distro `docker-engine, docker.io, containerd, runc`.

However I still recommend to check [this official installation guide](https://docs.docker.com/engine/install/ubuntu/)

## Enabling docker daemon

```sh
systemctl start docker
systemctl enable docker
```
To run docker command its *absolutely require* to have docker daemon running in background otherwise it wont work so make sure you have docker daemon running.
## Pulling the Image
```sh
docker pull nginx
```
This will pull latest version of nginx image from docker hub. 
*By default its always going to pull latest tag*
In order to pull specific version you need to mention its tag name like this
```
docker pull nginx:1.23.1
```
## Running the container from the image
```sh
docker run nginx
```
This command creates and starts a Docker container running the Nginx web serve. Although By default, Nginx runs on port 80 within the container. This command **doesn't map any ports**, so you won't be able to access the Nginx server from your host machine to specify port you can use`-p` flag.
### Mapping specific port
```sh
docker run -p 8080:80 nginx
```
*Here 8080 is host machine port and 80 is container port*

```sh
docker run -P nginx
```
This will map random port for the host machine.
### Running the container in detached mode
```
docker run -d nginx`
```
Normally running container will cause container to run in foreground and occupy the terminal screen. So its better choice to use `-d` to make it run in background.
### Giving the specific name to container

```sh
docker run --name my-container nginx
```
By default docker give funny names to containers. but you can specify your custom name and can *use that name instead of 'container-id' in docker commands.*
## Stopping container
```sh
docker stop <conainer-id>
```
Stopped containers and be restarted with *start* command
## Removing stopped container
```sh
docker rm <container-id>
```
Sometimes stopped or exited containers wont have any use and needs to be removed to save space.
## Listing the running container 
```sh
docker ps
```
This will list all the running containers only and not exited or stopped ones.

To list all containers including exited and stopped ones use *ps -a*
```sh
docker ps -a
```

## Seeing the logs of the container
```sh
docker logs <container-id>
```
This is important to monitor activities inside of containers.
## Inspecting the running container
```sh
docker inspect <container-id>
```
This will list all the information of container
## Creating the image out of running container
```sh
docker commit <container-id> 
```
This will come in handy when you done changes inside running container and want to incorporate these changes into your image.

```
$ sudo docker images
REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
<none>       <none>    5c9d3a455e0f   10 seconds ago   214MB
```

## Giving tag to image
```sh
docker tag <image-id> new-name
```
Adding tag is like giving Image a name this comes in handy for identifying images.

```
$ sudo docker images
REPOSITORY     TAG       IMAGE ID       CREATED          SIZE
custom-nginx   latest    5c9d3a455e0f   47 seconds ago   214MB
```

## Pushing Image to docker hub and ECR
```sh
docker push <image-id>
```
If you have verified docker hub login through `docker login` command it will automatically push the image to your docker hub repo assuming your docker hub repo has same name as your image tag

and same goes to ECR except you need to authenticate through slightly different method:

```sh
aws ecr get-login-password --region <region-name> | docker login --username AWS --password-stdin <amazon-account-id>.dkr.ecr.<region-name>.amazonaws.com
```
