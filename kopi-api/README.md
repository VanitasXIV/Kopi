# Kopi API

Backend API for Kopi chatbot using Azure OpenAI.

## Features

- Express.js REST API
- Azure OpenAI integration with GPT-4o-mini
- Conversation history management
- CORS enabled for Chrome extension
- Session-based conversations

## Setup

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`:
- Azure OpenAI endpoint
- API key
- Model deployment (gpt-4o-mini)
- Server port (5173)

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5173`

## API Endpoints

### POST `/api/chat`
Send a message to Kopi and get a response.

**Request:**
```json
{
  "message": "Hello, Kopi!",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "response": "Hello! How can I help you today?",
  "sessionId": "optional-session-id",
  "model": "gpt-4o-mini"
}
```

### POST `/api/chat/clear`
Clear conversation history for a session.

**Request:**
```json
{
  "sessionId": "optional-session-id"
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "Kopi API"
}
```

## Available Models

The following Azure OpenAI models are available:
- gpt-4.1-mini
- gpt-4o-mini (currently configured)
- gpt-5-mini
- gpt-5-nano
- text-embedding-ada-002

To change the model, update `AZURE_OPENAI_DEPLOYMENT` in `.env`.

## Chrome Extension Integration

The Chrome extension is already configured to connect to this API at `http://localhost:5173/api/chat`.

Make sure this server is running before using the extension.
