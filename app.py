import os
import socket
from datetime import datetime, timezone

from flask import Flask

app = Flask(__name__)

# In-memory counter to show that each container has its own state
request_count = 0


@app.route("/")
def home():
    global request_count
    request_count += 1
    return {
        "message": "Hello from the Mandvi Education Society DevOps session!",
        "container_hostname": socket.gethostname(),
        "served_by_env": os.environ.get("APP_ENV", "local"),
        "request_number": request_count,
        "time": datetime.now(timezone.utc).isoformat(),
    }


@app.route("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
