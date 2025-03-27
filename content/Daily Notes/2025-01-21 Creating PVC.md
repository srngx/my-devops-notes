---
date: 2025-01-21
tags:
  - kubernetes
  - AWS
  - dailynotes
---
## Persistence Volume Claim
## Step 1: Create ec2 instance
- Add admin role (*administrator access*)

## Step 2: Login to ec2 instance

Install `kubectl` package
```sh
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

and `eksctl` 
```sh
ARCH=amd64
PLATFORM=$(uname -s)_$ARCH

curl -sLO "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"

# (Optional) Verify checksum
curl -sL "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_checksums.txt" | grep $PLATFORM | sha256sum --check

tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz

sudo mv /tmp/eksctl /usr/local/bin
```
Write this script into `script.sh` file and run it with `bash script.sh`

**Check if commands working properly**:
```sh
# see kubectl version
kubectl version

# see eksctl version
eksctl version
```

## Step 3: Create cluster
```sh
eksctl create cluster --name clustername --node-type t2.medium --nodes 2 --region=us-east-1
```

## Step 4: Set up AWS EBS storage integration with your EKS Cluster

#### Step 1: Get OIDC ID from cluster
```
oidc_id=$(aws eks describe-cluster --name irondome --region=us-west-2 --query "cluster.identity.oidc.issuer" --output text | cut -d '/' -f 5)
echo $oidc_id
```

You will get something like this: ==04B9B8B86AAB8AF93259FBD40DFF0D4C==
☠️Dont copy it it just for illustration.☠️

#### Step 2: Find and extract the OpenID Connect (OIDC) provider ID for an EKS cluster
```
aws iam list-open-id-connect-providers --region=us-west-2 | grep $oidc_id | cut -d "/" -f4 
```

#### Step 3: Creates an IAM OIDC (OpenID Connect) identity provider for your EKS cluster
```
eksctl utils associate-iam-oidc-provider --cluster irondome --approve --region=us-west-2
```

#### Step 4: Create an IAM role that allows the EBS CSI Driver to manage EBS volumes for your EKS cluster
```sh
eksctl create iamserviceaccount \
        --name ebs-csi-controller-sa \
        --namespace kube-system \
        --cluster irondome \
        --role-name AmazonEKS_EBS_CSI_DriverRole \
        --role-only \
        --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
        --approve  --region=us-west-2
```

## Step 5: Create CSI Driver addon

###### Check what versions of the AWS EBS CSI Driver addon are available and compatible with Kubernetes version 1.30 in your region
```
eksctl utils describe-addon-versions --kubernetes-version 1.30 --region=us-west-2 --name aws-ebs-csi-driver
```

###### Install the EBS CSI Driver addon to your EKS cluster:
```
eksctl create addon --cluster irondome --name aws-ebs-csi-driver --version latest \
      --service-account-role-arn arn:aws:iam::970547378605:role/AmazonEKS_EBS_CSI_DriverRole --force --region=us-west-2
```

## Step 6: Create pods
**Create a Pod definition file that:**
- Start an nginx container
- Mount an EBS volume (claimed through ebs-claim) at /data
- Store data persistently in the EBS volume even if the pod is deleted
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
  - name: nginx
    image: nginx
    volumeMounts:
    - name: persistent-storage
      mountPath: /data
  volumes:
  - name: persistent-storage
    persistentVolumeClaim:
      claimName: ebs-claim
```

create `claim.yaml`
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ebs-claim
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: gp2
  resources:
    requests:
      storage: 4Gi
```
This definition requests a 4GB persistent volume of type "gp2" (likely an EBS volume) that can be mounted by only one node at a time.

Practical Walkthrough Video 
https://drive.google.com/file/d/1lSwdeRuENgKLNIaqMpFCM9SosavuoSDb/view?usp=sharing
