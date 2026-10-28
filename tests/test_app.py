import io
import tempfile
import unittest
from pathlib import Path

import app as aegis


class AegisAITests(unittest.TestCase):
    def setUp(self):
        self.client = aegis.app.test_client()
        with self.client.session_transaction() as session:
            session["csrf_token"] = "test-token"
        self.token = "test-token"

    def test_dashboard_loads(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"AegisAI", response.data)

    def test_healthz(self):
        response = self.client.get("/healthz")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["status"], "ok")

    def test_demo_route_creates_case(self):
        response = self.client.post("/demo", data={"csrf_token": self.token}, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Synthetic demonstration case", response.data)
        self.assertIn(b"Institution identifier mismatch", response.data)

    def test_missing_csrf_rejected(self):
        response = self.client.post("/demo", data={})
        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
