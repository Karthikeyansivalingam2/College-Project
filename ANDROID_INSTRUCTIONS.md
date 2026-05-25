# Android App Build Guide 📱

We have successfully configured your project with **Capacitor** and generated a native Android project folder (`/android`).

You have **two methods** to run and build your app. Choose the one that fits your deployment status:

---

## 🛠️ Choose Your App Method

### Method 1: Hosted Web App (Recommended & Easiest)
If your website is already hosted on Vercel or Render, you can make the app load your live website. 

* **Pros:** Any frontend updates you deploy to Vercel/Render will show up in the mobile app instantly without needing to rebuild or reinstall the APK!
* **How to configure:**
  1. Open `capacitor.config.json` in the root folder.
  2. Modify it to include your live URL inside the `server` object:
     ```json
     {
       "appId": "com.foodiezone.app",
       "appName": "Foodie Zone",
       "webDir": "public",
       "server": {
         "url": "https://your-vercel-domain.vercel.app",
         "cleartext": true
       }
     }
     ```
  3. Run the sync command in your terminal:
     ```bash
     npx cap sync
     ```

### Method 2: Local Assets + Hosted API
If you want the app's HTML/CSS/JS files to load locally from the phone, but connect to your database API hosted online.

* **Pros:** Loads static pages immediately.
* **How to configure:**
  1. Open `public/assets/js/common.js`.
  2. Put your live backend URL in the `API_BASE_URL` variable at the top of the file:
     ```javascript
     const API_BASE_URL = 'https://your-vercel-backend-domain.vercel.app';
     ```
  3. Run the sync command in your terminal to copy the changes into the Android project:
     ```bash
     npx cap sync
     ```

---

## 🚀 How to Build the APK (.apk)

Follow these steps to compile the app using Android Studio:

### Step 1: Open the project in Android Studio
Run the following command in your terminal:
```bash
npx cap open android
```
*This will automatically launch Android Studio and open the native `/android` project folder.*

### Step 2: Wait for Gradle Sync
When Android Studio opens, wait for the **Gradle build/sync** to finish. You will see a progress bar at the bottom right. Once it's finished, you'll see a green checkmark.

### Step 3: Build the APK
1. In the top menu bar, click on **Build**.
2. Hover over **Build Bundle(s) / APK(s)**.
3. Click on **Build APK(s)**.

### Step 4: Locate the APK File
Once the build completes, a popup notification will appear in the bottom-right corner of Android Studio saying **"APK(s) generated successfully"**.
1. Click the **locate** link in that popup.
2. It will open Windows Explorer pointing to the compiled APK file:
   `app-debug.apk` (usually located under `android/app/build/outputs/apk/debug/`).

---

## 📲 Installing on Your Phone
1. Copy the `app-debug.apk` file to your Android phone.
2. Open the file on your phone using a File Manager.
3. If prompted, enable **"Allow installation from unknown sources"** in your phone settings.
4. Install the app!
