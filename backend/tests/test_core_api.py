"""Core API regression tests: root, status create/list, and data contract checks."""

import os
import uuid
from pathlib import Path

import pytest
import requests
from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parents[1]
load_dotenv(ROOT_DIR / ".env")
load_dotenv(ROOT_DIR.parent / "frontend" / ".env")

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")

if not BASE_URL:
    pytest.skip("REACT_APP_BACKEND_URL is not configured", allow_module_level=True)


def test_api_root_returns_hello_world_payload():
    """Module: root endpoint basic availability + payload contract."""
    response = requests.get(f"{BASE_URL}/api/")
    assert response.status_code == 200

    data = response.json()
    assert data == {"message": "Hello World"}


def test_status_create_then_list_contains_created_record():
    """Module: status endpoint create/list persistence behavior via API workflow."""
    suffix = uuid.uuid4().hex[:8]
    create_payload = {"client_name": f"TEST_Status_{suffix}"}

    create_response = requests.post(f"{BASE_URL}/api/status", json=create_payload)
    assert create_response.status_code == 200

    created = create_response.json()
    assert created["client_name"] == create_payload["client_name"]
    assert isinstance(created["id"], str) and len(created["id"]) > 0
    assert isinstance(created["timestamp"], str) and "T" in created["timestamp"]

    list_response = requests.get(f"{BASE_URL}/api/status")
    assert list_response.status_code == 200

    statuses = list_response.json()
    assert isinstance(statuses, list)
    matched = [item for item in statuses if item.get("id") == created["id"]]
    assert len(matched) == 1
    assert matched[0]["client_name"] == create_payload["client_name"]
    assert "_id" not in matched[0]
