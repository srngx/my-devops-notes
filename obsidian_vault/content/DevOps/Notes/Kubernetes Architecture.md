Kubernetes Cluster Architecture
![[cluster-diagram.svg]]


1. Control Plane:
    - API Server: Central management point
    - etcd: Cluster state database
    - Controller Manager: Maintains desired state
    - Scheduler: Places pods on nodes
2. Worker Nodes:
    - Kubelet: Node agent
    - Container Runtime: Runs containers
    - Kube Proxy: Networking rules
    - Pods: Groups of containers
3. External Access:
    - kubectl CLI: Command-line interface
    - Load Balancer: External traffic distribution
    - Ingress: HTTP/HTTPS routing
4. Storage:
    - Persistent Volumes: Durable storage
5. Networking:
    - CNI: Pod networking
    - Network Policies: Traffic rules

The arrows show the communication flow between components. For example:

- All components communicate through the API Server
- Kubelets on worker nodes report to API Server
- Pods can access Persistent Volumes
- Network policies control pod communication

