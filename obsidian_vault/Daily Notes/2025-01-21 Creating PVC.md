Step 1: Create instance
		Add admin role [administrator access]

Step 2: Login to ec2

Install kubectl and eksctl package

Step 3: Create cluster

Step 4: OIDC 
```
oidc_id=$(aws eks describe-cluster --name irondome --region=us-west-2 --query "cluster.identity.oidc.issuer" --output text | cut -d '/' -f 5)
echo $oidc_id
```
04B9B8B86AAB8AF93259FBD40DFF0D4C


```
aws iam list-open-id-connect-providers --region=us-west-2 | grep $oidc_id | cut -d "/" -f4 
```

```
eksctl utils associate-iam-oidc-provider --cluster irondome --approve --region=us-west-2
```

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

Step 5: create addon
```
eksctl utils describe-addon-versions --kubernetes-version 1.30 --region=us-west-2 --name aws-ebs-csi-driver
```

```
eksctl create addon --cluster irondome --name aws-ebs-csi-driver --version latest \
      --service-account-role-arn arn:aws:iam::970547378605:role/AmazonEKS_EBS_CSI_DriverRole --force --region=us-west-2
```

Step 6: create pods
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

create claim.yaml
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

Practical Walkthrough Video 
https://drive.google.com/file/d/1lSwdeRuENgKLNIaqMpFCM9SosavuoSDb/view?usp=sharing
