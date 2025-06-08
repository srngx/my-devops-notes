---
title: GitOps-driven Kubernetes Native Deployment 
date: 2025-05-12
tags:
  - argocd
  - docker
  - projects
---

## GitOps-driven Kubernetes Native Deployment

This Project Include:
- Containerizing the Static website
- Minikube Clusters
- ArgoCD for Contineuous Deployment
- Helm Charts for Parameterizing K8S Manifests
- Github Actions for Contineuos Integration
- DockerHub for Storing Images

Video Demonstration: https://youtu.be/1PRMywtWoJA?feature=shared

## Instructions to deploy 

#### Install Prerequistics
- minikube
- kubectl
- git
- helm

#### git clone repository
- `git clone https://github.com/srngx/devopsifying-app`

#### Create Docker Image
- `docker build -t <your-dockerhub-usename>/mywebsite .`

#### Start Minikube Cluster
- `minikube start`
### Manually Running with Kubernetes

#### Apply Manifests
Goto the `K8S/manifests/` directory
 and run:
    - deployment `kubctl apply -f deployment.yaml`
    - service `kubctl apply -f service.yaml`

Check status if all service working properly
    - `kubectl get all`

And try to access the service using minikube IP and nodeport
 Check Minikube IP
    - `minikube ip`

### Deploying with helm charts
Optional: 
    - You can create helm chart and manually edit template but I already did that part
    So here is what I did
       - `helm create mywebsite-chart`
       - deleted `Charts` and everything inside `templates` folder 
       - and copied both manifests files into `templates`
       - Deleted all comments from `Chart.yaml`
       - Edited `values.yaml` file and deleted everything except:
       ```yaml
            replicaCount: 1
            image:
              tag: "v1"
       ```
       - And Edited deployment.yaml file to parameterized the Image Tab with `{{ .Values.image.tag }}`
       - 

#### Deploy with helm charts
   - `cd helm`
   - `helm install mywebsite ./mywebsite-chart`

## STEP 2: Github Action
 ### Creating Repository
   - Create Repository in Github
   - Add these files in it
   - and create `.github/workflows/ci.yaml`  or copy the same file from here

 ### Generate Dockerhub token 
   - login to https://hub.docker.com
   - Goto to your Account Setting >> Personal Access Token
   - Give any name and Generate
   - Copy it somewhere to use in next step

 ### Create Repository Secrets in Github
   - Goto your Repository Settings
   - Under **Secretes and Variables** goto **actions** and create **New Repository Secrets**
   - For Username
      - Name: *DOCKERHUB_USERNAME*
      - Secret: <your-dockerhub-username> 
    - For Password:
      - Name: *DOCKERHUB_TOKEN*
      - Secret: <your-dockerhub-token>

 ### Push everything to github and see if action is running perfectly
 - Given that you have perfectly setuped Dockerhub Repository and all
 - After Github Actions Completed Successfully You should see new tag in Dockerhub.
 - and under helm chart values tag part also must have changed

## ArgoCD

 - To Autodeploy the new version of site we use Argo CD
### Install ArgoCD cluster
 ```

 kubectl create namespace argocd`
 kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Check argo running status
`kubectl get all -n argocd`
`kubectl get service -n argocd`

Our `arogocd server` service showing ClusterIP right now but we need to make it NodePort to access it
`Kubectl edit service argocd-server -n argocd`
Goto Very bottom of page and Change `type: ClusterIP` to `type: NodePort` and save and exit

Now we should see Nodeport 

### Accessing the ArgoCD-server 
check `minikube ip`
and open in browser with appending NodePort port after it like this
https://192.168.49.2:31542

#### Getting Login Details
 - Username is 'admin'
 - and password can be found in secrets
 
 To get password 
     - `kubectl get secret -n argocd`
     - locate `argocd-initial-admin-secret`
     - `kubectl edit secret argocd-initial-admin-secret -n argocd`
     - Copy the password which is encrypted in base64
     - `echo UVA1akh0eTlTU295dnozcA== | base64 --decode`
     - copy the password except % sign at the end
     - and use to login

### Create app inside Argocd
 
 - Application Name: mywebsite
 - Project Name: default
 - Sync Policy: Automatic
 - Check on: Self Heal
 - Repository URL: <url githubrepo url>
 - PATH: helm/mywebsite-chart
 - CLUSTER URL: https://kubernetes.default.svc
 - NAMESPACE: default
 - HELM VALUES: values.yaml
 - Click on Create

 It will take a second to show everything in sync and healthy.

 Now try editing your website code and push it to github and 
 See it will resync after a minute and new tag will be appear on values.yaml file and same tag no. image must be uploaded to dockerhub.
