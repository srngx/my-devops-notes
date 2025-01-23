[[Kubernetes Architecture]]
![[kubernetes-cluster.svg]]
#### Creating cluster on aws

**Prerequisites**
- kubectl
- eksctl
- aws

**Steps**
1. create ec2 instance
2. add admin role on it
3. install **Prerequisites** on it

Install **kubectl** binary from [official website](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
```sh
# for x86_64
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# for arm64
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl"
```

Install **eksctl** binary from its [official website](https://eksctl.io/installation)

```sh
# for ARM systems, set ARCH to: `arm64`, `armv6` or `armv7`
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

and run **Create Cluster** command
```sh
eksctl create cluster --name clustername --node-type t2.medium --nodes 2 --region=us-east-1
```

To See nodes
```sh
kubectl get nodes
```

To See pods
```sh
kubectl get pods -A
```

write `pod.yaml` manifest and apply
```sh
kubectl apply -f pod.yaml
```

get info about pods
```bash
kubectl describe pod nginx
```

Read about:

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