##### 1. Create a dockerfile for nginx container 

1. Create a Seperate folder and move to it
   `mkdir my_nginx_image && cd my_nginx_image`
2. Create a docker file with `vi Dockerfile`

```Dockerfile
FROM nginx:latest
COPY oxer-html /usr/share/nginx/html/.
```

3. Build the Image `docker build -t . my_nginx_image`
4. Run the container `docker run -dP my_nginx_image`

##### 2. Write dockerfile for amazonlinux running ngnix
```dockerfile
FROM amazonlinux:latest
RUN yun update && yum install nginx
EXPOSE 80
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
```

##### 3. Write dockerfile for tomcat application
```Dockerfile
FROM amazonlinux:latest
WORKDIR /opt
RUN yum update && yum install java-17 unzip -y
RUN curl -O https://dlcdn.apache.org/tomcat/tomcat-9/v9.0.98/bin/apache-tomcat-9.0.98.zip
RUN unzip apache-tomcat-9.0.98.zip
RUN chmod +x /opt/apache-tomcat-9.0.98/bin/catalina.sh 
EXPOSE 8080
CMD ["/opt/apache-tomcat-9.0.98/bin/catalina.sh", "run"]
```

### Backlinks
1. [[2024-12-31 Dockerfile Explained]]

