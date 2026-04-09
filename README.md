# ⚖️ LegalizeAI - AI Legal Document Simplifier

**LegalizeAI** is a powerful web application designed to demystify complex legal documents. Using Google's Gemini AI, it translates dense legalese into plain English, highlights hidden risks, and provides a real-world impact analysis—all in seconds.

![LegalizeAI Preview](https://picsum.photos/seed/legal/1200/600)

## 🚀 Features

- **Multi-format Support:** Paste text, upload PDFs/DOCX, or even scan images of physical documents.
- **AI Risk Scoring:** Get an instant risk level (Low, Medium, High) and a 0-100 risk score.
- **Jargon Translation:** Automatically identifies complex legal terms and explains them in simple language.
- **Voice Assistant:** A compact, interactive voice assistant that can summarize the report and answer follow-up questions.
- **History Tracking:** Keep track of your recently analyzed documents.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS 4
- **Animations:** Motion (formerly Framer Motion)
- **AI Engine:** Google Gemini AI (@google/genai)
- **Icons:** Lucide React

## 🌐 Deployment (Netlify)

This project is optimized for **Netlify** with "zero-man" configuration.

1. **Push to GitHub:** Upload this project to a GitHub repository.
2. **Connect to Netlify:** Create a new site from Git on Netlify.
3. **Automatic Config:** Netlify will automatically use the included `netlify.toml` for build settings.
4. **Environment Variables:** 
   - Go to **Site Settings > Environment Variables**.
   - Add `GEMINI_API_KEY` with your Google AI API key.
5. **Done!** Your app will be live with full SPA routing support.

## 🔑 Environment Variables

To run this project locally or in production, you need:

- `GEMINI_API_KEY`: Your Google Gemini API Key.

## 📜 License

This project is licensed under the Apache-2.0 License.
