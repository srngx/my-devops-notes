---
title: Bookstore Application Deployment on K8S
date: 2025-04-27
tags:
  - project
---
## Containerize the application

#### Step 1: Log in to Container Registry

```sh
docker login ghcr.io
```

This command will **prompt you to enter your GitHub username and password**. When prompted in the terminal, select the _HTTP method_ for authentication.

> 💡 This will open a new browser window where you'll need to **approve the sign-in request** to GitHub.

_**Note:**_ This authentication is temporary and tied to your current lab environment. Once your virtual environment is deleted, this access will be gone as we don't permanently store your credentials for security reasons.  
  
Now clone the latests codebase for bookstore application

```sh
git clone https://github.com/prepare-sh/devops-project-bookstore
```

# Step 2: Containerize the Python API

Let's create a Dockerfile for our backend API:

Navigate to the API directory:

```bash
cd /home/labs/devops-project-bookstore/api
```

Create a new Dockerfile:

```bash
code Dockerfile
```

Add the following content to your Dockerfile:

```dockerfile
# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
# If you haven't created a requirements.txt, you can do so with the Python command: pip freeze > requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=main.py
ENV FLASK_RUN_HOST=0.0.0.0

# Run app.py when the container launches
CMD ["flask", "run"]
```

**Save** the file using `Ctrl+S` (Windows/Linux) or `Cmd+S` (Mac)

#### Build the Docker Image 🏗️

Now, let's build the Docker image from our Dockerfile:

> 🖼️ What is Docker Image? [+]

```bash
docker build -t bookstore-api:1.0 .
```

This command builds a Docker image with the tag `1.0`.

> 🏷️ What is Docker Tag? [+]

#### Push the Image to GitHub Container Registry 🚀

Now let's push our newly built image to GitHub Container Registry:

```bash
docker push ghcr.io/<your-github-username>/bookstore-api:1.0
```

This will upload your container image to the GitHub Container Registry, making it available for deployment anywhere.

#### Verify Your Image 🔍

After about a minute, check your GitHub packages to confirm the image was pushed successfully:

1. Visit: `https://github.com/<your-github-username>?tab=packages`
2. You should see your newly published `bookstore-api` container image in the list!

> _**Congratulations!**_ 🎉 You've successfully containerized your Python API and published it to a container registry! This is a huge step toward making your application deployable in cloud environments.


# Step 3: Dockerfile for the Frontend UI

Let's create a proper Dockerfile for your React UI application, build it as a Docker image, and push it to GitHub Container Registry just like we did for the backend API.

## Create the Frontend Dockerfile

First, let's navigate to the UI directory and create a Dockerfile:

```bash
cd /home/labs/devops-project-bookstore/ui
```

```bash
code Dockerfile
```

Add the following content to your Dockerfile:

```dockerfile
FROM node:16-alpine as build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code and build
COPY . .
RUN npm run build

# Use a simpler image for running the app
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy build from the previous stage
COPY --from=build /app/build ./build

# Copy server.js file from the build stage
COPY --from=build /app/server.js ./

# Install required packages for the server
RUN npm init -y && \
    npm install serve-handler http-proxy-middleware

# Expose port
EXPOSE 3000

# Serve the app on port 3000
CMD ["node", "server.js"]
```

**Save** the file using `Ctrl+S` (Windows/Linux) or `Cmd+S` (Mac)

## Build the Docker Image 🏗️

Now, let's build the Docker image from our Dockerfile:

```bash
docker build -t bookstore-ui:1.0 .
```

This command builds a Docker image with the tag `ghcr.io/<your-github-username>/bookstore-ui:1.0`.

## Push the Image to GitHub Container Registry 🚀

Now let's push our newly built UI image to GitHub Container Registry:

```bash
docker push ghcr.io/<your-github-username>/bookstore-ui:1.0
```

This will upload your UI container image to the GitHub Container Registry.

## Verify Your Image 🔍

After about a minute, check your GitHub packages to confirm the UI image was pushed successfully:

1. Visit: `https://github.com/<your-github-username>?tab=packages`
2. You should see both your published `bookstore-api` and `bookstore-ui` container images in the list!

> _**Congratulations!**_ 🎉 You've successfully containerized both your backend API and frontend UI applications and published them to a container registry! This multi-container setup is now ready for deployment in various cloud environments.

# Deploying UI and API in Kubernetes

First, let's create the deployment and service for our backend API.

## API Deployment

Create a file named `bookstore-api-deployment.yaml`:

```sh
code bookstore-api-deployment.yaml
```

Add the content below into the file and save it.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bookstore-api
  labels:
    app: bookstore-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: bookstore-api
  template:
    metadata:
      labels:
        app: bookstore-api
    spec:
      containers:
      - name: bookstore-api
        image: ghcr.io/<your-github-username>/bookstore-api:1.0 # Change this
        ports:
        - containerPort: 5000
```

This manifest creates a Deployment that manages a single replica (pod) of our API. A Deployment ensures our application stays running - if the pod crashes, Kubernetes automatically replaces it. The `containerPort` tells Kubernetes that our API listens on port 5000.

> What is Kubernetes Deployment? [+]
> 
> A **Kubernetes Deployment** is a high-level abstraction in Kubernetes that defines how applications should be deployed and managed on a cluster. Essentially, it allows you to describe the desired state of your application, and Kubernetes automatically ensures that this state is maintained.
> 
> ### Key Features:
> 
> 1. **Declarative Updates**: You define _what you want_ (e.g., number of replicas, container image versions), and Kubernetes handles the rest.
> 2. **Scaling**: Deployments allow you to easily scale up or down the number of application instances (pods).
> 3. **Rolling Updates**: They provide a way to update your application without downtime by incrementally replacing old instances with new ones.
> 4. **Self-healing**: If pods fail or go unresponsive, Kubernetes automatically replaces them to match the desired state.
> 
> ### Example Usage:
> 
> If you want to deploy a web application with 3 replicas running in a `nginx` container, you'd write a **Deployment manifest** (typically in YAML or JSON) specifying the container image, replicas, and configuration. Kubernetes ensures these 3 instances are always running, and if one fails, it automatically recreates it.
> 
> ### Why It's Used:
> 
> Deployments simplify application lifecycle management by automating repetition-prone tasks like scaling, updates, and recovering from failures. It's widely used to ensure applications are resilient, reliable, and aligned with the goals of DevOps and modern cloud environments.

> Why there are different ports in the application to listen? [+]

Apply the deployment:

```bash
kubectl apply -f bookstore-api-deployment.yaml
```

Applying deployment will create a Pod in the Kubernetes. Pod can contain many containers within itself, in this particular case our API Pod has only one container which is Python API Docker Imaeg.

> What is Kubernetes Pod and how it differs from the Deployment? [+]

#### API Service

Now create a file named `bookstore-api-service.yaml`:

```sh
code bookstore-api-service.yaml
```

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector:
    app: bookstore-api
  ports:
  - port: 80
    targetPort: 5000 # This has to match our Pod's port
  type: ClusterIP
```

Apply kubernetes service file

```nginx
kubectl apply -f bookstore-api-service.yaml
```

A Service provides a stable network identity (DNS name) and IP address for our API pods. It routes traffic to any pod with the label `app: bookstore-api`. The `ClusterIP` type makes the service only accessible within the cluster - perfect for an internal API that should only be called by our frontend.  
  

> What service types other than ClusterIP do we have in Kubernetes and why? [+]

Below is Kubernetes Networking diagram although not part of this Project, it is good to have some knowledge about underlying architecture.  
  

An overlay network is a virtual network built on top of another network. In the context of Kubernetes, it helps connect all the pods (containers) across different nodes in the cluster. This allows the pods to communicate with each other as if they are on the same network, even if they are physically on different machines. The overlay network abstracts the underlying physical network and makes it simpler to manage connectivity within the Kubernetes cluster.  
  

![[Pasted image 20250427142637.png]]

> What is CNI Plugin in and why its is used in Kubernetes? [+]
> 
> A **CNI (Container Network Interface) Plugin** is a networking component in Kubernetes that provides connectivity to pods within a cluster. It is a specification developed by the _Cloud Native Computing Foundation (CNCF)_ aimed at defining how containerized workloads should connect to a network.
> 
> ### What is its purpose in Kubernetes?
> 
> Kubernetes relies on CNI plugins to set up and manage the network connectivity for pods. When a pod is created, Kubernetes uses a CNI plugin to allocate IP addresses to the pod and configure the necessary networking components, such as routing and network isolation.
> 
> ### Why is it used?
> 
> - **Pod-to-Pod Communication:** CNI plugins enable seamless communication between pods in the cluster.
> - **Dynamic Networking:** They allow dynamic networking configurations as containers are added, moved, or removed.
> - **Custom Networking Policies:** CNI plugins support advanced features like implementing network policies for security and traffic control.
> - **Flexibility:** Kubernetes does not have a built-in networking implementation, so CNI plugins allow users to choose a networking solution that fits their needs.
> 
> ### Examples of CNI Plugins:
> 
> Some popular CNI plugins used with Kubernetes are:
> 
> 1. **Calico:** Provides networking and network policies for secure and high-performance communication.
> 2. **Flannel:** Implements a basic overlay network and is simpler but less feature-rich.
> 3. **Weave:** Offers a simple and automatic networking solution.
> 4. **Cilium:** Focuses on layer 7 (application layer) security and observability with advanced networking capabilities.
> 
> ### How it is used:
> 
> When deploying Kubernetes, you'll typically select and install a CNI plugin to provide networking functionality. Kubernetes interacts with the plugin via its configuration files to ensure pods are connected and isolated as required. For example:
> 
> - When a pod starts up, the _kubelet_ invokes the CNI plugin to allocate an IP address and configure routes.
> - The plugin ensures containers within the pod can communicate internally and externally.
> 
> In summary, CNI plugins are essential for Kubernetes clusters to ensure proper networking, security, and scalability of container workloads.

# Step 2: UI Deployment

Now, let's set up the frontend UI component.

## UI Deployment

Create a file named `bookstore-ui-deployment.yaml`:

```css
code bookstore-ui-deployment.yaml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bookstore-ui
  labels:
    app: bookstore-ui
spec:
  replicas: 1
  selector:
    matchLabels:
      app: bookstore-ui
  template:
    metadata:
      labels:
        app: bookstore-ui
    spec:
      containers:
      - name: bookstore-ui
        image: ghcr.io/<your-github-username>/bookstore-ui:1.0 # Change this
        ports:
        - containerPort: 3000
```

Similar to the API deployment, this creates a single replica of our UI.  
  

Apply the deployment:

```bash
kubectl apply -f bookstore-ui-deployment.yaml
```

#### UI Service

Create a file named `bookstore-ui-service.yaml`:

```css
code bookstore-ui-service.yaml
```

```yaml
apiVersion: v1
kind: Service
metadata:
  name: ui
spec:
  selector:
    app: bookstore-ui
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP
```

Apply the service:

```bash
kubectl apply -f bookstore-ui-service.yaml
```

# Step 3: Publish Application

## Understanding Service LoadBalancer

When we need to make our application accessible from the internet, Kubernetes offers several ways to expose services. One of the most common approaches in cloud environments is using a `LoadBalancer` service type.  
  

When you create a service with `type: LoadBalancer` in a cloud environment, Kubernetes communicates with the underlying cloud provider's API to provision an actual network load balancer in that cloud.

```pgsql
┌─────────────────────────────────────────────────────────────┐
│                  Kubernetes Cluster                         │
│                                                             │
│  ┌──────────────┐      ┌─────────────┐                      │
│  │  Service     │      │ Cloud       │                      │
│  │  (LoadBalancer)────→│ Provider API│                      │
│  └──────────────┘      └─────────────┘                      │
│         │                     │                             │
│         │                     │                             │
│         │                     ▼                             │
│  ┌──────▼─────┐      ┌─────────────────────┐                │
│  │  Pods      │      │ External Load       │                │
│  │            │◄─────│ Balancer (AWS ELB,  │◄───── Internet │
│  └────────────┘      │ GCP LB, Azure LB)   │                │
│                      └─────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## How a Website Request Works from Domain to Application

> **Skip if you know this**  
> When you enter a domain name in your browser, your request follows a clear path to reach the application.  
> First, your domain name (like example.com) gets translated to an IP address that identifies where the website is hosted on the internet.  
> The request arrives at a **load balancer** which distributes traffic across multiple servers to maintain performance and availability during busy periods.  
> Next, the request enters a **Kubernetes cluster**, which is a platform that manages containerized applications. Inside this cluster, the **Ingress Controller** acts as an entry point, determining where to send your specific request based on rules like the URL path.  
> The Ingress Controller directs your request to the correct **Service**, which is a stable way to access a group of containers that run the same application.  
> From the Service, your request reaches a **Container** - a package containing the application and everything it needs to run consistently.  
> Finally, inside the container, the **Application** code processes your request, performs any necessary operations, and generates a response that travels back through the same path to your browser.  
> This entire process happens quickly, delivering the website content to your screen in moments.

## Exposing Our UI in Our Kubernetes Environment

In our lab environment, we already have a load balancer set up through an ingress controller. Instead of creating a new cloud load balancer, we'll leverage this existing infrastructure.

To expose our UI service through this ingress controller, we'll use:

```bash
kubectl annotate svc ui prepare.sh/expose=3000
```

This command adds an annotation to our UI service that tells the ingress controller to:

1. Create a route to our service
2. Expose it on port 3000
3. Configure the necessary rules in the existing load balancer

Once executed, our UI will be accessible through the ingress controller's IP address or hostname on port 3000.

> ⚠️ Understanding ingress controllers will be crucial as we scale our application and add more components in the future.

_**[Check this Lab](https://prepare.sh/lab/nginx-ingress-controller-in-kubernetes) to learn more about Ingress Controller**_

# Step 3: Publish Application

## Understanding Service LoadBalancer

When we need to make our application accessible from the internet, Kubernetes offers several ways to expose services. One of the most common approaches in cloud environments is using a `LoadBalancer` service type.  
  

When you create a service with `type: LoadBalancer` in a cloud environment, Kubernetes communicates with the underlying cloud provider's API to provision an actual network load balancer in that cloud.

```pgsql
┌─────────────────────────────────────────────────────────────┐
│                  Kubernetes Cluster                         │
│                                                             │
│  ┌──────────────┐      ┌─────────────┐                      │
│  │  Service     │      │ Cloud       │                      │
│  │  (LoadBalancer)────→│ Provider API│                      │
│  └──────────────┘      └─────────────┘                      │
│         │                     │                             │
│         │                     │                             │
│         │                     ▼                             │
│  ┌──────▼─────┐      ┌─────────────────────┐                │
│  │  Pods      │      │ External Load       │                │
│  │            │◄─────│ Balancer (AWS ELB,  │◄───── Internet │
│  └────────────┘      │ GCP LB, Azure LB)   │                │
│                      └─────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## How a Website Request Works from Domain to Application

> **Skip if you know this**  
> When you enter a domain name in your browser, your request follows a clear path to reach the application.  
> First, your domain name (like example.com) gets translated to an IP address that identifies where the website is hosted on the internet.  
> The request arrives at a **load balancer** which distributes traffic across multiple servers to maintain performance and availability during busy periods.  
> Next, the request enters a **Kubernetes cluster**, which is a platform that manages containerized applications. Inside this cluster, the **Ingress Controller** acts as an entry point, determining where to send your specific request based on rules like the URL path.  
> The Ingress Controller directs your request to the correct **Service**, which is a stable way to access a group of containers that run the same application.  
> From the Service, your request reaches a **Container** - a package containing the application and everything it needs to run consistently.  
> Finally, inside the container, the **Application** code processes your request, performs any necessary operations, and generates a response that travels back through the same path to your browser.  
> This entire process happens quickly, delivering the website content to your screen in moments.

## Exposing Our UI in Our Kubernetes Environment

In our lab environment, we already have a load balancer set up through an ingress controller. Instead of creating a new cloud load balancer, we'll leverage this existing infrastructure.

To expose our UI service through this ingress controller, we'll use:

```bash
kubectl annotate svc ui prepare.sh/expose=3000
```

This command adds an annotation to our UI service that tells the ingress controller to:

1. Create a route to our service
2. Expose it on port 3000
3. Configure the necessary rules in the existing load balancer

Once executed, our UI will be accessible through the ingress controller's IP address or hostname on port 3000.

> ⚠️ Understanding ingress controllers will be crucial as we scale our application and add more components in the future.

_**[Check this Lab](https://prepare.sh/lab/nginx-ingress-controller-in-kubernetes) to learn more about Ingress Controller**_

# Step 4: Check UI

The deployment of your application to the Kubernetes environment is now **complete**. The application is running in containers, managed by Kubernetes, and accessible through the Ingress Controller. ✅  
  

To verify everything is working correctly, open your web browser 🌐 and navigate to your domain address. The request will flow through the load balancer, Kubernetes, the Ingress Controller, Service, and finally to your application container.  
  

_**Check that the user interface loads properly**_ and test the core functionality to ensure the application is responding as expected. If you see your application working in the browser, the deployment has been successful! 🎉

> [https://3000-neovoid378.env.prepare.sh](https://3000-neovoid378.env.prepare.sh/)

The next step in improving your development workflow will be implementing **Continuous Integration and Continuous Deployment (CI/CD)** with GitHub Actions. 🔄 This will automate the testing and deployment process, allowing code changes to be automatically deployed to your Kubernetes environment whenever changes are pushed to your GitHub repository. 🛠️
