// Configuration for the chatbot API
const CHATBOT_CONFIG = {
  // API endpoint - connected to the backend server on port 3000
  apiUrl: 'http://localhost:3000/ask',

  // Request format - matches the /ask endpoint format
  formatRequest: (message) => ({
    question: message
  }),

  // Response parser - extracts the answer from the API response
  parseResponse: (data) => {
    // The API returns { answer: "response text" }
    return data.answer || data.response || data.message || data.reply || data.text;
  },

  // Error message
  errorMessage: 'Sorry, I\'m having trouble connecting to the AI service. Please make sure the server is running on port 3000.',

  // Optional: Headers to include in the request
  headers: {
    'Content-Type': 'application/json',
  }
};
