# Dockerfile Explained

#### What is a dockerfile?
- Step by step instructions to build Image
- Blueprint of a container
- Written in go
- Has Instructions

Some Basic Instructions are:

| Instructions | Use Case                                                                             |
| ------------ | ------------------------------------------------------------------------------------ |
| FROM         | Specifies the base image to start with. example: nginx or ubuntu                     |
| COPY         | Copies files or directories from your computer into the image.                       |
| RUN          | Executes commands within the image during the build process                          |
| ADD          | Similar to `COPY`, but can also extract compressed files and **download from URLs**. |
| EXPOSE       | Informs Docker that the container listens on a specific network port at runtime.     |
| CMD          | Specifies the command to run when the container starts.                              |

There are two ways to run command in container.
1. Using `CMD` instruction
2. Using **Entrypoint**

 **`CMD`**
- **Purpose:** Defines the default command to execute when the container starts.
- **Flexibility:** Easily overridden by using the `docker run` command with a different command.
- **Example:** `CMD ["python", "app.py"]`

**`ENTRYPOINT`**
- **Purpose:** Configures the container to run as an executable. It sets the main command that _always_ executes.
- **Less Flexible:** While arguments can be appended, the core command defined by `ENTRYPOINT` remains.
- **Example:** `ENTRYPOINT ["/usr/bin/nginx"]`

**Key Differences and Use Cases**

| Feature               | `CMD`                                                       | `ENTRYPOINT`                                                          |
| --------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------- |
| **Override Behavior** | Easily overridden by `docker run`                           | Not easily overridden; arguments can be appended                      |
| **Execution**         | Runs _after_ `ENTRYPOINT` if both are defined               | Runs _first_, effectively becoming the container's primary executable |
| **Typical Use Cases** | Providing a default command, which can be changed if needed | Setting a fixed executable for the container, like a web server       |

Entrypoint file can be single command or shell script.
*Simple example of entrypoint script is this:*
`Entrypoint.sh`
```bash
#!/bin/bash

# Check if a configuration file exists
if [ ! -f /app/config.yml ]; then
  echo "Error: config.yml not found!"
  exit 1
fi

# Start the application
exec python /app/app.py
```

In your Dockerfile, you would use:

Dockerfile
```Dockerfile
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
```


Example of Dockerfile using *command for entrypoint*
Dockerfile
```Dockerfile
FROM ubuntu:latest

# Install Apache
RUN apt-get update && apt-get install -y apache2

# Set the entrypoint to the Apache server
ENTRYPOINT ["apache2ctl"]

# Default command to start Apache in the foreground
CMD ["-D", "FOREGROUND"] 
```

In this example, `ENTRYPOINT ["apache2ctl"]` configures the container to run the Apache web server as its main process. When you start a container from this image, it will always execute `apache2ctl`.

---
### Homework 
- Follow on [[Task 5 Create dockerfiles]]
