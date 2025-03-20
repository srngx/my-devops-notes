---
Title: Host static website on s3 bucket
tags:
  - aws_tasks
  - S3
---
## Requirement:
- [x] Create a bucket
- [x] add website template inside bucket
- [x] enable static website hosting option
- [x] view the website



## Step 1 - Creating a bucket
![[create-a-bucket-button.png]]

- Goto aws **S3 bucket creation page**
- Click on *create bucket* button
- Select **Bucket Type** as *General Purpose*
- Give any **Bucket Name** of your desire (name should be globally unique)

![[create-bucket-s3-cdec-bucket.png]]

- Here I set **s3-cdec-bucket**
- Leave default setting as it is like **ACLs disabled on** 
- Clear all **Block _all_ public access** option
- I set **bucket versioning** enabled
- Leave other setting as it is and click on **create bucket**

Here my s3 bucket is created
![[created-bucket.png]]

## Step 2 - Uploading website files into bucket

You can upload your website files if you have but I'll use free website template
from https://www.free-css.com/

Download any template from this site and upload the extracted content from the zip over the bucket

I downloaded this template called browny https://www.free-css.com/free-css-templates/page296/browny
![[download-free-css-template-zip.png]]

Its gave me zip file.
I'll be extracting it and uploading the folder into the bucket

![[extract-template-zip.png]]

It contains these files 
![[template-files-downloaded.png]]

- Lets upload the files into the root of the s3 bucket

![[s3-cdec-bucket-uploading-files.png]]

Click on your bucket name in s3 bucket list and click on upload button
then click on add files

you can also drag n drop files and folder 

Click on Add files to add files and Add folder to upload folder
![[upload-files.png]]

After the files are shown like this finally click on upload button

After the files gets uploaded click on your s3 bucket name and goto properties and 
![[s3-cdec-bucket-properties-tab.png]]

and scroll down till you see **Static Website Hosting** option

![[static-website-hosting.png]]

click on **edit** button and enable it
after enabling it select **Hosting type** as *host a static website*
![[enabling-static-website-hosting.png]]

and specify the **index document** as index.html
![[index-document.png]]
Now Static website option should be updated with the link to access our newly hosted static website link

![[static-website-enabled-success.png]]
Click on the **Bucket website endpoint** url or open it in another tab

## Step 3 - Create policy

but before this link to even work we need to specify a permission policy to be able to see our site

Under the permission tab click **Edit bucket policy**
copy and paste this policy and save changes
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name/*"
            ]
        }
    ]
}

```

The provided JSON defines an AWS IAM policy that grants public read access to all objects in an S3 bucket named "your-bucket-name".

replace **your-bucket-name** with your bucket name

save changes and see the link now your site should be visible.
now our website is visible over this url http://s3-cdec-bucket.s3-website-us-west-2.amazonaws.com/

![[static-website-success-final-image.png]]
