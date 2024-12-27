## Installing docker
`yum install docker`

## Enabling docker daemon

`systemctl start docker`
`systemctl enable docker`

## Pulling the Image
`docker pull nginx`

## Running the container from the image
`docker run nginx`

### Running the container in detached mode
`docker -d nginx`

### Giving the specific name to container
`docker run --name my-container nginx`

### Adding specific port
`docker run -p 32768:8080 nginx`

### Let the docker choose random port
`docker run -P nginx`

## Stopping container
`docker stop <conainer-id>`

## Removing stopped container
`docker rm <container-id>`

## Listing the running container 
`docker ps`

## Listing all container (even stopped ones)
`docker ps -a`

## Seeing the logs of the container
`docker logs <container-id`

## Inspecting the running container
`docker inspect <container-id`

## Creating the image out of running container
`docker commit <container-id> `

```
$ sudo docker images
REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
<none>       <none>    5c9d3a455e0f   10 seconds ago   214MB
```

## Giving tag to create image
`docker tag <image-id> new-name`

```
docker tag 5c9d custom-nginx

$ sudo docker images
REPOSITORY     TAG       IMAGE ID       CREATED          SIZE
custom-nginx   latest    5c9d3a455e0f   47 seconds ago   214MB
```

