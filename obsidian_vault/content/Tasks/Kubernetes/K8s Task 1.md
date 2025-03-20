---
Title: Static website deploy on Kubernetes
date: 2025-01-22
tags:
  - kubernetes
  - docker
---
### Deployment of Nginx Free CSS Template on K8s 

##### Step 1: Booting up EC2 and Cluster
- Launch Ec2 instance
- Add IAM Role 
- Install Docker and Kubernetes Packages
- Create Cluster
##### Step 2: Download Free css template
```sh
curl -O https://www.free-css.com/assets/files/free-css-templates/download/page296/neogym.zip

unzip neogym.zip

mv neogym-html/* html/
```
##### Step 2: Docker Image Creation
- Create Dockerfile
```Dockerfile
FROM nginx:stable-alpine3.20-perl 
COPY ./html/ /usr/share/nginx/html/
EXPOSE 80

CMD ["/usr/bin/nginx", "-g", "daemon off;"]
```

- Build Image and Push it to Docker hub
```
docker build . -t nginx-css

docker tag nginx-css <repo-name>/nginx-css

docker push <repo-name>/nginx-css
```
##### Step 3: Create Deployment file
```
# Create namespace
kubectl create ns dev-nginx
```

Deployment File
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-css
  namespace: dev-nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-css
  template:
    metadata:
      labels:
        app: nginx-css
    spec:
      containers:
      - name: nginx
        image: archsarangx/nginx-css
        ports:
        - containerPort: 80

---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: dev-nginx
spec:
  selector:
    app: nginx-css
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```



Installing Helm

https://helm.sh

