![[{494AEA1D-4739-4A7B-B8A5-C8BB6655CD12}.png]]
Before Learning about docker it is crucial to know about containers and even before that one should know what is *Microservices* and *monolithic application architecture*

## Monolithic vs Microservice Apps

At initial stages of the software development developers usually build software in monolithic way meaning everything that software has to offer is bundle in the single unit but as the development goes on the need to federate the services of the software arises and developers adapt Microservices method to divide software into chunks so all chunks communicate with each other creating illusion of one single software.

#### Monolithic Application
- Single unified application

#### Microservice app
- one app divided in chunks
### What is docker?

*Docker is a containerization technology that **packages your application in special portable sandboxed format along with its dependencies and system libraries** for better compatibility across devices.

![[Docker-Architecture-diagram_1.excalidraw.svg]]
### What is container?
- its like small virtual machines
- containers are free to use all the system resources they needs
- whereas in vms softwares has limited preallocated resources to use

### Docker Commands

```sh
#Creating a nginx container
docker run nginx

# run as detached mode
docker run -d nginx

# list running containers
docker ps 

# list all containers
docker ps -a

# kill running container
docker kill <container-id>

# expose container on random host port
docker run -P nginx

# expose container on custom host port
docker run -d -p 1313:8080 nginx:latest

# Stopping the container
docker stop <container id>

# removing stopped containers
docker rm <container id>

```
### References:
- https://www.geeksforgeeks.org/monolithic-vs-microservices-architecture/
- https://adventofdocker.com


