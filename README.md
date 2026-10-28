# AegisAI — AICTE Application Validation & Compliance Assistant

**SIH 2026 · Problem Statement SIH26261 · Smart Automation · Software**

AegisAI is a local, demonstrable decision-support prototype for preliminary application and document scrutiny. It combines file intake, text extraction/OCR, category-based checklist checks, explicit expiry-date checks, institution identifier consistency checks, duplicate-file hashing, lightweight document-type hints, selected PDF metadata indicators, issuer-verification workflow states, review actions and evidence-linked reports.

> **Important:** This is an independent prototype, not an official AICTE product. It does not connect to AICTE's portal, restricted institutional records, or live issuing-authority systems. Synthetic issuer responses are labelled as synthetic. All flags are advisory; only competent authorities can make regulatory decisions.

## Quick start (Windows PowerShell)

Open PowerShell in this project folder and run:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python app.py
```

Then open **http://127.0.0.1:5000**.

If PowerShell blocks activation, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in that terminal and activate again. If Python 3.12 is not installed, use another supported Python 3.11+ version.

## Best demo path

1. Open the dashboard and use **Load guided demo** for the fastest pre-populated review case.
2. For a real upload walkthrough, open **New application** and choose one of the two downloadable synthetic PDF packs.
3. Example 1 contains six consistent sample PDFs; Example 2 contains five PDFs with an expired date, institution-code mismatch and intentionally missing affidavit.
4. Use the **Fill profile fields** button, extract the downloaded ZIP, and attach each PDF under its matching document type.
5. Open the application details to review extracted text, evidence-linked findings, checklist coverage and audit history.
6. Open **Unified report** and print / save as PDF, or export findings as CSV/JSON.

See [`DEMO_GUIDE.md`](DEMO_GUIDE.md) for the exact file-to-document-type mapping and expected results.

## Extraction and OCR

- Text PDFs are read with `pypdf`; DOCX with `python-docx`; TXT/CSV as text.
- Scanned PDFs and images attempt OCR with `pytesseract` and PyMuPDF/Pillow.
- The Python packages alone do not install the Tesseract executable on Windows. Install Tesseract OCR separately and ensure `tesseract.exe` is on PATH to enable OCR for scanned files. Without it, the app records an OCR-unavailable status and recommends manual review rather than inventing extracted content.
- OCR and keyword classification can be wrong. The app displays extracted text previews and treats all anomalies as review indicators, not proof of forgery.

## Configuration

- `config/required_documents.json` defines the illustrative category-to-document checklist. Update it only using current, authorized requirements.
- `config/default_rules.json` defines the available checks.
- The **Rule library** page enables/disables checks locally; overrides are stored under `instance/rules.json`.
- SQLite data and uploaded files are stored in `instance/` (ignored by Git). Back up or remove this directory as appropriate.

## Run with Docker

```bash
docker build -t aegisai-sih26261 .
docker run --rm -p 8000:8000 -v aegisai-data:/app/instance aegisai-sih26261
```

Open **http://127.0.0.1:8000**. The image installs Tesseract OCR. A persistent volume is mounted for the SQLite database and uploaded files.

## Deployment notes

`Procfile` is included for a Gunicorn-compatible host. Before any public or real-data deployment, implement real authentication/authorization (for example, institutional SSO), CSRF/session key management, encryption and retention controls, secure persistent storage, malware scanning, rate limiting, monitoring, and authorized integrations. Set `AEGISAI_SECRET_KEY` to a strong secret and enable HTTPS cookie mode with `AEGISAI_HTTPS=1` when deployed behind HTTPS. This local prototype's reviewer label is not an authentication system.

## Checks currently implemented

- Category-based required-document presence
- Text extraction / unreadable-document review prompts
- File extension vs. content-signature check for selected types
- Explicit validity-date extraction and expiry flags
- Institution code and explicit institution-name consistency hints
- Exact duplicate-file detection using SHA-256
- Low-confidence PDF metadata timestamp indicators
- Keyword-based document type classification hint
- Synthetic issuer registry for demo references; all real uploads route to manual verification because no live authorized source is connected
- Finding acknowledgement/resolution, audit log, printable report, CSV and JSON export

## Evaluation suggestions

Use only synthetic or authorized anonymized test records. Report extraction success, required-document detection, identifier mismatch detection, duplicate detection, review time and false-positive examples. Do not claim official verification, fraud detection accuracy, regulatory compliance certification or production security without an appropriate evaluation.

## Deploy online for a hackathon demo

See [`DEPLOY_RENDER.md`](DEPLOY_RENDER.md). This repository includes a Render Blueprint (`render.yaml`) for a free Docker web service with Tesseract OCR and an automatically generated session secret. Free-tier storage is ephemeral; use synthetic demo data only.
