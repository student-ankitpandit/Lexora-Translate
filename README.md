# Lexora Translate

Lexora Translate is a beautifully designed, simple, and powerful multilingual translation and pronunciation application. It breaks down language barriers by not only providing highly accurate translations across over 130 languages, but also helping you master how to speak them.

![Lexora UI](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/languages.svg)

## Features

- **Simple & Intuitive UI**: A sleek, modern glassmorphism design that features an elegant side-by-side translation grid, keeping everything you need on one screen without scrolling.
- **130+ Supported Languages**: Translate text instantly between dozens of global languages.
- **Native Pronunciation Audio**: Hear exactly how translations sound using our premium Text-to-Speech (TTS) proxy engine.
- **Slow-Playback Mode**: Trying to master a difficult accent? Click the "Snail" button to instantly slow down the audio playback while perfectly preserving the pitch of the voice.
- **Phonetic Romanization**: Translating into a non-Latin script (like Russian, Japanese, or Arabic)? Lexora automatically generates phonetic English spellings so you can read the characters aloud instantly.
- **Saved & History Tabs**: Your past 50 translations are automatically saved locally in your browser. Bookmark your favorite translations so you can easily reference and listen to them later.
- **Dark/Light Mode**: Instantly toggle between a beautiful dark mode and a crisp high-contrast light mode.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, CSS Modules (Custom Glassmorphism)
- **Backend / API**: Vercel Serverless Functions (`api/tts.ts`) & Bun Local Proxy Server
- **Audio Engine**: `google-tts-api`
- **Icons**: Lucide React

## Local Development Setup

To run Lexora Translate locally on your machine:

1. Clone the repository:
   ```bash
   git clone git@github.com:student-ankitpandit/Lexora-Translate.git
   cd Lexora-Translate
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Run the development environment:
   ```bash
   # In terminal 1: Start the Vite frontend
   bun dev
   
   # In terminal 2: Start the local TTS proxy server
   cd server
   bun install
   bun index.ts
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Deployment

This project is configured out-of-the-box for **Vercel**.
Simply import the project to your Vercel dashboard and deploy. Vercel will automatically build the React frontend and deploy the `api/tts.ts` script as a Serverless API Function—zero extra configuration required!
