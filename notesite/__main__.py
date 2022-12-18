import sqlite3
import time
from pathlib import Path
from typing import Any

from flask import send_file  # type: ignore
from flask import Flask, jsonify, request

DATABASE = Path("1.db")
app = Flask(__name__, static_folder="static")


def now():
    return int(time.time())


def cursor():
    con = sqlite3.connect(DATABASE)
    return con.cursor(), con


def success(**kwargs: Any):
    return jsonify(success=True, exception=None, **kwargs)


def failure(exception: str, **kwargs: Any):
    return jsonify(success=False, exception=exception, **kwargs)


@app.get("/")
def root():
    return send_file("static/index.html")


@app.get("/api/post/all")
def api_feed():
    cur, _ = cursor()
    cur.execute("SELECT created, content FROM posts ORDER BY created DESC")
    return success(posts=[{"created": i[0], "content": i[1]} for i in cur.fetchall()])


@app.post("/api/post/add")
def api_post_new():
    if not request.json:
        return failure("NotJson")
    try:
        content: str = request.json["content"]
    except KeyError:
        return failure("MissingFieldContent")
    if len(content.strip()) == 0:
        return failure("ContentEmpty")
    _, con = cursor()
    con.execute("INSERT INTO posts (created, content) VALUES (?, ?)", [now(), content])
    con.commit()
    return success()
