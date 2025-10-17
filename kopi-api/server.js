import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { searchKnowledge, loadKnowledgeBase } from './knowledge-base/loader.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5173;

// Middleware
app.use(cors());
app.use(express.json());

// Azure OpenAI configuration
const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, '');
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

// System prompt for Kopi
const KOPI_SYSTEM_PROMPT = `You are Kopi, Kopius's friendly intranet assistant.

Style: Professional, warm, and conversational. Use clear formatting with headers and bullets. When listing people or data, organize it well with sections, context, and totals. Be helpful and offer follow-up suggestions.`;

// Store conversation history per session (in production, use a proper session store)
const conversationHistory = new Map();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'Kopi API' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create conversation history for this session
    if (!conversationHistory.has(sessionId)) {
      conversationHistory.set(sessionId, [
        { role: 'system', content: KOPI_SYSTEM_PROMPT }
      ]);
    }

    const history = conversationHistory.get(sessionId);

    // Search for relevant knowledge
    const knowledgeContext = searchKnowledge(message);

    // Build user message with context if available
    let userMessage = message;
    if (knowledgeContext) {
      userMessage = `${knowledgeContext}\n\nUser Question: ${message}\n\nPlease answer based on the knowledge base information provided above.`;
    }

    // Add user message to history
    history.push({ role: 'user', content: userMessage });

    // Keep only last 10 messages to avoid token limits
    const recentHistory = [
      history[0], // Keep system prompt
      ...history.slice(-9) // Last 9 messages
    ];

    // Build Azure OpenAI API URL
    const url = `${azureEndpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    // Call Azure OpenAI API
    const response = await axios.post(
      url,
      {
        messages: recentHistory,
        max_completion_tokens: 800,
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    const assistantMessage = response.data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Add assistant response to history
    history.push({ role: 'assistant', content: assistantMessage });

    // Update conversation history
    conversationHistory.set(sessionId, history);

    // Return response
    res.json({
      response: assistantMessage,
      sessionId: sessionId,
      model: deployment
    });

  } catch (error) {
    console.error('Error calling Azure OpenAI:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to process chat request',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

// Clear conversation history endpoint
app.post('/api/chat/clear', (req, res) => {
  const { sessionId = 'default' } = req.body;
  conversationHistory.delete(sessionId);
  res.json({ message: 'Conversation history cleared', sessionId });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Kopi API server running on http://localhost:${port}`);
  console.log(`📡 Azure OpenAI Endpoint: ${azureEndpoint}`);
  console.log(`🤖 Model: ${deployment}`);
  console.log(`\n✅ Ready to chat!`);
});
