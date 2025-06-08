---
title: PHP-MySQL Web Application Development and EC2 Deployment
date: 2025-01-26
tags:
  - sidequests
  - mysql
  - AWS
---
My Attempt to recreate PHP MYSQL Based Webapp from scratch

Below is the very first basic Idea its more than alpha state it required hardcoded credentials and has very basic simple looking UI.
however **More matured version is stored in Github** https://github.com/srngx/studentUI

#### 1. EC2 Instance Setup and MySQL Installation
```sh
# Update system packages
sudo yum update -y

# Install Apache web server
sudo yum install -y httpd

# Install PHP and MySQL
sudo amazon-linux-extras enable php7.4
sudo yum clean metadata
sudo yum install -y php php-devel php-mysqlnd httpd mysql-server

# Start and enable services
sudo systemctl start httpd
sudo systemctl enable httpd
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Secure MySQL installation
sudo mysql_secure_installation
```

#### 2. Database and Table Creation
```mysql
-- Create database
CREATE DATABASE user_registration;
USE user_registration;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100),
    address VARCHAR(255),
    email VARCHAR(100) UNIQUE,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255)
);
```

#### 3. User signin page
signin.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sign In</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 300px;
        }
        input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .signup-link {
            text-align: center;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Sign In</h2>
        <form action="login.php" method="post">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Sign In</button>
        </form>
        <div class="signup-link">
            <p>Don't have an account? <a href="signup.html">Sign Up</a></p>
        </div>
    </div>
</body>
</html>
```

#### 4. User Registration page
signup.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sign Up</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 300px;
        }
        input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Sign Up</h2>
        <form action="register.php" method="post">
            <input type="text" name="student_name" placeholder="Student Name" required>
            <input type="text" name="address" placeholder="Address" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Register</button>
        </form>
    </div>
</body>
</html>
```

#### 5. Register Script
register.php
```php
<?php
session_start();
$host = 'localhost';
$db_username = 'root';  // Change this to your MySQL username
$db_password = 'your_mysql_password';  // Change to your MySQL password
$database = 'user_registration';

// Create connection
$conn = new mysqli($host, $db_username, $db_password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $student_name = $conn->real_escape_string($_POST['student_name']);
    $address = $conn->real_escape_string($_POST['address']);
    $email = $conn->real_escape_string($_POST['email']);
    $username = $conn->real_escape_string($_POST['username']);
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    // Check if username or email already exists
    $check_query = "SELECT * FROM users WHERE username = ? OR email = ?";
    $stmt = $conn->prepare($check_query);
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "Username or email already exists!";
    } else {
        // Insert new user
        $sql = "INSERT INTO users (student_name, address, email, username, password) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssss", $student_name, $address, $email, $username, $password);

        if ($stmt->execute()) {
            $_SESSION['username'] = $username;
            header("Location: profile.php");
        } else {
            echo "Error: " . $stmt->error;
        }
    }
    $stmt->close();
}
$conn->close();
?>
```

#### 6. Login Script 
Login.php
```php
<?php
session_start();
$host = 'localhost';
$db_username = 'root';
$db_password = 'your_mysql_password';
$database = 'user_registration';

$conn = new mysqli($host, $db_username, $db_password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $conn->real_escape_string($_POST['username']);
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['username'] = $username;
            header("Location: profile.php");
        } else {
            echo "Incorrect password!";
        }
    } else {
        echo "Account not registered!";
    }
    $stmt->close();
}
$conn->close();
?>
```

#### 7. Profile Page
Profile.php
```php
<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: signin.html");
    exit();
}

$host = 'localhost';
$db_username = 'root';
$db_password = 'your_mysql_password';
$database = 'user_registration';

$conn = new mysqli($host, $db_username, $db_password, $database);

$username = $_SESSION['username'];
$sql = "SELECT * FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Profile</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
        .profile-section { background: #f4f4f4; padding: 20px; border-radius: 5px; }
        input { width: 100%; margin: 10px 0; padding: 5px; }
        button { margin-top: 10px; padding: 10px; }
    </style>
</head>
<body>
    <div class="profile-section">
        <h2>Profile</h2>
        <form action="update_profile.php" method="post">
            <label>Name: <input type="text" name="student_name" value="<?php echo $user['student_name']; ?>"></label>
            <label>Email: <input type="email" name="email" value="<?php echo $user['email']; ?>"></label>
            <label>New Password: <input type="password" name="new_password"></label>
            <button type="submit">Update Profile</button>
        </form>
        <a href="logout.php">Logout</a>
    </div>
</body>
</html>
```

#### 8. Update profile script
update_profile.php
```php
<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: signin.html");
    exit();
}

$host = 'localhost';
$db_username = 'root';
$db_password = 'your_mysql_password';
$database = 'user_registration';

$conn = new mysqli($host, $db_username, $db_password, $database);

$username = $_SESSION['username'];
$student_name = $conn->real_escape_string($_POST['student_name']);
$email = $conn->real_escape_string($_POST['email']);

$update_sql = "UPDATE users SET student_name = ?, email = ?";
$params = [$student_name, $email];
$types = "ss";

if (!empty($_POST['new_password'])) {
    $new_password = password_hash($_POST['new_password'], PASSWORD_BCRYPT);
    $update_sql .= ", password = ?";
    $params[] = $new_password;
    $types .= "s";
}

$update_sql .= " WHERE username = ?";
$params[] = $username;
$types .= "s";

$stmt = $conn->prepare($update_sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    header("Location: profile.php");
} else {
    echo "Error updating profile: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
```

#### Logout script
logout.php
```php
<?php
session_start();
session_destroy();
header("Location: signin.html");
exit();
?>
```

>[!Tip]
>These are basic structure of app but whole improve code can be found here:
> https://github.com/srngx/studentUI

Deployment Steps:

1. Install all these files in `/var/www/html/` directory
2. Set proper file permissions: `sudo chmod 755 /var/www/html/*`
3. Restart Apache: `sudo systemctl restart httpd`

Security Notes:

- Replace `your_mysql_password` with a strong password
- Configure firewall to allow HTTP/HTTPS traffic
- Use HTTPS in production
- Implement additional input validation

Requirements Covered:

- MySQL installed on EC2
- Simple registration and login system
- Profile update functionality
- Basic error handling
- Password hashing for security

### Kubernetifying this app (WIP)
#### Step 1: Create dockerimage
```Dockerfile
FROM php:7.4-apache

# Install system dependencies and PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copy application files
COPY . /var/www/html/

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Expose port 80
EXPOSE 80

```

```sh
docker build -t your-dockerhub-username/php-user-registration:v1 .
docker push your-dockerhub-username/php-user-registration:v1
```

