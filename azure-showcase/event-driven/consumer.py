#!/usr/bin/env python3
"""
Polls the 'incoming-files' queue for BlobCreated events, downloads the new
blob from the 'demo' container, "processes" it (uppercases the text - stand
in for something heavier like OCR), and writes the result into the
'processed' container. Then deletes the queue message.

Auth: uses `az` CLI login (your own account) via --auth-mode login, so no
storage keys are hardcoded here either.
"""
import json
import subprocess
import sys
import tempfile
import time

ACCOUNT = sys.argv[1] if len(sys.argv) > 1 else None
QUEUE = "incoming-files"
SOURCE_CONTAINER = "demo"
DEST_CONTAINER = "processed"

if not ACCOUNT:
    print("Usage: consumer.py <storage-account-name>")
    sys.exit(1)


def run(cmd):
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("ERROR running:", " ".join(cmd))
        print(result.stderr)
        return None
    return result.stdout


def main():
    print(f"Listening on queue '{QUEUE}' in account '{ACCOUNT}'... (Ctrl+C to stop)")
    while True:
        out = run([
            "az", "storage", "message", "get",
            "--account-name", ACCOUNT,
            "--queue-name", QUEUE,
            "--auth-mode", "login",
            "-o", "json",
        ])
        messages = json.loads(out) if out else []
        if not messages:
            time.sleep(3)
            continue

        for msg in messages:
            import base64
            body = base64.b64decode(msg["content"]).decode("utf-8", errors="ignore")
            event = json.loads(body)
            subject = event.get("subject", "")
            blob_name = subject.split("/")[-1]
            print(f"\n[event] new blob detected: {blob_name}")

            with tempfile.NamedTemporaryFile(delete=False) as tmp_in:
                run([
                    "az", "storage", "blob", "download",
                    "--account-name", ACCOUNT,
                    "--container-name", SOURCE_CONTAINER,
                    "--name", blob_name,
                    "--file", tmp_in.name,
                    "--auth-mode", "login",
                ])
                content = open(tmp_in.name).read()

            processed_content = content.upper()
            processed_name = f"processed-{blob_name}"
            with tempfile.NamedTemporaryFile(mode="w", delete=False) as tmp_out:
                tmp_out.write(processed_content)
                tmp_out_path = tmp_out.name

            run([
                "az", "storage", "blob", "upload",
                "--account-name", ACCOUNT,
                "--container-name", DEST_CONTAINER,
                "--name", processed_name,
                "--file", tmp_out_path,
                "--auth-mode", "login",
                "--overwrite",
            ])
            print(f"[done] wrote result to {DEST_CONTAINER}/{processed_name}")

            run([
                "az", "storage", "message", "delete",
                "--account-name", ACCOUNT,
                "--queue-name", QUEUE,
                "--id", msg["id"],
                "--pop-receipt", msg["popReceipt"],
                "--auth-mode", "login",
            ])


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nStopped.")
