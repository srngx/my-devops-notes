---
date: 2025-02-02
tags:
  - jenkins
  - docker
  - sidequests
Title: Docker Based Jenkins Agents Setup
---
🔥 **Adding Docker-Based Jenkins Agents**

To add Jenkins agents running as Docker containers, you need to:
1️⃣ Install Docker in the Jenkins controller container.
2️⃣ Install and configure the "Docker Plugin" in Jenkins.
3️⃣ Configure Jenkins to launch Docker-based agents dynamically.
🚀 Step 1: Run Jenkins with Docker Access

First, ensure your Jenkins container can communicate with the Docker daemon. Run Jenkins with the Docker socket mounted:

```sh
docker run -d \
  -p 8080:8080 \
  -p 50000:50000 \
  --name jenkins \
  --user root \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

Now, install Docker inside the Jenkins container:
```sh
docker exec -it jenkins bash
apt-get update && apt-get install -y docker.io
exit
```

🔧 Step 2: Install the Docker Plugin in Jenkins

 Open Jenkins at http://your-server-ip:8080/
- Go to Manage Jenkins → Manage Plugins
- In the "Available" tab, search for "Docker Plugin" and install it.
- Restart Jenkins after installation.

⚙️ Step 3: Configure Docker Cloud in Jenkins

    Go to Manage Jenkins → Manage Nodes and Clouds → Configure Clouds
    Click Add a new cloud → Select Docker
    In "Docker Host URI", enter:

    unix:///var/run/docker.sock

    Click Test Connection → It should be successful.

🏗 Step 4: Create a Docker Agent Template

    Under "Docker Agent templates," click Add Docker Template
    Set:
        Label: docker-agent
        Docker Image: Use jenkins/inbound-agent (official Jenkins agent)
        Remote File System Root: /home/jenkins
        Usage: "Use this node as much as possible"
        Launch Method: Select "Attach Docker container"
    Click Save.

✅ Step 5: Run a Test Pipeline Using Docker Agents

Now create a simple Jenkins Pipeline:

Go to Jenkins Dashboard → New Item → Pipeline
Use the following script:
```
pipeline {
    agent { label 'docker-agent' }
    stages {
        stage('Run on Docker Agent') {
            steps {
                sh 'echo "Running on a Docker Agent!"'
                sh 'docker --version'
            }
        }
    }
}
```

Click Build Now → Jenkins will automatically start a Docker agent and run the job inside it.

🎯 Final Notes

   - **Dynamic Agents**: Jenkins will only spin up agents when needed and remove them after execution.
   - **If agents don’t start**: Check Manage Nodes and Clouds → Check agent logs.
  - **Using Custom Images:** You can specify a different agent image, e.g., python:3.10, maven:latest, etc.

---

Let me know if you need more details! 🚀

It looks like Jenkins inside your container does not have the Docker CLI installed. Mounting the Docker socket (/var/run/docker.sock) allows the container to communicate with the Docker daemon running on your host, but the Jenkins container itself still needs the docker CLI to execute commands.
Solution: Use a Docker-in-Docker (DinD) Approach

Instead of using the basic jenkins/jenkins image, use jenkins/jenkins:lts with Docker installed or use a dedicated image like jenkins/jenkins:lts-jdk17 that comes with Docker.

**Steps to Fix**

1️⃣ Run Jenkins with Docker Installed

Instead of `jenkins/jenkins:latest`, use `jenkins/jenkins:lts` and manually install Docker inside it.
```sh
docker run -d \
  -p 8080:8080 \
  -p 50000:50000 \
  --name jenkins \
  --user root \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

2️⃣  Install Docker in the Jenkins Container

Once the container is running, enter it:

```sh
docker exec -it jenkins bash
```

Then, install Docker inside the Jenkins container:

```sh
apt-get update && apt-get install -y docker.io
```

3️⃣ Verify Docker Inside Jenkins

Run inside the container:

```sh
docker --version
docker ps
```

If these commands work, your Jenkins pipelines should now be able to execute docker commands successfully.
Alternative: Use the jenkinsci/blueocean Image

The jenkinsci/blueocean image comes pre-installed with Docker CLI:
```sh
docker run -d \
  -p 8080:8080 \
  -p 50000:50000 \
  --name jenkins \
  --user root \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkinsci/blueocean

```
This might be an easier way if you don’t want to manually install Docker inside Jenkins.

Let me know if you need more help! 🚀
You said:
why   `-p 50000:50000 \`
ChatGPT said:
ChatGPT

The -p 50000:50000 option in your Docker run command is used to expose the Jenkins agent (slave) communication port.
🔹 Why is Port 50000 Used?

Jenkins uses port 50000 for JNLP-based (Java Network Launch Protocol) agent communication. This is needed when Jenkins connects to remote build agents (worker nodes) that run jobs.

- If you plan to run Jenkins agents on different machines and connect them to your Jenkins controller, you should expose port 50000.
- If you are running everything on a single container without agents, you don't need -p 50000:50000.

✅ When to Use -p 50000:50000

✔️ If you want to add remote Jenkins agents.
✔️ If you use JNLP (Java Web Start) agents to connect workers to Jenkins.
❌ When You Can Skip It

❌ If you are running all jobs inside the Jenkins container itself.
❌ If you are using Docker-based agents instead of traditional JNLP agents.
🛠 Example Without Agents (If You Don’t Need Port 50000)
```sh
docker run -d \
  -p 8080:8080 \
  --name jenkins \
  --user root \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```
