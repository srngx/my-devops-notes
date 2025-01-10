max surge / max unavailable
rolling updates

aws s3 ls --profile dev

aws configure --profile

Service
- ClusterIP 
	- default service

Service.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app.kubernetes.io/name: proxy
spec:
  containers:
  - name: nginx
    image: nginx:stable
    ports:
      - containerPort: 80
        name: http-web-svc

---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app.kubernetes.io/name: proxy
  ports:
  - name: name-of-service-port
    protocol: TCP
    port: 80
    targetPort: http-web-svc
```

spec:
	type: LoadBalancer

**annotations** to change service type
can service lb me classic use kr skte ho kya?

spec:
	type: NodePort

`kubectl get -o wide`

get more information

✅ Tasks To read
- minimum 5 points in services types
- secrets and ConfigMap
