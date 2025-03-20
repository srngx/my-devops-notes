---
date: 2024-12-16
title: Aws Services Simply Explained
tags:
  - notes
  - AWS
  - SimpleMeanings
  - Links
  - blog
---
This is the list of AWS resources required for Entry level devops interview preparation. Sometimes we struggle to explain the definition we already know it's usecase in simpler terms. So I curated this list. The ones written in *Italian* is my own hand crafted lines while others mostly generated from Gemini Ai.

 - **EC2 (Elastic Compute Cloud)**:  Like renting virtual computers in the cloud, you can run whatever software you want on them.

   *Its like vps or vms in the cloud, they are scalable, flexible and cheaper.*

 - **VPC** is like having your own private network within the cloud. It lets you create a secure and isolated space for your resources, like your own little corner of the internet in AWS with all the required tools to create a network such as subnets, route table, internet gateway, VPNs, etc.
   
 - **Load Balancer**: Distributes traffic across multiple EC2 instances so your application can handle more users and is more resilient.
   
 - **CloudWatch**:  Monitors your AWS resources and applications, collecting metrics and logs to help you understand performance and troubleshoot issues.

   *Aws provide cloudwatch service to monitor and manage logs of resources to help user getting better performance and troubleshoot issues.*
   
 - **CloudFront**: A content delivery network (CDN) that makes your websites and applications faster by caching content closer to your users.

   *Cloudfront is aws managed CDN to caching the content closer to users to make websites and applications faster.*
   
 - **S3 (Simple Storage Service)**:  Like a hard drive in the cloud for storing all sorts of files, from websites to backups.

   *Aws managed storage service like a Google drive to store all sorts of files and store backups*
   
 - **EFS (Elastic File System)**:  A network file system that lets you share files between multiple EC2 instances.
   
 - **RDS (Relational Database Service)**: Makes it easy to set up and manage databases in the cloud, like MySQL, PostgreSQL, and Oracle.

   
 - **Route 53**: A scalable DNS service that translates domain names (like google.com) into IP addresses.
   
 - **Lambda**: Lets you run code without provisioning or managing servers; you only pay for the compute time you use.
   *Serverless compute*

 - **SNS (Simple Notification Service)**: A messaging service that can send notifications to various destinations, like email, SMS, and other applications.

- **SQS (Simple Queue Service)**: Like a post office box in the cloud. You put messages in it (like tasks to be done), and other services can pick them up later. This helps keep different parts of your application loosely connected and make things more reliable.

- **EBS (Elastic Block Store)**: Think of it as a fast hard drive in the cloud. You can attach it to an EC2 instance (your virtual computer) to store data. This is great for things like databases or file storage.

  *Ebs is like virtual hard drive that can be attached to ec2 instances and its scalable and you can adjust performance and type according to your need.*