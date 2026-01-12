# Deployment Guide (Vercel)

This application is ready to be deployed on Vercel.

## 1. Commit Your Changes
Before deploying, you MUST commit all local changes to Git. Open your terminal in the project folder and run:

```bash
git add .
git commit -m "Ready for deployment: Configured env vars and fixed UI"
git push
```

## 2. Deploy on Vercel

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository `aneesh-srivastava-11/Password_Gen`.
4.  **Configure Environment Variables**:
    *   Expand the **"Environment Variables"** section.
    *   Add the following variables (copy values from your Firebase Console settings):
        *   `NEXT_PUBLIC_FIREBASE_API_KEY`
        *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
        *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
        *   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
        *   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
        *   `NEXT_PUBLIC_FIREBASE_APP_ID`
5.  Click **"Deploy"**.

## Troubleshooting
- If you see the default "Next.js" page, it means your `src/pages/index.js` changes were not committed. Run the git commands in step 1 again.
