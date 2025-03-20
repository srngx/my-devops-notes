
Dockerfile
```Dockerfile
FROM python:3.11-slim-bullseye
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .
EXPOSE 8080
CMD [ "python3", "-m", "helloworld", "run", "--host=0.0.0.0" ]
```

Our source code
helloworld.py
```python
from flask import Flask

import random

app = Flask(__name__)

def calculate_lucky_numbers():

    numbers = random.sample(range(1,53),5)
    return str(numbers)[1:-1]

@app.route("/")
def hello():

    message = "<h1 style=\"color: #001cff;\">Hello world from intel cloud.U</h1>"
    message += "<h2>Version 2.0</h2>"
    message += "<p> Your lucky numbers are <b>"
    message += calculate_lucky_numbers() + "</b></p>"
    return (message)

app.run(host='0.0.0.0', port=8080, debug=True)
```

requirements.txt
```txt
flask
```