# Deploying to Netlify

This application is ready to be deployed to Netlify. Follow these simple steps for a "zero-man" setup:

## 1. Connect to GitHub/GitLab/Bitbucket
- Push your code to a repository.
- Log in to [Netlify](https://www.netlify.com/).
- Click **"Add new site"** > **"Import an existing project"**.
- Select your repository.

## 2. Configure Build Settings
The application includes a `netlify.toml` file that automatically configures:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Redirects:** Handles Single Page Application (SPA) routing.

## 3. Set Environment Variables
**CRITICAL:** You must set your Gemini API Key in the Netlify dashboard for the app to function.
- Go to **Site settings** > **Environment variables**.
- Add a new variable:
  - **Key:** `GEMINI_API_KEY`
  - **Value:** (Your Google Gemini API Key)

## 4. Deploy
- Click **"Deploy site"**.
- Once the build finishes, your app will be live!

---

### Security Note
The current setup bakes the `GEMINI_API_KEY` into the client-side bundle during the build process. For a production-grade application, it is recommended to use **Netlify Functions** to proxy API requests and keep the key hidden from the browser.
