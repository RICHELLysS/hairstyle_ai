# AI Hairstyle Advisor

A privacy-focused web application that provides personalized hairstyle recommendations using Chrome's built-in AI capabilities. This application analyzes facial features to suggest suitable hairstyles without uploading any data to external servers.

## Features

- **Face Shape Analysis**: Utilizes Chrome's LanguageModel API to detect face shapes from uploaded photos
- **AI-Powered Recommendations**: Generates personalized hairstyle advice based on facial analysis
- **Multi-language Support**: Built-in translation system supporting 7 languages
- **Privacy First**: All processing occurs locally on your device - no data leaves your browser
- **Responsive Design**: Optimized for desktop and mobile devices
- **Step-by-Step Workflow**: Intuitive 3-step process: photo capture → analysis → recommendations

## Technology Stack

- **Frontend**: React with Tailwind CSS
- **AI Integration**: Chrome Built-in AI (LanguageModel API)
- **Internationalization**: Custom translation system with Chrome Translator API
- **Storage**: Local browser storage for user preferences and history
- **Image Processing**: Client-side compression and validation

## Requirements

- Chrome 138+ browser
- Chrome AI features enabled (via chrome://flags)
- Camera access for photo capture (optional - file upload available)

## Usage

1. **Capture Photo**: Upload or take a clear front-facing photo
2. **Face Analysis**: AI analyzes facial features to determine face shape
3. **Browse Styles**: Explore recommended hairstyles based on your face shape
4. **Get Advice**: Receive personalized styling recommendations and maintenance tips

## Privacy & Security

All image processing and AI analysis occur completely within your browser. No personal data, photos, or analysis results are transmitted to external servers. The application works entirely offline once loaded.

Built for the Google Chrome Built-in AI Challenge 2025.