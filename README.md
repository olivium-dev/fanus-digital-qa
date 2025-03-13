# Fanus Digital QA Dashboard

A project showcase and timeline management application for Fanus Digital, used for quality assurance (QA) and project management purposes.

## Features

- **Project Showcase**: Display project cards with information about various software projects
- **Timeline Management**: Track project timelines, progress, and payment status
- **API Backend**: Serverless functions for data management

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Netlify Functions (Node.js)
- Deployment: Netlify

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser to `http://localhost:8888`

## API Endpoints

- `GET /api/get-projects` - Retrieve all projects
- `GET /api/get-timeline` - Retrieve timeline data
- `POST /api/update-timeline` - Update timeline data

## Deployment

This project is configured for deployment on Netlify. The `netlify.toml` file contains the necessary configuration.

To deploy:

1. Push your changes to GitHub
2. Connect your repository to Netlify
3. Configure the build settings as specified in `netlify.toml`

## Project Structure

- `index.html` - Main project showcase page
- `update-timeline.html` - Timeline management page
- `data.js` - Project data (used as fallback)
- `timelineData.js` - Timeline data (used as fallback)
- `script.js` - Main JavaScript for project showcase
- `update-timeline.js` - JavaScript for timeline management
- `netlify/functions/` - Serverless functions for the backend API