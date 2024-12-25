cloudwatch

after installing nginx logs must be present
```sh
sudo ls /var/log/nginx/
access.log  error.log
```


to send these logs to cloudwatch

create role

![[creating-role-for-ec2.png]]

attach role to instance

install agent
https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html

enable agent service
systemctl 

cd /opt/aws

create configuration file
 sudo /opt/aws/amazon-cloudwatch-agent/b
in/amazon-cloudwatch-agent-config-wizard

Log file path:
/var/log/nginx/access.log

config.json generated in bin folder



autorized vs authenticated read

![[amazon-cloudwatch-agent-configuration-file-validation-succeded.png]]

```sh
./amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:config.json
```
recap
1. Created ec2-instance
2. install nginx

ec2-describe permission

collectd file create

![[cloudwatch-log-events.png]]