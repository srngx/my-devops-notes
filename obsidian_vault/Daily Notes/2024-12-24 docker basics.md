![[Pasted image 20241224092817.png]]
docker client ---> docker commands
docker machine ---> docker host

ubuntu package name `docker.i`

in amazon-linux
`yum install docker -y`

enable daemon
`systemctl enable --now docker`

`docker pull nginx`

>[!tip]
> Images can also be pulled from SHA Id.

`docker run nginx`

`-d` detached mode 
`ps` list running containers
`-a` list all containers stopped and running
`rm` remove stopped containers
`kill` kill the containers
`-P` expose container on random host port 




