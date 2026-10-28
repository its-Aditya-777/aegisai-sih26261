# AegisAI — two end-to-end demo examples

All documents in `static/demo_documents/` are synthetic, text-searchable sample PDFs. They are not issued by AICTE or any authority. Use them only to demonstrate the prototype.

## Example 1 — consistent submission

1. Open **New application**.
2. Download **Complete submission** and extract the ZIP.
3. Click **Fill profile fields** under Example 01.
4. Upload all six PDFs, choosing the matching document type for each:
   - `01_EoA_Letter.pdf` → Extension of Approval (EoA) letter
   - `02_Accreditation_Certificate.pdf` → Accreditation / recognition certificate
   - `03_Faculty_Roster.pdf` → Faculty roster
   - `04_TER_Payment_Receipt.pdf` → TER payment receipt
   - `05_Infrastructure_Evidence.pdf` → Infrastructure evidence
   - `06_Affidavit_Undertaking.pdf` → Affidavit / undertaking
5. Keep category **Extension of Approval (EoA)** and academic year **2026-27**.
6. Click **Create application & validate**. The report should show the full checklist and no expiry/code-mismatch flags from the supplied sample fields. Issuer checks are still not live; use **Route to verification** to show the manual verification state.

## Example 2 — inconsistent submission

1. Open **New application**.
2. Download **Inconsistent submission** and extract the ZIP.
3. Click **Fill profile fields** under Example 02.
4. Upload the five included PDFs using their matching document types. Do **not** add an affidavit/undertaking; its absence is intentional.
5. Click **Create application & validate**. Expected findings include:
   - possible expired accreditation certificate (valid until 31/03/2024)
   - institution identifier mismatch in the faculty roster (`AICTE-DEMO-999` versus the application profile `AICTE-DEMO-205`)
   - missing affidavit / undertaking
6. Open **Open report** to show the evidence-linked explanation, recommended next step, checklist coverage and audit trail.

## What the prototype checks

- Presence of expected document types for the selected category
- PDF/DOCX/text extraction and a manual-review prompt if readable text is unavailable
- Expiry phrases and dates
- Institution identifiers and explicit institution-name consistency
- Exact duplicate uploads using SHA-256
- Selected file-signature and PDF metadata indicators
- Manual issuer-verification routing, reviewer actions, audit history, and report export

## Required demo disclaimer

The application uses synthetic sample data. It is not connected to AICTE's portal, restricted institutional records, or live issuing authorities. A flag is an explainable preliminary indicator, not proof of fraud or non-compliance. Final scrutiny, inspection and regulatory decisions remain with competent officials.
