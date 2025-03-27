---
Title: Get SNS Alert for New instance launches
tags:
  - aws_tasks
  - EC2
  - SNS
---
### Scenario: 
Whenever u r launching instance u will get a event and also u have to get details

## Step 1: Create an SNS topic
- Create Topic
   - **Type**:  Standard
   - **Name**: NotifyonInstanceLaunch
   
- Create subscription 
   - Select **Topic ARN**
   - **Protocol:** E-mail 
   - **Endpoint:** archsarangx@gmail.com
   - **check your mails and confirm subscription** 

4.    Go to **Amazon Event bridge** service .
5.    In buses section go to rules and Create rule
![[create-eventbridge-rules.png]]
In step 2 **Build event pattern** scroll down to bottom
In Event Pattern section add configuration like this:
- **Event Source**: AWS Service
- **AWS Service**: EC2
- **Event Type**: EC2 Instance State-change Notification
![[event-pattern-eventbridge-rules.png]]
Click Next and in Step 3 Select Target page Select
- **Target Type**: AWS Service
- **Select a target**: SNS Topic
- **Topic**: your topic name

![[selecting-target-amazon-eventbridge-rules-creation.png]]
9.    Create target and at last create rule

 You will get a notifications while Launching and terminating instance


