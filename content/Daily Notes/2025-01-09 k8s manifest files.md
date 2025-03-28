---
date: 2025-01-09
tags:
  - kubernetes
  - dailynotes
---
### ReplicaSets
The ReplicaSet configuration defines a number of identical pods required, and if a pod is evicted or fails, creates more pods to compensate for the loss.
ReplicaSets are usually not used directly—they are typically created as part of a deployment.

Here is a simple example using matchLabels as the selector.
*rs.yaml*
```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend
  labels:
    app: guestbook
    tier: frontend
spec:
  # modify replicas according to your case
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      labels:
        tier: frontendn
    spec:
      containers:
      - name: nginx
        image: nginx
```
Apply Manifest `kubectl apply -f rs.yaml`

Note: use either one file naming `yml` or `yaml`

### Deployment

Deployments are one level up from ReplicaSets. They allow you to use a declarative method to deploy ReplicaSets and pods. You use YAML configuration to define what your group of pods should look like, and the deployment manipulates Kubernetes objects to create pods exactly according to the YAML specification.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  labels:
    app: guestbook
    tier: frontend
spec:
  # modify replicas according to your case
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      labels:
        tier: frontendn
    spec:
      containers:
      - name: nginx
        image: nginx
```

==deployment ----> ReplicaSet -------> Pods==

![[Manifest_structure.svg]]
### Services
In a Kubernetes cluster, each Pod has an internal IP address. But the Pods in a Deployment come and go, and their IP addresses change. So it doesn't make sense to use Pod IP addresses directly. With a Service, you get a stable IP address that lasts for the life of the Service, even as the IP addresses of the member Pods change.

A key aim of Services in Kubernetes is that you don't need to modify your existing application to use an unfamiliar service discovery mechanism. You can run code in Pods, whether this is a code designed for a cloud-native world, or an older app you've containerized. You use a Service to make that set of Pods available on the network so that clients can interact with it.

#### Types of Kubernetes Services

| Types            | Short Codes | Description                                                                                                                                                                            |
| ---------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **LoadBalancer** | lb          | Clients send requests to the IP address of a network load balancer.                                                                                                                    |
| **NodePort**     | np          | Clients send requests to the IP address of a node on one or more `nodePort` values that are specified by the Service.                                                                  |
| **ClusterIp**    | cip         | Internal clients send requests to a stable internal IP address.                                                                                                                        |
| **ExternalName** | xn          | Internal clients use the DNS name of a Service as an alias for an external DNS name.                                                                                                   |
| **Headless**     | -           | You can use a [headless service](https://kubernetes.io/docs/concepts/services-networking/service/#headless-services) when you want a Pod grouping, but don't need a stable IP address. |

>[!Tip] Hot Tip
> Its not possible to remember all **shortcodes** for k8's Resources
> Thats why we have this command to Lists all the resources in cluster
> 
> ```bash
> kubectl api-resources
> ```

### Two ways to use Kubernetes

| Imperative Way | Declarative Way |
| -------------- | --------------- |
| commands       | Manifest        |



