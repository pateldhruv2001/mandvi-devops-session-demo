import os
import socket
from datetime import datetime, timezone

from flask import Flask, jsonify, render_template_string

app = Flask(__name__)

# In-memory counter to show that each container has its own state
request_count = 0

PAGE_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevOps in Production - Mandvi Education Society</title>
  <style>
    :root {
      --navy: #0b2559;
      --blue: #1f6fd8;
      --light-blue: #eaf3fb;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Segoe UI', Arial, sans-serif;
      background: linear-gradient(180deg, var(--light-blue) 0%, #ffffff 60%);
      color: var(--navy);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }
    .card {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 12px 32px rgba(11, 37, 89, 0.15);
      max-width: 640px;
      width: 100%;
      overflow: hidden;
      border: 1px solid #dce8f7;
    }
    .header {
      background: var(--navy);
      color: white;
      padding: 24px 32px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 4px;
      font-size: 1.4rem;
      letter-spacing: 0.5px;
    }
    .header p {
      margin: 0;
      color: #b9d1f5;
      font-size: 0.9rem;
    }
    .body {
      padding: 28px 32px;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #e4f7ec;
      color: #1a7f4b;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .status-badge .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    td {
      padding: 10px 0;
      border-bottom: 1px solid #eef2f8;
      font-size: 0.92rem;
    }
    td.label {
      color: #5b6b85;
      width: 45%;
    }
    td.value {
      font-weight: 600;
      color: var(--navy);
      text-align: right;
      word-break: break-all;
    }
    .footer {
      text-align: center;
      padding: 16px;
      font-size: 0.78rem;
      color: #8a99b3;
      background: var(--light-blue);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>THE MANDVI EDUCATION SOCIETY - MCA</h1>
      <p>Workshop: DevOps in Production - Git, IaC, Docker &amp; the Architecture Behind Scale</p>
    </div>
    <div class="body">
      <div class="status-badge"><span class="dot"></span> Deployed and running</div>
      <table>
        <tr><td class="label">Message</td><td class="value">{{ message }}</td></tr>
        <tr><td class="label">Deployed via</td><td class="value">{{ served_by_env }}</td></tr>
        <tr><td class="label">Container hostname</td><td class="value">{{ container_hostname }}</td></tr>
        <tr><td class="label">Request number (this container)</td><td class="value">{{ request_number }}</td></tr>
        <tr><td class="label">Server time (UTC)</td><td class="value">{{ time }}</td></tr>
      </table>
    </div>
    <div class="footer">Refresh the page - the request number increases, but restart the container and it resets to 1.</div>
  </div>
</body>
</html>
"""


def build_status():
    global request_count
    request_count += 1
    return {
        "message": "Hello from Dhruv tothe Mandvi Education Society DevOps session!",
        "container_hostname": socket.gethostname(),
        "served_by_env": os.environ.get("APP_ENV", "local"),
        "request_number": request_count,
        "time": datetime.now(timezone.utc).isoformat(),
    }


@app.route("/")
def home():
    return render_template_string(PAGE_TEMPLATE, **build_status())


@app.route("/api")
def api():
    return jsonify(build_status())


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
