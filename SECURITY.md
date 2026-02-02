# Securing Your Firebase API Key

Since this application runs entirely in the browser (Client-Side), your API key **must** be exposed in the code for the app to work. This is standard for Firebase web apps.

However, to prevent misuse, you should restrict **where** this key can be used.

## Steps to Restrict the Key

1.  **Go to Google Cloud Console**:
    - Visit [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials).
    - Make sure you have selected your project (`moneymanager-5pg`).

2.  **Edit the API Key**:
    - Find the API Key listed (it matches the one in `firebase.js`).
    - Click the **Edit** (pencil) icon or the name of the key.

3.  **Set Application Restrictions**:
    - Under **"Application restrictions"**, select **"HTTP referrers (websites)"**.
    - Click **"Add an item"** for each domain you want to allow.

4.  **Add Allowed Domains**:
    Add the following entries to ensure it works both on your phone/friends' phones (via the git link) and on your computer during development:

    - **Your GitHub Pages URL**:
      ```text
      https://radhakrishnansa.github.io/*
      ```
      *(Replace `radhakrishnansa` with your exact GitHub username if different)*

    - **Local Development** (so you can still test on your PC):
      ```text
      http://localhost:*
      http://127.0.0.1:*
      ```

5.  **Save Changes**:
    - Click **Save**.

## Why this is safe
Once restricted, even if someone steals your API key, they cannot use it because requests coming from anywhere other than your website (GitHub Pages) or your local computer will be rejected by Google's servers.
