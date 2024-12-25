---
Title: Implement Template with scheduled autoscaling
tags:
  - aws_tasks
  - autoscaling
  - EC2
  - LaunchTemplates
---
In this task we will be launching instance with userdata attach for setuping and starting nginx sever. We will create template out of that instance attach it to the autoscaling target groups. So when stress will be added to instance it should create another instances to balance the load.
## Required Actions
1. ✅ Launch instance 
2. ✅ Pass userdata 
3. ✅ Install nginx 
4. ✅ Create template from instance 
5. ✅ Implement that template into auto scaling 
6. ✅ Create scheduled autoscaling 
7. ✅ Start instance 
8. ✅ Add stress into instance 
9. ✅ Upgrade the template to nginx to httpd

## Step 1: Launch Instance
- **Name**: MyEc2Instance
- **AMI**: Amazon Linux (Free Tier)
- **Instance Type**: t2.micro (Free Tier)
- Select Key pair
- Select Common Security Group (which has 80, 22 port enabled)
- Click on Advanced Details and add following **Userdata**

```bash
#!/bin/bash
sudo yum install nginx unzip -y
sudo systemctl enable --now nginx
sudo curl -O https://www.free-css.com/assets/files/free-css-templates/download/page296/oxer.zip
sudo unzip oxer.zip
sudo rm oxer.zip
sudo mv oxer* /usr/share/nginx/html
sudo systemctl restart nginx
```

Click on Launch Instance.
### Result:

- ✅ Nginx page was successfully visible on root 
- ✅ And our template site is also visible on [http://35.160.157.246/oxer-html/](http://35.160.157.246/oxer-html/) 
![[welcome-to-nginx.png]]

![[html-template-final-site.png]]
## Step 2: Creating Launch Template from instance
To create Launch Template from running instance
Select your **Instance** Click **Actions** >> **Image and Templates** >> **Create Templates from Instance**
![[creating-launch-template-from-instance.png]]
Give Your template name and similar setting you gave in Step 1 and in Advanced tab make sure to add previous bash script as **Userdata** and create launch Template
![[summary-create-laumch-template.png]]

## Step 3: Implementing the template into autoscaling
In Ec2 Instance Left Sidebar scroll down to see Auto Scaling groups option
![[auto-scaling-groups.png]]
1. Click on Create AutoScaling group
2. Give name, Select Launch Template
3. Choose availability Zones
4. No load balancer
5. No VPC Lattice
6. Set Health check grace period to 100
7. Desired Capacity: 1
8. Max desired capacity: 3
9. For Autoscaling Policy Select Target Tracking Policy
10. Metric Type: Average CPU Utillization
11. Target Value: 30
12. Instance Warmup: 80 Seconds
Click on Create

After Creation Click on Template Name and in Automatic Scaling Tab select Scheduled Actions option
![[scheduled-actions.png]]

Create Scheduled Action


![[scheduled-autoscaling.png]]



Now it at that specific time your scheduled autoscaling will work the desired way and you'll get 2 instance launched minimum and maximum 2 if needed.
