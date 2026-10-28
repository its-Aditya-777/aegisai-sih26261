# Deploy AegisAI to Render for free

This repository is configured for a free Render Docker web service. The Docker image installs Tesseract OCR, and the container binds to Render's runtime `PORT`.

## 1. Push this folder to GitHub

Create an empty GitHub repository named `aegisai-sih26261` (do not initialize it with a README, license, or `.gitignore`). Open PowerShell in this extracted `AegisAI-SIH26261` folder and run:

```powershell
git init
git add .
git commit -m "Prepare AegisAI SIH26261 demo for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aegisai-sih26261.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. The `.gitignore` excludes `.env`, the virtual environment, and `instance/` (SQLite database and uploaded files).

## 2. Deploy with Render Blueprint

1. Sign in to Render at https://render.com/.
2. Choose **New + → Blueprint**.
3. Connect the GitHub repository you just pushed.
4. Render should detect `render.yaml`; review the service name and **Free** plan.
5. Click **Deploy Blueprint** and wait for the Docker build and deployment to finish.
6. Open the generated `https://...onrender.com` URL. Check `https://YOUR-SERVICE.onrender.com/healthz` for a JSON status response.
7. On the dashboard, click **Load guided demo**. Use synthetic records only.

The Blueprint generates `AEGISAI_SECRET_KEY` automatically and enables secure session cookies for HTTPS.

## Important free-tier limitations

- The free service can spin down after 15 minutes without traffic; its next request can take around a minute to wake it.
- Free Render services have an ephemeral filesystem. SQLite records, uploaded documents, and local rule overrides may disappear on restart, spin-down, or redeploy. For a demo, click **Load guided demo** again if needed.
- Do not upload real student, institution, or confidential documents. This prototype does not implement production-grade user authentication or authorized AICTE/issuer integrations.
- Synthetic issuer results are simulations and must never be described as official verification.
