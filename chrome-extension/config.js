// Configuration for the chatbot API
const CHATBOT_CONFIG = {
  // API endpoint - update this to match your actual endpoint
  apiUrl: 'http://localhost:5173/api/chat',

  // Request format - customize based on your API requirements
  formatRequest: (message) => ({
    message: message,
    timestamp: new Date().toISOString()
  }),

  // Response parser - customize based on your API response format
  parseResponse: (data) => {
    // Try common response field names
    return data.response || data.message || data.reply || data.text || data.answer;
  },

  // Error message
  errorMessage: 'Sorry, I\'m having trouble connecting to the AI service. Please make sure the server is running.',

  // Optional: Headers to include in the request
  headers: {
    'Content-Type': 'application/json',
  }
};
