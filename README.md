# Cafe Chaska - Full Stack Deployment Guide

This project consists of two parts:
1.  **Backend (API)**: Node.js/Express + MongoDB + Socket.io
2.  **Frontend (Web)**: Next.js

## 🚀 1. Deploy Backend (API) to Render

Since Vercel Serverless functions don't support Socket.io (WebSocket), we will use **Render** for the backend.

1.  Create a [Render account](https://render.com/).
2.  Click **"New +"** -> **"Blueprints"**.
3.  Connect your GitHub repository (`CafeChaska`).
4.  Render will automatically detect the `render.yaml` file.
5.  Click **"Apply"**.
6.  **Environment Variables**:
    *   Render might ask for `MONGO_URI`, `CLOUDINARY_CLOUD_NAME`, etc.
    *   Add your MongoDB connection string and Cloudinary keys here.
7.  Once deployed, copy your **Backend URL** (e.g., `https://cafe-chaska-api.onrender.com`).

## 🌐 2. Deploy Frontend (Web) to Vercel

1.  Go to [Vercel](https://vercel.com/) and import the `CafeChaska` repository.
2.  **Project Settings**:
    *   **Root Directory**: Click "Edit" and select `apps/web`.
3.  **Environment Variables**:
    *   Add a new variable:
        *   **Name**: `API_URL`
        *   **Value**: Your Render Backend URL (e.g., `https://cafe-chaska-api.onrender.com`) **(No trailing slash)**
4.  Click **Deploy**.

## 🛠 Troubleshooting

*   **404 on Vercel**: Make sure "Root Directory" is set to `apps/web`.
*   **API Errors**: specific "Environment Variables" in Vercel to point to the Render backend.
*   **Socket.io not connecting**: Ensure the frontend is using the correct `API_URL`.