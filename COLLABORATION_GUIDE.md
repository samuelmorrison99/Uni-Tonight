# Uni Tonight — Configuration Management & Collaboration Guide

This document defines how you (the IP Owner) and your associate collaborate using **Git and GitHub** so that you **never have to email or share `.zip` files again**.

---

## 1. Setting Up Your Private GitHub Repository (One-Time Setup)

1. Go to [github.com](https://github.com) and log in to your account.
2. In the top right corner, click the **`+`** icon -> **New repository**.
3. Fill in:
   * **Repository name:** `uni-tonight`
   * **Visibility:** Select **Private** 🔒 *(Critical for your IP protection!)*
   * **Initialize with:** Leave **all checkboxes unchecked** (no README, no .gitignore, no license — we already created them).
4. Click **Create repository**.
5. Copy the HTTPS repository URL (it looks like `https://github.com/YOUR_USERNAME/uni-tonight.git`).

---

## 2. Linking Your Computer to GitHub

Open PowerShell in this directory (`c:\Users\Owner\Desktop\Antigravity\Uni Tonight`) or ask me to run it for you:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/uni-tonight.git
git push -u origin --all
```

Your entire codebase (including the profile saving fix and clean project structure) is now backed up and version-controlled under your GitHub account.

---

## 3. Granting Access to Your Associate

1. In your GitHub repository, click **Settings** (top tab).
2. On the left menu, click **Collaborators**.
3. Click **Add people**.
4. Enter your associate's GitHub username or email address and click **Add to this repository**.
5. Your associate will receive an invitation email to accept.

---

## 4. How Your Associate Works (No More .zip Files!)

Send these simple instructions to your associate:

### First-Time Clone (for Associate):
```bash
git clone https://github.com/YOUR_USERNAME/uni-tonight.git
cd uni-tonight
git checkout develop
npm install
```

### Daily Workflow:
Whenever your associate starts working, they run:
```bash
git pull origin develop
```
*(This instantly downloads any new code or fixes you or the team made).*

Whenever your associate finishes making a change (e.g. for a Google Play update):
```bash
git add .
git commit -m "Describe the change made"
git push origin develop
```

---

## 5. Branching Strategy (Release Control)

| Branch | Purpose | Who Uses It |
| :--- | :--- | :--- |
| **`develop`** | Active integration & new features. | You & Your Associate |
| **`main`** | Production-ready, stable releases for App Store & Google Play. | You (IP Owner) |

When you are ready to ship a release to the App Store and Google Play, we merge `develop` into `main` and tag the release version (e.g. `v1.0.4`).

---

## 6. IP Security Summary

* **Ownership:** The repository belongs to **your** account. You can revoke access at any time with a single click.
* **Secrets Protected:** Signing keys (`*.jks`, `*.keystore`) and local secrets (`.env`) are excluded from public commits via `.gitignore`.
* **Audit Trail:** Every single line of code added or modified is permanently timestamped with the author's identity. Nothing can be lost or accidentally overwritten.
