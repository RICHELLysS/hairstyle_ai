# AI Hairstyle Advisor

A privacy-focused web application that provides personalized hairstyle recommendations using Chrome's built-in AI capabilities. This application analyzes facial features to suggest suitable hairstyles without uploading any data to external servers.

## Features

- **Face Shape Analysis**: Utilizes Chrome's LanguageModel API to detect face shapes from uploaded photos
- **AI-generated Recommendations**: Generates personalized hairstyle advice based on facial analysis
- **Multi-language**: Built-in translation system supporting 7 languages
- **Intuitive 3-step process**: photo capture → analysis → recommendations

## Technical Term

- **UI**: React with Tailwind CSS
- **AI Tool**: Chrome Built-in AI (Prompt AI and Translator API)
- **Storage**: Local browser storage for user preferences and history
- **Image Processing**: Client-side compression and validation

## Requirements

- Chrome 138+ browser
- Chrome AI features enabled via chrome://flags
- (Optional) Camera access for photo capture

## Usage

1. **Capture Photo**: Upload or take a front-facing photo
2. **Face Analysis**: AI analyzes facial features to determine face shape
3. **Browse Styles**: Explore recommended hairstyles based on your face shape
4. **Get Advice**: Receive personalized styling recommendations with maintenance tips

## Privacy & Security

All image processing and AI analysis occur completely within your browser. No personal data, photos, or analysis results are transmitted to external servers. The application works entirely offline once loaded.

Built for the Google Chrome Built-in AI Challenge 2025.
