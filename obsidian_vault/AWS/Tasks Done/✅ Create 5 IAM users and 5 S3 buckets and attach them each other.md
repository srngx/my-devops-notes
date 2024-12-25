---
Title: Create 5 IAM users and 5 S3 buckets and attach them each other
tags:
  - aws_tasks
  - IAM
  - S3
---
Task:
requirement: 
- [ ] Create 5 I am users
- [ ] Create 5 S3 Buckets
- [ ] assign each user their name specific bucket
- [ ] no one should able touch other users bucket


1. Created User s3-mango with default settings
2. Created s3 bucket s3-mango-bucket with default settings
after creation added following policy to bucket

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::970547378605:user/s3-mango"
      },
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::s3-mango-bucket",
        "arn:aws:s3:::s3-mango-bucket/*"
      ]
    }
  ]
}
```

Step 4: Assign IAM Policies to Users
Example for Alice:
Go to the IAM Console and open Alice.
Click Add Permissions, then Attach Policies Directly.
Create a custom policy for Alice:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::s3-mango-bucket",
        "arn:aws:s3:::s3-mango-bucket/*"
      ]
    }
  ]
}
```
Attach this policy to Alice.

granted =AmazonS3ReadOnlyAccess= to each users


# chat gpt 
Certainly! Let's go step-by-step with specific names for users and their buckets to make it clearer.

Scenario
We want to:

Create 5 users: Alice, Bob, Charlie, Dave, and Eve.
Create 5 buckets: alice-bucket, bob-bucket, charlie-bucket, dave-bucket, and eve-bucket.
Ensure that:
Alice can access only alice-bucket.
Bob can access only bob-bucket.
Similarly, each user has access only to their bucket.
Step 1: Create Users
Manually create the following users via the IAM Console:

Alice
Bob
Charlie
Dave
Eve
Step 2: Create Buckets
Manually create the following buckets via the S3 Console:

alice-bucket
bob-bucket
charlie-bucket
dave-bucket
eve-bucket
Step 3: Set Permissions for Each Bucket
Example for Alice:
Go to the S3 Console and open alice-bucket.

Go to the Permissions tab, then Bucket Policy.

Add this bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT_ID:user/Alice"
      },
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::alice-bucket",
        "arn:aws:s3:::alice-bucket/*"
      ]
    }
  ]
}
```
Replace ACCOUNT_ID with your AWS account ID.

Save the policy.

Repeat this step for:

Bob with bob-bucket
Charlie with charlie-bucket
Dave with dave-bucket
Eve with eve-bucket
Step 4: Assign IAM Policies to Users
Example for Alice:
Go to the IAM Console and open Alice.
Click Add Permissions, then Attach Policies Directly.
Create a custom policy for Alice:
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::alice-bucket",
        "arn:aws:s3:::alice-bucket/*"
      ]
    }
  ]
}
```

Attach this policy to Alice.
Repeat this step for:

Bob with bob-bucket
Charlie with charlie-bucket
Dave with dave-bucket
Eve with eve-bucket
Step 5: Test Access
Log in as Alice and try to:
Upload a file to alice-bucket (should work).
Access bob-bucket (should fail).
Repeat the process for Bob, Charlie, Dave, and Eve to ensure they can only access their respective buckets.
How This Works
Each user has a bucket policy on their bucket that allows only them to access it.
Each user also has an IAM policy that allows them to access only their bucket.
This ensures that the permissions are restricted at both the bucket level and the user level.
Let me know if you need help applying this setup!
creating bucket

1. bucket name: s3-mango bucket

object ownership -   
ACLs disabled (recommended)

Block Public Access settings for this bucket
block all public access turn on

2. Create user =mango=
password- myPassw0rd

3. Created policy called =my-s3-mango-bucket-policy=
 Permissions defined in this policy
```json
 {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::s3-mango-bucket"
        }
    ]
}
```

attached this policy to user

![[IAM-user-creating-review-and-create.png]]

