---
Title: AWS Notes 2025
draft: "true"
---
EC2 : Elastic Cloud Compute 
It provides scalable VM instances.

 A EC2 Instance has:
	 - CPU
	 - RAM
	 - OS root storage (i.e. EBS Volume)

EC2 Instance Types:
High-performance compute workloads that require powerful processors but moderate memory.

| Type                      | **Instances**            | **Use Case**                                                   | **Examples**                                                                |
| ------------------------- | ------------------------ | -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **General Purpose**       | `t2`, `t3`, `m5`, `m6g`. | - balance performance<br>- Balanced and minimal cpu and memory | Small Scale Web servers, databases, development environments.               |
| **Compute Optimized**     | `c5`, `c6g`.             | - high performance<br>- more processor<br>- moderate memory    | Batch processing, machine learning inference, high-performance web servers. |
| **Memory optimized**      | `r5`, `r6g`, `x1e`.      | - requiring high memory-to-CPU ratios.                         | In-memory databases (Redis, Memcached), real-time big data analytics.       |
| **Storage Optimized**     | `i3`, `d2`, `h1`.        | - high read/write throughput <br>- low latency storage.        | NoSQL databases, data warehousing, Hadoop.                                  |
| **Accelerated Computing** | `p3`, `g4`, `f1`.        | - specialized hardware<br>- GPUs or FPGAs for acceleration.    | Machine learning training, graphics rendering, scientific simulations.      |

 EC2 Instance Pricing:
 - On demand Instances
 - Reserved Instances
 - Spot Instances

EC2 Instance Lifecycle:
- pending
- running
- stopping
- stopped
- shutting-down
- terminated

EC2 Security:
- Updating guest os and applying security patches manually
- Prevention against accidental termination
- Managing ssh login key pairs
- Encryption on Root volume or extended EBS volume
- Keeping Snapshots of Extended EBS Volume

EC2 Placement Groups:
- Clustered Placement Groups
- Spread Placement Groups
- Partitioned Placement Groups

https://github.com/keenanromain/AWS-SAA-C02-Study-Guide?tab=readme-ov-file#elastic-compute-cloud-ec2

https://github.com/eMahtab/aws-solutions-architect-notes?tab=readme-ov-file

https://github.com/ayuspoudel/AWS-Notes/blob/main/004.%20AWS%20EC2.pdf

