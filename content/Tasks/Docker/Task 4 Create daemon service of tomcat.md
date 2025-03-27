---
Title: Task 4 - Create Daemon Service for tomcat
date: 2024-12-30
tags:
  - systemd
  - devops_tasks
  - linux
---
The simplest possible script I could make for tomcat is this one

```bash
# make catalina.sh executable
chmod +x ~/apache-tomcat-9.0.98/bin/catalina.sh 

# navigate to systemd services directory
cd /etc/systemd/system

# Create new tomcat service file
vi tomcat.service
```

Add this script 
```bash
[Unit]
Description=Tomcat Service Daemon

[Service]
Type=forking
ExecStart=home/ec2-user/apache-tomcat-9.0.98/bin/catalina.sh start
ExecReload=/home/ec2-user/apache-tomcat-9.0.98/bin/catalina.sh start
ExecStop=/home/ec2-user/apache-tomcat-9.0.98/bin/catalina.sh stop

[Install]
WantedBy=multi-user.target
```

Run these commands afterwards
```bash
# Reloading the systemd daemon
systemctl daemon-reload

# Enabling and starting tomcat.service
systemctl enable --now tomcat.service

# Checking Status of our service
systemctl status tomcat.service
```

However this isnt sufficient for tomcats full usecase
for that you need to add Environment Variables
```bash
# Set environment variables (optional but recommended) 

# Update with your Java installation path
Environment=JAVA_HOME=/usr/lib/jvm/jre 

# Update with your Tomcat PID file path 
Environment=CATALINA_PID=/home/ec2-user/apache-tomcat-9.0.98/temp/tomcat.pid 

# Update with your Tomcat installation path 
Environment=CATALINA_HOME=/home/ec2-user/apache-tomcat-9.0.98 

# Update with your Tomcat base directory 
Environment=CATALINA_BASE=/home/ec2-user/apache-tomcat-9.0.98 

# Customize JVM options 
Environment='CATALINA_OPTS=-Xms512M -Xmx1024M -server -XX:+UseParallelGC'
Environment='JAVA_OPTS=-Djava.awt.headless=true -Djava.security.egd=file:/dev/./urandom'

```

also for security purposes its recommended to use tomcat service as a dedicated tomcat user

after making changes in the file its important to reload systemd daemon with `systemctl daemon-reload` and restarting the tomat service and check the status.

If everything is working and your tomcat page is displaying on port 8080 it means your tomcat service is successfully working.

