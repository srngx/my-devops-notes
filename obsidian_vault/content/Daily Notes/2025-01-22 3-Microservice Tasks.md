---
date: 2025-01-22
tags:
  - AWS
  - dailynotes
---
#### Tasks:
3 microservices in 3 different namespace

nginx: dev-nginx
httpd: dev-httpd
tomcat: dev-tomcat

Microservice 1
1. Create Docker Image nginx free css template
2. Build it and deploy to k8s

Microservice 2
1. Httpd container 
2. Make deployment
3. Send index.html via configMap

Microservice 3
1. Deploy tomcat container
2. Make deployment

Nginx ingress controller deploy on nginx-ingress namespace
and 3 end points for 3 microservices

<subdomain.learndevops.live>

**Reading Task**
1. Node affinity
2. Anti Affinity
3. Node Selectors
4. Pod Affinity
5. Taint and Tolerance

**Previous task twist**
- 3 node
- one pod on each node
- node 1 --> httpd
- node 2 --> tomcat
- node 3 ---> nginx


https://envs.sh/gA-.yaml