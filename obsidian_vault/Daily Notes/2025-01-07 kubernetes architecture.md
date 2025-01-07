[[Kubernetes Architecture]]
![[kubernetes-cluster.svg]]
#### Creating cluster on aws

**Prerequisites**
- kubectl
- eksctl
- aws

eksctl.io/installation

**Steps**
1. create ec2 instance
2. add admin role on it
3. install **Prerequisites** on it

and run Create cluster command
```sh
eksctl create cluster --name clustername --node-type t2.medium --nodes 2 --region=us-east-1
```

See nodes
```sh
kubectl get nodes
```
see pods

```sh
kubectl get pods -A
```

write pod.yaml manifest and apply

```sh
kubectl apply -f pod.yaml
```

get info about pods
```bash
kubectl describe pod nginx
```

Manifest
YAML

POD
Repl set
Deployments
Services
	Load balancer
	Node pod
	cluster ip
config
	secrets
	configMap
Namespace
Resources
Resource Quota
Volume
Ingress
HPA

Pod.yaml
```YAMl
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - image:
    name:
    ports:
      container-port: 80
```

`s` comes `-` comes
`-` means array


cluster version updates comes in every 4 month

minimum n-2 version compatible for client to support with latest version of kubernetes

***
#### Tasks
1. [[Task 6 How to set permanent alias]]
2. [[Task 7 Create LAMP Server]]

#### Some Useful Ai for Research
https://www.perplexity.ai/
https://claude.ai/
https://chatgpt.com