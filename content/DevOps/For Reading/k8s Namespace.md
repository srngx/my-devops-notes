
In Kubernetes, _namespaces_ provide a mechanism for isolating groups of resources within a single cluster. Names of resources need to be unique within a namespace, but not across namespaces. Namespace-based scoping is applicable only for namespaced [objects](https://kubernetes.io/docs/concepts/overview/working-with-objects/#kubernetes-objects) _(e.g. Deployments, Services, etc.)_ and not for cluster-wide objects _(e.g. StorageClass, Nodes, PersistentVolumes, etc.)_.

## When to Use Multiple Namespaces[](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#when-to-use-multiple-namespaces)

Namespaces are intended for use in environments with many users spread across multiple teams, or projects. For clusters with a few to tens of users, you should not need to create or think about namespaces at all. Start using namespaces when you need the features they provide.

Namespaces provide a scope for names. Names of resources need to be unique within a namespace, but not across namespaces. Namespaces cannot be nested inside one another and each Kubernetes resource can only be in one namespace.

Namespaces are a way to divide cluster resources between multiple users (via [resource quota](https://kubernetes.io/docs/concepts/policy/resource-quotas/)).

It is not necessary to use multiple namespaces to separate slightly different resources, such as different versions of the same software: use [labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels) to distinguish resources within the same namespace.

#### Note:

For a production cluster, consider _not_ using the `default` namespace. Instead, make other namespaces and use those.

## Initial namespaces[](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#initial-namespaces)

Kubernetes starts with four initial namespaces:

`default`

Kubernetes includes this namespace so that you can start using your new cluster without first creating a namespace.

`kube-node-lease`

This namespace holds [Lease](https://kubernetes.io/docs/concepts/architecture/leases/) objects associated with each node. Node leases allow the kubelet to send [heartbeats](https://kubernetes.io/docs/concepts/architecture/nodes/#node-heartbeats) so that the control plane can detect node failure.

`kube-public`

This namespace is readable by _all_ clients (including those not authenticated). This namespace is mostly reserved for cluster usage, in case that some resources should be visible and readable publicly throughout the whole cluster. The public aspect of this namespace is only a convention, not a requirement.

`kube-system`

The namespace for objects created by the Kubernetes system.

## Working with Namespaces[](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#working-with-namespaces)

Creation and deletion of namespaces are described in the [Admin Guide documentation for namespaces](https://kubernetes.io/docs/tasks/administer-cluster/namespaces/).

#### Note:

Avoid creating namespaces with the prefix `kube-`, since it is reserved for Kubernetes system namespaces.

### Viewing namespaces[](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#viewing-namespaces)

You can list the current namespaces in a cluster using:

```shell
kubectl get namespace
```

```
NAME              STATUS   AGE
default           Active   1d
kube-node-lease   Active   1d
kube-public       Active   1d
kube-system       Active   1d
```

### Setting the namespace for a request[](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-for-a-request)

To set the namespace for a current request, use the `--namespace` flag.

For example:

```shell
kubectl run nginx --image=nginx --namespace=<insert-namespace-name-here>
kubectl get pods --namespace=<insert-namespace-name-here>
```

### Setting the namespace preference[](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference)

You can permanently save the namespace for all subsequent kubectl commands in that context.

```shell
kubectl config set-context --current --namespace=<insert-namespace-name-here>
# Validate it
kubectl config view --minify | grep namespace:
```

## Namespaces and DNS[](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#namespaces-and-dns)

When you create a [Service](https://kubernetes.io/docs/concepts/services-networking/service/), it creates a corresponding [DNS entry](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/). This entry is of the form `<service-name>.<namespace-name>.svc.cluster.local`, which means that if a container only uses `<service-name>`, it will resolve to the service which is local to a namespace. This is useful for using the same configuration across multiple namespaces such as Development, Staging and Production. If you want to reach across namespaces, you need to use the fully qualified domain name (FQDN).

As a result, all namespace names must be valid [RFC 1123 DNS labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names).

#### Warning:

By creating namespaces with the same name as [public top-level domains](https://data.iana.org/TLD/tlds-alpha-by-domain.txt), Services in these namespaces can have short DNS names that overlap with public DNS records. Workloads from any namespace performing a DNS lookup without a [trailing dot](https://datatracker.ietf.org/doc/html/rfc1034#page-8) will be redirected to those services, taking precedence over public DNS.

To mitigate this, limit privileges for creating namespaces to trusted users. If required, you could additionally configure third-party security controls, such as [admission webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/), to block creating any namespace with the name of [public TLDs](https://data.iana.org/TLD/tlds-alpha-by-domain.txt).

## Not all objects are in a namespace[](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#not-all-objects-are-in-a-namespace)

Most Kubernetes resources (e.g. pods, services, replication controllers, and others) are in some namespaces. However namespace resources are not themselves in a namespace. And low-level resources, such as [nodes](https://kubernetes.io/docs/concepts/architecture/nodes/) and [persistentVolumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/), are not in any namespace.

To see which Kubernetes resources are and aren't in a namespace:

```shell
# In a namespace
kubectl api-resources --namespaced=true

# Not in a namespace
kubectl api-resources --namespaced=false
```

## [Automatic labelling](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#automatic-labelling)

FEATURE STATE: `Kubernetes 1.22 [stable]`

The Kubernetes control plane sets an immutable [label](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels) `kubernetes.io/metadata.name` on all namespaces. The value of the label is the namespace name.
