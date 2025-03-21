On-disk files in a container are ephemeral, which presents some problems for non-trivial applications when running in containers. First, when a container crashes kubelet will restart it, but the files will be lost - the container starts with a clean state. Second, when running containers together in a `Pod` it is often necessary to share files between those containers. The Kubernetes `Volume` abstraction solves both of these problems.
## Background

Docker also has a concept of [volumes](https://docs.docker.com/userguide/dockervolumes/), though it is somewhat looser and less managed. In Docker, a volume is simply a directory on disk or in another container. Lifetimes are not managed and until very recently there were only local-disk-backed volumes. Docker now provides volume drivers, but the functionality is very limited for now (e.g. as of Docker 1.7 only one volume driver is allowed per container and there is no way to pass parameters to volumes).

A Kubernetes volume, on the other hand, has an explicit lifetime - the same as the pod that encloses it. Consequently, a volume outlives any containers that run within the Pod, and data is preserved across Container restarts. Of course, when a Pod ceases to exist, the volume will cease to exist, too. Perhaps more importantly than this, Kubernetes supports many type of volumes, and a Pod can use any number of them simultaneously.

At its core, a volume is just a directory, possibly with some data in it, which is accessible to the containers in a pod. How that directory comes to be, the medium that backs it, and the contents of it are determined by the particular volume type used.

To use a volume, a pod specifies what volumes to provide for the pod (the `spec.volumes` field) and where to mount those into containers(the `spec.containers.volumeMounts` field).

A process in a container sees a filesystem view composed from their Docker image and volumes. The [Docker image](https://docs.docker.com/userguide/dockerimages/) is at the root of the filesystem hierarchy, and any volumes are mounted at the specified paths within the image. Volumes can not mount onto other volumes or have hard links to other volumes. Each container in the Pod must independently specify where to mount each volume.

## Types of Volumes

Kubernetes supports several types of Volumes:

- `emptyDir`
- `hostPath`
- `gcePersistentDisk`
- `awsElasticBlockStore`
- `nfs`
- `iscsi`
- `flocker`
- `glusterfs`
- `rbd`
- `cephfs`
- `gitRepo`
- `secret`
- `persistentVolumeClaim`
- `downwardAPI`
- `azureFileVolume`
- `azureDisk`
- `vsphereVolume`
- `Quobyte`
- `PortworxVolume`
- `ScaleIO`

We welcome additional contributions.

### emptyDir

An `emptyDir` volume is first created when a Pod is assigned to a Node, and exists as long as that Pod is running on that node. As the name says, it is initially empty. Containers in the pod can all read and write the same files in the `emptyDir` volume, though that volume can be mounted at the same or different paths in each container. When a Pod is removed from a node for any reason, the data in the `emptyDir` is deleted forever. NOTE: a container crashing does _NOT_ remove a pod from a node, so the data in an `emptyDir` volume is safe across container crashes.

Some uses for an `emptyDir` are:

- scratch space, such as for a disk-based merge sort
- checkpointing a long computation for recovery from crashes
- holding files that a content-manager container fetches while a webserver container serves the data

By default, `emptyDir` volumes are stored on whatever medium is backing the machine - that might be disk or SSD or network storage, depending on your environment. However, you can set the `emptyDir.medium` field to `"Memory"` to tell Kubernetes to mount a tmpfs (RAM-backed filesystem) for you instead. While tmpfs is very fast, be aware that unlike disks, tmpfs is cleared on machine reboot and any files you write will count against your container's memory limit.

#### Example pod

```
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: gcr.io/google_containers/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir: {}
```

### hostPath

A `hostPath` volume mounts a file or directory from the host node's filesystem into your pod. This is not something that most Pods will need, but it offers a powerful escape hatch for some applications.

For example, some uses for a `hostPath` are:

- running a container that needs access to Docker internals; use a `hostPath` of `/var/lib/docker`
- running cAdvisor in a container; use a `hostPath` of `/dev/cgroups`

Watch out when using this type of volume, because:

- pods with identical configuration (such as created from a podTemplate) may behave differently on different nodes due to different files on the nodes
- when Kubernetes adds resource-aware scheduling, as is planned, it will not be able to account for resources used by a `hostPath`
- the directories created on the underlying hosts are only writable by root. You either need to run your process as root in a [privileged container](https://unofficial-kubernetes.readthedocs.io/en/latest/docs/user-guide/security-context) or modify the file permissions on the host to be able to write to a `hostPath` volume

#### Example pod

```
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: gcr.io/google_containers/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    hostPath:
      # directory location on host
      path: /data
```

### gcePersistentDisk

A `gcePersistentDisk` volume mounts a Google Compute Engine (GCE) [Persistent Disk](http://cloud.google.com/compute/docs/disks) into your pod. Unlike `emptyDir`, which is erased when a Pod is removed, the contents of a PD are preserved and the volume is merely unmounted. This means that a PD can be pre-populated with data, and that data can be "handed off" between pods.

**Important: You must create a PD using `gcloud` or the GCE API or UI before you can use it**

There are some restrictions when using a `gcePersistentDisk`:

- the nodes on which pods are running must be GCE VMs
- those VMs need to be in the same GCE project and zone as the PD

A feature of PD is that they can be mounted as read-only by multiple consumers simultaneously. This means that you can pre-populate a PD with your dataset and then serve it in parallel from as many pods as you need. Unfortunately, PDs can only be mounted by a single consumer in read-write mode - no simultaneous writers allowed.

Using a PD on a pod controlled by a ReplicationController will fail unless the PD is read-only or the replica count is 0 or 1.

#### Creating a PD

Before you can use a GCE PD with a pod, you need to create it.

```
gcloud compute disks create --size=500GB --zone=us-central1-a my-data-disk
```

#### Example pod

```
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: gcr.io/google_containers/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    # This GCE PD must already exist.
    gcePersistentDisk:
      pdName: my-data-disk
      fsType: ext4
```

### awsElasticBlockStore

An `awsElasticBlockStore` volume mounts an Amazon Web Services (AWS) [EBS Volume](http://aws.amazon.com/ebs/) into your pod. Unlike `emptyDir`, which is erased when a Pod is removed, the contents of an EBS volume are preserved and the volume is merely unmounted. This means that an EBS volume can be pre-populated with data, and that data can be "handed off" between pods.

**Important: You must create an EBS volume using `aws ec2 create-volume` or the AWS API before you can use it**

There are some restrictions when using an awsElasticBlockStore volume:

- the nodes on which pods are running must be AWS EC2 instances
- those instances need to be in the same region and availability-zone as the EBS volume
- EBS only supports a single EC2 instance mounting a volume

#### Creating an EBS volume

Before you can use an EBS volume with a pod, you need to create it.

```
aws ec2 create-volume --availability-zone eu-west-1a --size 10 --volume-type gp2
```

Make sure the zone matches the zone you brought up your cluster in. (And also check that the size and EBS volume type are suitable for your use!)

#### AWS EBS Example configuration

```
apiVersion: v1
kind: Pod
metadata:
  name: test-ebs
spec:
  containers:
  - image: gcr.io/google_containers/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-ebs
      name: test-volume
  volumes:
  - name: test-volume
    # This AWS EBS volume must already exist.
    awsElasticBlockStore:
      volumeID: <volume-id>
      fsType: ext4
```

### nfs

An `nfs` volume allows an existing NFS (Network File System) share to be mounted into your pod. Unlike `emptyDir`, which is erased when a Pod is removed, the contents of an `nfs` volume are preserved and the volume is merely unmounted. This means that an NFS volume can be pre-populated with data, and that data can be "handed off" between pods. NFS can be mounted by multiple writers simultaneously.

**Important: You must have your own NFS server running with the share exported before you can use it**

See the [NFS example](https://github.com/kubernetes/kubernetes/tree/%7B%7Bpage.githubbranch%7D%7D/examples/volumes/nfs) for more details.

### iscsi

An `iscsi` volume allows an existing iSCSI (SCSI over IP) volume to be mounted into your pod. Unlike `emptyDir`, which is erased when a Pod is removed, the contents of an `iscsi` volume are preserved and the volume is merely unmounted. This means that an iscsi volume can be pre-populated with data, and that data can be "handed off" between pods.

**Important: You must have your own iSCSI server running with the volume created before you can use it**

A feature of iSCSI is that it can be mounted as read-only by multiple consumers simultaneously. This means that you can pre-populate a volume with your dataset and then serve it in parallel from as many pods as you need. Unfortunately, iSCSI volumes can only be mounted by a single consumer in read-write mode - no simultaneous writers allowed.

See the [iSCSI example](https://github.com/kubernetes/kubernetes/tree/%7B%7Bpage.githubbranch%7D%7D/examples/volumes/iscsi) for more details.

### flocker

[Flocker](https://clusterhq.com/flocker) is an open-source clustered container data volume manager. It provides management and orchestration of data volumes backed by a variety of storage backends.

A `flocker` volume allows a Flocker dataset to be mounted into a pod. If the dataset does not already exist in Flocker, it needs to be first created with the Flocker CLI or by using the Flocker API. If the dataset already exists it will be reattached by Flocker to the node that the pod is scheduled. This means data can be "handed off" between pods as required.

**Important: You must have your own Flocker installation running before you can use it**

See the [Flocker example](https://github.com/kubernetes/kubernetes/tree/%7B%7Bpage.githubbranch%7D%7D/examples/volumes/flocker) for more details.

### glusterfs

A `glusterfs` volume allows a [Glusterfs](http://www.gluster.org/) (an open source networked filesystem) volume to be mounted into your pod. Unlike `emptyDir`, which is erased when a Pod is removed, the contents of a `glusterfs` volume are preserved and the volume is merely unmounted. This means that a glusterfs volume can be pre-populated with data, and that data can be "handed off" between pods. GlusterFS can be mounted by multiple writers simultaneously.

**Important: You must have your own GlusterFS installation running before you can use it**

See the [GlusterFS example](https://github.com/kubernetes/kubernetes/tree/%7B%7Bpage.githubbranch%7D%7D/examples/volumes/glusterfs) for more details.

### rbd

An `rbd` volume allows a [Rados Block Device](http://ceph.com/docs/master/rbd/rbd/) volume to be mounted into your pod. Unlike `emptyDir`, which is erased when a Pod is removed, the contents of a `rbd` volume are preserved and the volume is merely unmounted. This means that a RBD volume can be pre-populated with data, and that data can be "handed off" between pods.

**Important: You must have your own Ceph installation running before you can use RBD**

A feature of RBD is that it can be mounted as read-only by multiple consumers simultaneously. This means that you can pre-populate a volume with your dataset and then serve it in parallel from as many pods as you need. Unfortunately, RBD volumes can only be mounted by a single consumer in read-write mode - no simultaneous writers allowed.

See the [RBD example](https://github.com/kubernetes/kubernetes/tree/%7B%7Bpage.githubbranch%7D%7D/examples/volumes/rbd) for more details.

### cephfs

A `cephfs` volume allows an existing CephFS volume to be mounted into your pod. Unlike `emptyDir`, which is erased when a Pod is removed, the contents of a `cephfs` volume are preserved and the volume is merely unmounted. This means that a CephFS volume can be pre-populated with data, and that data can be "handed off" between pods. CephFS can be mounted by multiple writers simultaneously.

**Important: You must have your own Ceph server running with the share exported before you can use it**

See the [CephFS example](https://github.com/kubernetes/kubernetes/tree/%7B%7Bpage.githubbranch%7D%7D/examples/volumes/cephfs/) for more details.

### gitRepo

A `gitRepo` volume is an example of what can be done as a volume plugin. It mounts an empty directory and clones a git repository into it for your pod to use. In the future, such volumes may be moved to an even more decoupled model, rather than extending the Kubernetes API for every such use case.

Here is an example for gitRepo volume:

```
apiVersion: v1
kind: Pod
metadata:
  name: server
spec:
  containers:
  - image: nginx
    name: nginx
    volumeMounts:
    - mountPath: /mypath
      name: git-volume
  volumes:
  - name: git-volume
    gitRepo:
      repository: "git@somewhere:me/my-git-repository.git"
      revision: "22f1d8406d464b0c0874075539c1f2e96c253775"
```

### secret

A `secret` volume is used to pass sensitive information, such as passwords, to pods. You can store secrets in the Kubernetes API and mount them as files for use by pods without coupling to Kubernetes directly. `secret` volumes are backed by tmpfs (a RAM-backed filesystem) so they are never written to non-volatile storage.

**Important: You must create a secret in the Kubernetes API before you can use it**

Secrets are described in more detail [here](https://unofficial-kubernetes.readthedocs.io/en/latest/docs/user-guide/secrets).

### persistentVolumeClaim

A `persistentVolumeClaim` volume is used to mount a [PersistentVolume](https://unofficial-kubernetes.readthedocs.io/en/latest/docs/user-guide/persistent-volumes) into a pod. PersistentVolumes are a way for users to "claim" durable storage (such as a GCE PersistentDisk or an iSCSI volume) without knowing the details of the particular cloud environment.

See the [PersistentVolumes example](https://unofficial-kubernetes.readthedocs.io/en/latest/docs/user-guide/persistent-volumes/) for more details.

### downwardAPI

A `downwardAPI` volume is used to make downward API data available to applications. It mounts a directory and writes the requested data in plain text files.

See the [`downwardAPI` volume example](https://unofficial-kubernetes.readthedocs.io/en/latest/docs/user-guide/downward-api/volume/) for more details.

### FlexVolume

A `FlexVolume` enables users to mount vendor volumes into a pod. It expects vendor drivers are installed in the volume plugin path on each kubelet node. This is an alpha feature and may change in future.

More details are in [here](https://github.com/kubernetes/kubernetes/tree/%7B%7Bpage.githubbranch%7D%7D/examples/volumes/flexvolume/README.md)

### AzureFileVolume

A `AzureFileVolume` is used to mount a Microsoft Azure File Volume (SMB 2.1 and 3.0) into a Pod.

More details can be found [here](https://github.com/kubernetes/kubernetes/tree/%7B%7Bpage.githubbranch%7D%7D/examples/volumes/azure_file/README.md)

### AzureDiskVolume

A `AzureDiskVolume` is used to mount a Microsoft Azure [Data Disk](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-about-disks-vhds/) into a Pod.

More details can be found [here](https://github.com/kubernetes/kubernetes/tree/%7B%7Bpage.githubbranch%7D%7D/examples/volumes/azure_disk/README.md)

### vsphereVolume

**Prerequisite: Kubernetes with vSphere Cloud Provider configured. For cloudprovider configuration please refer [vSphere getting started guide](http://kubernetes.io/docs/getting-started-guides/vsphere/).**

A `vsphereVolume` is used to mount a vSphere VMDK Volume into your Pod. The contents of a volume are preserved when it is unmounted. It supports both VMFS and VSAN datastore.

**Important: You must create VMDK using one of the following method before using with POD.**

#### Creating a VMDK volume

- Create using vmkfstools.

First ssh into ESX and then use following command to create vmdk,

```
    vmkfstools -c 2G /vmfs/volumes/DatastoreName/volumes/myDisk.vmdk
```

- Create using vmware-vdiskmanager.

```
  vmware-vdiskmanager -c -t 0 -s 40GB -a lsilogic myDisk.vmdk
```

#### vSphere VMDK Example configuration

```
apiVersion: v1
kind: Pod
metadata:
  name: test-vmdk
spec:
  containers:
  - image: gcr.io/google_containers/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-vmdk
      name: test-volume
  volumes:
  - name: test-volume
    # This VMDK volume must already exist.
    vsphereVolume:
      volumePath: "[DatastoreName] volumes/myDisk"
      fsType: ext4
```

More examples can be found [here](https://github.com/kubernetes/kubernetes/tree/master/examples/volumes/vsphere).

### Quobyte

A `Quobyte` volume allows an existing [Quobyte](http://www.quobyte.com/) volume to be mounted into your pod.

**Important: You must have your own Quobyte setup running with the volumes created before you can use it**

See the [Quobyte example](https://github.com/kubernetes/kubernetes/tree/%7B%7Bpage.githubbranch%7D%7D/examples/volumes/quobyte) for more details.

### PortworxVolume

A `PortworxVolume` is an elastic block storage layer that runs hyperconverged with Kubernetes. Portworx fingerprints storage in a server, tiers based on capabilities, and aggregates capacity across multiple servers. Portworx runs in-guest in virtual machines or on bare metal Linux nodes.

A `PortworxVolume` can be dynamically created through Kubernetes or it can also be pre-provisioned and referenced inside a Kubernetes pod. Here is an example pod referencing a pre-provisioned PortworxVolume:

```
apiVersion: v1
kind: Pod
metadata:
  name: test-portworx-volume-pod
spec:
  containers:
  - image: gcr.io/google_containers/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /mnt
      name: pxvol
  volumes:
  - name: pxvol
    # This Portworx volume must already exist.
    portworxVolume:
      volumeID: "pxvol"
      fsType: "<fs-type>"
```

**Important: Make sure you have an existing PortworxVolume with name `pxvol` before using it in the pod**

More details and examples can be found [here](https://github.com/kubernetes/kubernetes/tree/%7B%7Bpage.githubbranch%7D%7D/examples/volumes/portworx/README.md)

### ScaleIO

ScaleIO is a software-based storage platform that can use existing hardware to create clusters of scalable shared block networked storage. The ScaleIO volume plugin allows deployed pods to access existing ScaleIO volumes (or it can dynamically provision new volumes for persistent volume claims, see [ScaleIO Persistent Volumes](https://unofficial-kubernetes.readthedocs.io/en/latest/docs/user-guide/persistent-volumes/#scaleio)).

**Important: You must have an existing ScaleIO cluster already setup and running with the volumes created before you can use them**

The following is an example pod configuration with ScaleIO:

```
apiVersion: v1
kind: Pod
metadata:
  name: pod-0
spec:
  containers:
  - image: gcr.io/google_containers/test-webserver
    name: pod-0
    volumeMounts:
    - mountPath: /test-pd
      name: vol-0
  volumes:
  - name: vol-0
    scaleIO:
      gateway: https://localhost:443/api
      system: scaleio
      volumeName: vol-0
      secretRef:
        name: sio-secret
      fsType: xfs
```

For further detail, plese the see the [ScaleIO examples](https://github.com/kubernetes/kubernetes/tree/%7B%7Bpage.githubbranch%7D%7D/examples/volumes/scaleio).

## Using subPath

Sometimes, it is useful to share one volume for multiple uses in a single pod. The `volumeMounts.subPath` property can be used to specify a sub-path inside the referenced volume instead of its root.

Here is an example of a pod with a LAMP stack (Linux Apache Mysql PHP) using a single, shared volume. The HTML contents are mapped to its `html` folder, and the databases will be stored in its `mysql` folder:

```
apiVersion: v1
kind: Pod
metadata:
  name: my-lamp-site
spec:
    containers:
    - name: mysql
      image: mysql
      volumeMounts:
      - mountPath: /var/lib/mysql
        name: site-data
        subPath: mysql
    - name: php
      image: php
      volumeMounts:
      - mountPath: /var/www/html
        name: site-data
        subPath: html
    volumes:
    - name: site-data
      persistentVolumeClaim:
        claimName: my-lamp-site-data
```

## Resources

The storage media (Disk, SSD, etc.) of an `emptyDir` volume is determined by the medium of the filesystem holding the kubelet root dir (typically `/var/lib/kubelet`). There is no limit on how much space an `emptyDir` or `hostPath` volume can consume, and no isolation between containers or between pods.

In the future, we expect that `emptyDir` and `hostPath` volumes will be able to request a certain amount of space using a [resource](https://unofficial-kubernetes.readthedocs.io/en/latest/docs/user-guide/compute-resources) specification, and to select the type of media to use, for clusters that have several media types.

