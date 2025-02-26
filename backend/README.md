# AudioScribe Transcription App

A web application that transcribes audio files and recordings using OpenAI's Whisper model running directly in the browser.

## Features

- **Client-side Transcription**: Uses WebAssembly to run Whisper ML model directly in the browser without sending audio to external servers
- **Multiple Input Methods**: Upload audio files or record directly in the browser
- **User Authentication**: Secure login via Google OAuth
- **History & Storage**: Save transcriptions and audio to your account for future reference
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Frontend
- React.js
- Web Workers for non-blocking transcription processing
- WebAssembly for running ML models
- AudioContext API for audio processing

### Backend
- Node.js with Express
- MongoDB for user accounts and transcription storage
- JWT for authentication
- Serverless deployment architecture

## How It Works

1. **Authentication**: Users sign in with their Google account
2. **Audio Input**: Upload an audio file or record directly in the browser
3. **Processing**: The Whisper model runs in a web worker thread to transcribe the audio without blocking the UI
4. **Results**: View, edit, and save the transcription results to your account
5. **History**: Access your past transcriptions anytime

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or cloud)
- Google OAuth credentials

### Setup

1. Clone the repository:
```bash
git clone https://github.com/surendrakumar6350/audio-scribe.git
cd audio-scribe
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Deployment

This application is designed to be deployed as a serverless application:

1. Frontend can be deployed to services like Vercel, Netlify, or AWS S3
2. Backend is configured for serverless deployment to AWS Lambda or similar services

## Privacy & Security

- Audio processing happens entirely in the browser - your audio never leaves your device during transcription
- User data is stored securely and only accessible to the authenticated user
- No third-party analytics or tracking

## Limitations

- The Whisper model (tiny.en version) requires downloading ~40MB of data on first use
- Transcription accuracy depends on audio quality and may not be perfect for all accents or background noise conditions
- Maximum file size for upload is limited to 10MB