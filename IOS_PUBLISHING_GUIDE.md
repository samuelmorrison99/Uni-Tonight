# Uni Tonight — iOS Publishing & TestFlight Guide

This guide details how to publish **Uni Tonight** to **Apple TestFlight** and the **App Store** without owning a physical Mac.

---

## 1. Firebase iOS Configuration (Required for Database & Push)

1. Go to [console.firebase.google.com](https://console.firebase.google.com/) and open your **`unitonight-c8c75`** project.
2. In Project Overview, click **+ Add app** and select the **Apple (iOS)** icon.
3. Fill in:
   * **Apple bundle ID:** `com.unitonight.app`
   * **App nickname:** `UniTonight`
   * **App Store ID:** *(Leave blank for now)*
4. Click **Register app**.
5. Download the generated **`GoogleService-Info.plist`** file.
6. Place that file in:
   `C:\Users\Owner\Desktop\Antigravity\Uni Tonight\ios\App\App\GoogleService-Info.plist`

---

## 2. Register Your App on Apple Developer & App Store Connect

### Part A: Register the App ID (developer.apple.com)
1. Go to [developer.apple.com/account](https://developer.apple.com/account).
2. Go to **Certificates, Identifiers & Profiles** -> **Identifiers** (left menu).
3. Click the blue **`+`** icon -> select **App IDs** -> **Continue**.
4. Select type **App** -> **Continue**.
5. Fill in:
   * **Description:** `Uni Tonight`
   * **Bundle ID:** Select **Explicit** and enter `com.unitonight.app`
6. Click **Continue** -> **Register**.

### Part B: Create the App Listing (appstoreconnect.apple.com)
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com) and log in.
2. Click **Apps** -> click the **`+`** icon -> **New App**.
3. Fill in:
   * **Platforms:** iOS
   * **Name:** `Uni Tonight`
   * **Primary Language:** English (UK)
   * **Bundle ID:** Select `Uni Tonight - com.unitonight.app`
   * **SKU:** `unitonight-app-01`
   * **User Access:** Full Access
4. Click **Create**.

---

## 3. How Builds Are Compiled in the Cloud (Without a Mac)

We have added a **GitHub Actions Cloud Workflow** to your repository:
👉 `.github/workflows/ios-build.yml`

### How It Works:
1. Whenever you want an iOS build, open your GitHub repository in your web browser:
   `https://github.com/samuelmorrison99/Uni-Tonight`
2. Click the **Actions** tab at the top.
3. In the left sidebar, click **Build iOS (Apple)**.
4. Click the **Run workflow** button on the right -> Click the green **Run workflow** button.
5. GitHub will start a cloud Apple Mac machine, compile the web assets, build the iOS archive, and upload the build artifact for you!

---

## 4. Testing on Your iPhone via TestFlight

1. On your iPhone, download the free **TestFlight** app from the App Store.
2. In App Store Connect -> **TestFlight** tab:
   * Add yourself under **Internal Testing**.
3. Once the cloud build is uploaded, you will receive an email invite on your iPhone.
4. Tap the invite in the email or open TestFlight, tap **Install**, and Uni Tonight will install directly on your iPhone!
