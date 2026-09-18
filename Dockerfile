FROM python:3.12-slim

WORKDIR /app

# Copy dependency file first so Docker can cache this layer
# and skip re-installing packages when only app.py changes
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# Run as a non-root user (good practice, not required for this demo)
RUN useradd -m appuser
USER appuser

ENV APP_ENV=docker
EXPOSE 5000

CMD ["python", "app.py"]
