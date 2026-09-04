"""Contact API regression tests: validation, response contract, and MongoDB persistence."""

import os
import uuid
from datetime import datetime

import pytest
import requests
from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv("/app/frontend/.env")
load_dotenv("/app/backend/.env")

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")


if not BASE_URL:
    raise RuntimeError("REACT_APP_BACKEND_URL is required")
if not MONGO_URL or not DB_NAME:
    raise RuntimeError("MONGO_URL and DB_NAME are required")


@pytest.fixture
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture
def mongo_collection():
    client = MongoClient(MONGO_URL)
    collection = client[DB_NAME]["contact_submissions"]
    try:
        yield collection
    finally:
        client.close()


@pytest.fixture
def created_contact_ids():
    return []


@pytest.fixture(autouse=True)
def cleanup_test_contacts(mongo_collection, created_contact_ids):
    yield
    if created_contact_ids:
        mongo_collection.delete_many({"id": {"$in": created_contact_ids}})
    mongo_collection.delete_many({"name": {"$regex": "^TEST_"}})


class TestContactAPI:
    """Tests for /api/contact endpoint and DB persistence."""

    def test_contact_create_returns_201_without_mongo_id(
        self, api_client, created_contact_ids
    ):
        test_suffix = uuid.uuid4().hex[:8]
        payload = {
            "name": f"TEST_Contact_{test_suffix}",
            "email": f"test.{test_suffix}@example.com",
            "company": "TEST_VisionHive",
            "message": "This is a valid project inquiry message for regression testing.",
        }

        response = api_client.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 201

        data = response.json()
        created_contact_ids.append(data["id"])

        assert "_id" not in data
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["company"] == payload["company"]
        assert data["message"] == payload["message"]
        assert data["status"] == "new"
        assert isinstance(data["id"], str) and len(data["id"]) > 0
        assert isinstance(datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")), datetime)

    @pytest.mark.parametrize(
        "payload",
        [
            {
                "name": "TEST_InvalidEmail",
                "email": "not-an-email",
                "company": "TEST_Company",
                "message": "This message has enough length.",
            },
            {
                "name": "A",
                "email": "short.name@example.com",
                "company": "TEST_Company",
                "message": "short",
            },
        ],
    )
    def test_contact_invalid_payload_returns_422(self, api_client, payload):
        response = api_client.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 422

        data = response.json()
        assert "detail" in data
        assert isinstance(data["detail"], list)

    def test_contact_submission_persists_required_fields(
        self, api_client, mongo_collection, created_contact_ids
    ):
        test_suffix = uuid.uuid4().hex[:8]
        payload = {
            "name": f"TEST_Persist_{test_suffix}",
            "email": f"persist.{test_suffix}@example.com",
            "company": "TEST_PersistenceCo",
            "message": "Please contact us about redesign and paid growth engagement.",
        }

        response = api_client.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 201
        created = response.json()
        created_contact_ids.append(created["id"])

        db_doc = mongo_collection.find_one({"id": created["id"]})
        assert db_doc is not None
        assert db_doc["id"] == created["id"]
        assert db_doc["name"] == payload["name"]
        assert db_doc["email"] == payload["email"]
        assert db_doc["company"] == payload["company"]
        assert db_doc["message"] == payload["message"]
        assert db_doc["status"] == "new"
        assert "created_at" in db_doc
