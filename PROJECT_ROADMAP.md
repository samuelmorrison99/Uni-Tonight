# Uni Tonight — Project Roadmap & Configuration Management Plan

**Project:** Uni Tonight (IP Owner Repository)  
**App ID:** `com.unitonight.app`  
**Framework:** React 19 + TypeScript + Vite + Capacitor 8  
**Backend:** Firebase (Auth, Firestore, FCM, Cloud Functions)

---

## 3-Step Execution Plan

### Step 1: Fix Profile Saving & Rapid Browser Validation
* **Objective:** Ensure all users can reliably create, edit, and persist their profiles without Firestore permission or document-not-found errors.
* **Key Tasks:**
  1. Update `Profile.tsx` to use `setDoc(..., { merge: true })` instead of `updateDoc`.
  2. Bind profile writes directly to `auth.currentUser.uid` so it strictly satisfies `firestore.rules` (`request.auth.uid == userId`).
  3. Run the local Vite server (`npm run dev`) and test profile saving live in Chrome/Edge.
  4. Verify the updated document appears in the live Firebase Console (`console.firebase.google.com`) in real-time.
* **Testing Benefit:** Eliminates slow mobile build turnaround. Proves the logic works before your associate builds or releases anything.

---

### Step 2: Configuration Management & Git Collaboration
* **Objective:** Stop trading `.zip` files and establish a single source of truth for you and your associate.
* **Key Tasks:**
  1. Clean up workspace structure and standardize the project directory.
  2. Initialize a local Git repository and create `.gitignore` (safeguarding signing keys and `.env` credentials).
  3. Create a private GitHub repository under the IP Owner account.
  4. Push baseline code to GitHub and invite the associate as a collaborator.
  5. Establish branching rules:
     * `main` — Production/Release-ready code.
     * `develop` — Active integration branch.
     * `feature/*` — New features (e.g. `feat/ios-config`).

---

### Step 3: iOS Configuration & Cloud Build Setup
* **Objective:** Enable iOS publishing to Apple TestFlight and the App Store without needing physical Mac hardware.
* **Key Tasks:**
  1. Install `@capacitor/ios` and add the native iOS project target (`npx cap add ios`).
  2. Register the iOS App in Firebase Console (`com.unitonight.app`) and place `GoogleService-Info.plist` into the iOS project.
  3. Configure App Store Connect API keys and signing credentials.
  4. Set up an automated cloud build pipeline (GitHub Actions macOS runner or EAS Build) to compile `.ipa` files and upload directly to Apple TestFlight.
  5. Test live on your iPhone via TestFlight.

---

## Change Log & Milestones

| Date | Milestone | Status | Notes |
| :--- | :--- | :--- | :--- |
| Oct 2026 | Code Ingestion & Architecture Audit | Done | Unpacked `Sam's project.zip`, audited React 19 + Capacitor 8 stack, identified root cause of profile saving bug. |
| Oct 2026 | Step 1: Profile Save Fix & Verification | Done | Profile saving upgraded to atomic `setDoc`, bound to user UID, build verified with 0 errors. |
| Oct 2026 | Step 2: Git Repository & Collaboration Workflow | In Progress | Git initialized locally with `main` and `develop` branches; `.gitignore` secured. Awaiting remote GitHub URL to push. |
| Oct 2026 | Step 3: iOS Target & TestFlight Cloud Pipeline | Pending | Ready after GitHub push. |
