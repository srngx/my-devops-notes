---
Title: Create notification for s3 bucket put and delete activity
tags:
  - SNS
  - aws_tasks
  - S3
---
### Scenario: 
Whenever a new object is added or deleted in **s3 bucket** you will get **notification** via email

## Step 1: Create **a bucket** from s3 service.

![[Create-bucket.png]]
## Step 2: Create an SNS topic with the help of SNS service
![[create-topic.png]]
  Create an topic > go to access policy and add a policy
  
![[sns-create-topic-access-policy.png]]

Click on Advanced and Paste this code.
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "s3.amazonaws.com"
      },
      "Action": "SNS:Publish",
      "Resource": "arn:aws:sns:us-west-2:970547378605:sns-s3-topic123",
      "Condition": {
        "ArnLike": {
          "aws:SourceArn": "arn:aws:s3:::snsbucket123testing"
        }
      }
    }
  ]
}
```

>[!Tip]
>In above JSON code edit "Resource"  block to replace the **ARN id** according to your **sns topic's Arn id** and `aws:SourceArn` to your **S3 bucket's ARN** id.
>or in last two fields just change your AWS account id and topic name
> ` "Resource": "arn:aws:sns:ap-south-1:<your-aws-account-id>:<sns-topic-name>" `
> `"aws:SourceArn": "arn:aws:s3:::<s3-bucket-name>"`

## Step 3: Create subscription
   After Topic is created Create Subscription to get notifications 
  
![[sns-create-subscription.png]]
 Set:
   - **Topic ARN**: Your previously created Topic's ARN ID
   - **Protocol**: Email
   - **Endpoint**: Your Gmail address
Click on **create subscription** button

After your subscription is created, you'll get a mail to **confirm it**.

![[email-subscription-confirmation.png]]
  Goto your mail and click on **Confirm Subscription** link.
  ![[sns-subscription-mail.png]]
## Step 4: Setting up Event Notification in S3 Bucket
Now go to your buckets
- **Select Your Bucket**:
- Choose the bucket for which you want to set up notifications.
- Go to the **Properties** tab.
![[snsbucket123testing-overview.png]]

- Scroll down to **Event notifications** and click **Create event notification**.
![[creating-snsbucket123testing-event-notification.png]]
- Click on **Create event notification** 
- **Event name:** put_and_delete_event
- **Event types**: 
   - Select put checkbox
   - Permanently Deleted checkbox
![[Pasted image 20241201210604.png]]
- Scroll down u will see Destination Option 
   - select **SNS topic** 
   - choose your previously created SNS Topic 
   - Click on **Save changes**
 ![[selecting-sns-topic-s3-bucket.png]]
Try adding new files in bucket you should get notification in your mail.
![[uploading-files-s3-bucket.png]]

![[sns-topic-email-notification.png]]


