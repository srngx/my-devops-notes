##### Task 
- 1 Microservice = Tomcat 
- ReplicaSet 1
- Add Node selector
- add pod affinity
- add node affinity
- Implement probe to check to see if service is running
- Add Database tomcat in Cluster with persistent volume
- Use ingress LB
- tomcat app resource alloaction:
   - Request
   -    CPU: 500m
   -    Mem: 1GB
   - Limit
   -    cpu: 1
   -    memory: 2gb
- hard coded values can be sent so no secret will be used
or
Use online bookshop application where secrets and configMap can be used

