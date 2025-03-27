---
Title: Autoscaling on Memory Utilization
tags:
  - autoscaling
  - EC2
---

## Scenario: 
Implement autoscaling on memory utilization trigger notification each time instance scale up and scale down with sns

**Implementing Autoscaling on Memory Utilization with SNS Notifications**
**Understanding the Components:**

1. **AWS Auto Scaling Group (ASG):** Manages a group of EC2 instances, automatically scaling them up or down based on predefined policies.
2. **Amazon CloudWatch:** Monitors various metrics, including memory utilization, from your EC2 instances.
3. **Amazon SNS:** A messaging service to send notifications to subscribed endpoints (e.g., email, SMS, or other AWS services).

### Step 1: Create an SNS Topic
- Navigate to the SNS console.
- Create a new topic.
- Give it a descriptive name (e.g., "AutoScalingNotifications").

![[autoscaling-notifications-created.png]]
### Step 2: Create an Auto Scaling Group

- Navigate to the EC2 console and select "Auto Scaling Groups".
- Create a new Auto Scaling group with the desired configuration:
    - **Launch Configuration:** Specify the AMI, instance type, security groups, etc.
    - **Scaling Policies:**
        - **Scaling Adjustment Policy:** Define the scaling adjustment (e.g., add or remove instances) based on specific conditions.
        - **Target Tracking Scaling Policy:** Set a target value for a specific metric (e.g., memory utilization) and let the ASG automatically adjust the number of instances to maintain that target.

![[launch-template-creation-snsautoscalinggroup123.png]]

Created **Launch Template** with this User data
```sh
#!/bin/bash
yum install nginx unzip -y
systemctl enable --now nginx
curl -O [https://www.free-css.com/assets/files/free-css-templates/download/page296/oxer.zip](https://www.free-css.com/assets/files/free-css-templates/download/page296/oxer.zip)
unzip oxer.zip
rm oxer.zip
mv oxer* /usr/share/nginx/html
systemctl restart nginx
```

![[autoscale-group-size.png]]

enable sns notification and select previously created sns topic
![[add-notification-in-auto-scaling-groups.png]]

![[choose-lauch-template-review.png]]

### Step 3: Configure CloudWatch Alarms
   - Navigate to the CloudWatch console.
    - Create an alarm for the "MemoryUtilization" metric:
        - **Metric Name:** MemoryUtilization
        - **Namespace:** AWS/EC2
        - **Statistic:** Average
        - **Period:** 5 Minutes (or as needed)
        - **Threshold:** Set the desired threshold (e.g., 80%)
        - **Comparison Operator:** Greater Than or Equal To
        - **Alarm Actions:** Select the SNS topic created in step 1.
- **Associate the Alarm with the Auto Scaling Group:**
    
    - In the Auto Scaling group settings, under "Notifications," add the CloudWatch alarm created in step 3.

Create Alarm
![[create-alarms-cloudwatch.png]]

select memory utilization metric
![[select-metric-cpu-utilization.png]]

![[select-matric.png]]


