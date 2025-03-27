---
Title: How to store aws load balancer logs in s3 bucket
tags:
  - aws_tasks
  - S3
  - load_balancer
---
## Steps:
1.    Create 2 instances and add http port and also install nginx enable it .
2.    For load balancer u will need target group
3.    Go to EC2 service scroll down u will see target groups
![[{8799CC1A-FB3F-4C46-89AC-E9EA4FA22C1E} 1.png]]
4.    Create target group > add instances > save and create .
![[{122014CE-B98D-499C-83AC-AD171883DF5B}.png]]
![[{76992DE6-07D5-4F62-BF3D-8BAC91D82994}.png]]
5.    Now create load balancer (Application load balancer) > configure it give name , vpc ,select availability zones, select Target Groups u created and create load balancer.
![[{B089AE33-8E08-44B4-BF14-89AC63880F3B}.png]]
![[{CC268607-25E9-442F-BAC8-171661E1F704}.png]]
6.    Check it your load balancer is working or not.
7.    If working , Create s3 bucket  and go to permission >  bucket policy and edit it :-
8.    Note :-  Find policy from this by searching on google enable access log of load balancer to s3

![[Pasted image 20241201200127.png]]
Policy :-
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws-us-gov:iam::elb-account-id:root"
      },
      "Action": "s3:PutObject",
      "Resource": "s3-bucket-arn"
    }
  ]
}
```
![[Pasted image 20241201200139.png]]
9.    Save it.

10.  Now go to load balancer u created > go to attributes section >  scroll down and u will see this monitoring sec enable access logs and add our bucket

![[Pasted image 20241201200203.png]]
11.           Save changes.
12.           U will see ur logs folder in ur s3 bucket.