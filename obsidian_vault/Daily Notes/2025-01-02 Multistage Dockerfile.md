### Multistage Dockerfile

#### Traditional Method
```Dockerfile
FROM amazonlinux:latest
RUN yum update && yum install java-17 unzip -y
copy tomcat /tomcat/.
RUN chmod +x /opt/apache-tomcat-9.0.98/bin/catalina.sh 
EXPOSE 8080
COPY studentui studentui/.
WORKDIR /studentui
RUN mvn clean package
RUN mv target/*.war /tomcat/webapps/student.war
CMD ["/tomcat/bin/catalina.sh", "run"]
```

#### Multistage Method
```Dockerfile
FROM maven:3.9.9-amazoncorretto-8-debian-bookworm AS builder
COPY student-ui /.
RUN mvn clean package     # build in target/*.war

FROM tomcat:jre8:alpine
COPY --from=builder /target/*.war webapps/student.war
```


