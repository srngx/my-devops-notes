---
Title: Kubernetes
date: 2025-01-10
tags:
  - kubernetes
---
## What is Kubernetes ?
Kubernetes is ==an open-source system that automates the deployment, scaling, and management of containerized applications==. It's essentially a platform that orchestrates clusters of virtual machines, scheduling containers to run on them based on resource availability. Kubernetes also automates operational tasks like rolling out changes, scaling up/down, and monitoring applications. 

Here's a more detailed explanation:
> [!Tip] What is Kubernetes?
>  Kubernetes is ==an open-source system that automates the deployment, scaling, and management of containerized applications==. It's essentially a platform that orchestrates clusters of virtual machines, scheduling containers to run on them based on resource availability. Kubernetes also automates operational tasks like rolling out changes, scaling up/down, and monitoring applications. 

>[!Info] Components of Kubernetes
> **Containers:**
>    Kubernetes works with containerized applications. Containers package an application and its dependencies into a lightweight, portable environment, making it easier to deploy and manage across different systems.
>     
>    **Orchestration:**
>    Kubernetes orchestrates containers by managing their lifecycle, including deployment, scaling, and scaling back down. It also handles tasks like load balancing, automatic restarts, and fault tolerance.
>     
>    **Clusters:**
  >  Kubernetes clusters consist of a group of computing nodes (or worker machines) that run containerized applications. 
>    
> **Control Plane:**
   > A control plane manages the cluster, including tasks like scheduling containers, maintaining resource allocation, and monitoring the health of the cluster.
   >  
> **Pods:**
>    Containers within a Kubernetes cluster are grouped into pods, which are the basic unit of deployment.
>     
> **Automated Tasks:**
>  Kubernetes automates many of the manual tasks involved in managing containerized applications, making it easier to deploy, scale, and manage applications at scale. 
>
> **Benefits:**
> Using Kubernetes can lead to more resilient, scalable, and easily manageable applications, especially in complex, distributed environments.

## Kubernetes Cluster Architecture
![[cluster-diagram.svg]]

> [!Tip] Component of a Cluster
> 
>  1. **Control Plane:**
>     - API Server: Central management point
>     - etcd: Cluster state database
>     - Controller Manager: Maintains desired state
>     - Scheduler: Places pods on nodes
> 2. **Worker Nodes**:
>     - Kubelet: Node agent
>     - Container Runtime: Runs containers
>     - Kube Proxy: Networking rules
>     - Pods: Groups of containers
> 3. **External Access**:
>     - kubectl CLI: Command-line interface
>     - Load Balancer: External traffic distribution
>     - Ingress: HTTP/HTTPS routing
> 4. **Storage**:
>     - Persistent Volumes: Durable storage
> 5. **Networking**:
>     - CNI: Pod networking
>     - Network Policies: Traffic rules
> 
> The arrows show the communication flow between components. For example:
> 
> - All components communicate through the API Server
> - Kubelets on worker nodes report to API Server
> - Pods can access Persistent Volumes
> - Network policies control pod communication
> 

