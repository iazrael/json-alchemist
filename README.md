<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# JSON Alchemist

A powerful JSON formatter, validator, and AI-powered repair tool.

View your app in AI Studio: https://ai.studio/apps/drive/1RsQlKhDFvZmkINucJs5-AU41OCeWvhMo

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3. Run the app:
   ```bash
   npm run dev
   ```

## Deploy to GitHub Pages

This project includes GitHub Actions workflow for automatic deployment to GitHub Pages.

1. Create a new repository on GitHub
2. Push your code to the repository
3. In your repository settings, go to "Pages" section
4. Under "Build and deployment", select "GitHub Actions" as the source
5. The workflow will automatically deploy your app to GitHub Pages on every push to the main branch

To manually trigger a deployment, go to the "Actions" tab in your repository and run the "Deploy to GitHub Pages" workflow.

Note: For the AI features to work on GitHub Pages, you'll need to set the `GEMINI_API_KEY` secret in your repository settings.
