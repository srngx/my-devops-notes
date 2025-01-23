**1. Project Setup and Namespace Creation**
##### Booting up EC2 and Cluster
- Launch Ec2 instance
- Add IAM Role 
- Install Docker and Kubernetes Packages
- Create Cluster
##### Download Free css template
```sh
curl -O https://www.free-css.com/assets/files/free-css-templates/download/page296/neogym.zip

unzip neogym.zip

mv neogym-html/* html/
```


**2. Microservice 1: Nginx with Free CSS Template**

- **Dockerfile (Dockerfile_nginx):**

```Dockerfile
FROM nginx:stable-alpine3.20-perl 
COPY ./html/ /usr/share/nginx/html/
EXPOSE 80

CMD ["/usr/bin/nginx", "-g", "daemon off;"]
```

- **Build and Push Docker Image:**
```bash
# Build Image
docker build -t nginx-free-css:latest -f Dockerfile_nginx . 
# Add tag to repo-name/image name for docker hub push
docker tag nginx-css <repo-name>/nginx-css
# Push to docker hub repo
docker push nginx-free-css:latest
```

- **Create Kubernetes Namespaces:**
Create 3 Namespaces for 3 Microservices
```bash
kubectl create namespace dev-nginx
kubectl create namespace dev-httpd
kubectl create namespace dev-tomcat
```


#### Create Deployments
- **Kubernetes Deployment (dev-nginx namespace):**
```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: nginx-deployment
      namespace: dev-nginx
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: nginx
      template:
        metadata:
          labels:
            app: nginx
        spec:
          containers:
          - name: nginx
            image: nginx-free-css:latest
            ports:
            - containerPort: 80
```

- **Apply Deployment:**

```sh
kubectl apply -f nginx-deployment.yaml -n dev-nginx
```


**3. Microservice 2: HTTP Server with ConfigMap**

- **ConfigMap (dev-httpd namespace):**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: index-html
  namespace: dev-httpd
data:
  index.html: |
    <!DOCTYPE html>
    <html>
    <head>
      <title>HTTP Server</title>
    </head>
    <body>
      <h1>Hello from HTTP Server!</h1>
    </body>
    </html>
```
    
- **Deployment (dev-httpd namespace):**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: httpd-deployment
  namespace: dev-httpd
spec:
  replicas: 1
  selector:
    matchLabels:
      app: httpd
  template:
    metadata:
      labels:
        app: httpd
    spec:
      containers:
      - name: httpd
        image: httpd:latest 
        volumeMounts:
        - name: config-volume
          mountPath: /usr/local/apache2/htdocs/ 
      volumes:
      - name: config-volume
        configMap:
          name: index-html
```
    
- **Apply ConfigMap and Deployment:**

```sh
kubectl apply -f index-html.yaml -n dev-httpd
kubectl apply -f httpd-deployment.yaml -n dev-httpd
```
    

**4. Microservice 3: Tomcat**

- **Deployment (dev-tomcat namespace):**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tomcat-deployment
  namespace: dev-tomcat
spec:
  replicas: 1
  selector:
    matchLabels:
      app: tomcat
  template:
    metadata:
      labels:
        app: tomcat
    spec:
      containers:
      - name: tomcat
        image: tomcat:latest
        ports:
        - containerPort: 8080
```
    
- **Apply Deployment:**
```sh
kubectl apply -f tomcat-deployment.yaml -n dev-tomcat
```

**5. Nginx Ingress Controller (nginx-ingress namespace)**

- **Install Ingress Controller:**
   - Refer to the official Nginx Ingress Controller documentation for installation instructions.

**6. Ingress Configuration (nginx-ingress namespace)**

- **Create Ingress resource:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: microservices-ingress
spec:
  rules:
  - host: httpd.your-domain.com 
    http:
      paths:
      - path: /
        pathType: Prefix 
        backend:
          service:
            name: httpd-service 
            port:
              number: 80
  - host: tomcat.your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: tomcat-service
            port:
              number: 8080
  - host: nginx.your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-service
            port:
              number: 80
```

- **Create Services for each Deployment:**
   
   - You'll need to create Services of type `LoadBalancer` or `NodePort` for each Deployment to expose them.
- **Apply Ingress and Services:**

```
kubectl apply -f microservices-ingress.yaml -n nginx-ingress 
# Apply Service YAML files for each Deployment 
```


**7. DNS Configuration**

- Configure your DNS records to point the following domains to the Ingress Controller's IP address:
    - httpd.your-domain.com
    - tomcat.your-domain.com
    - nginx.your-domain.com

**8. Node Assignment (Manual)**

- **Node 1:** Schedule the `httpd-deployment` to run on Node 1.
- **Node 2:** Schedule the `tomcat-deployment` to run on Node 2.
- **Node 3:** Schedule the `nginx-deployment` to run on Node 3.

**Note:**

- Replace placeholders like `your-domain.com` with actual domain names.
- Adjust paths, ports, and other configurations as per your requirements.
- This is a basic example. You may need to adjust the configurations based on your specific needs and security requirements.
- Consider using a more robust service discovery mechanism like Kubernetes Service.
- For production environments, use a more advanced deployment strategy like rolling updates or blue/green deployments.
