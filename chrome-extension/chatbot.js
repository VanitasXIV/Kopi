// Chatbot functionality
(function() {
  'use strict';

  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendButton = document.getElementById('sendButton');

  // Create typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'typing-indicator';
  typingIndicator.innerHTML = '<span></span><span></span><span></span>';

  function addMessage(text, isUser) {
    const message = document.createElement('div');
    message.className = `message ${isUser ? 'user' : 'bot'}`;

    if (isUser) {
      message.textContent = text;
    } else {
      // Format bot messages with proper line breaks and basic markdown
      message.innerHTML = formatBotMessage(text);
    }

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function formatBotMessage(text) {
    // Convert newlines to <br>
    let formatted = text.replace(/\n/g, '<br>');

    // Convert markdown-style bold **text** to <strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert markdown-style lists with proper indentation
    // Match lines starting with - or • followed by text
    formatted = formatted.replace(/^[\-•]\s+(.+)$/gm, '<div class="list-item">• $1</div>');

    // Convert numbered lists
    formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, '<div class="list-item">$1. $2</div>');

    // Add spacing after headers (lines followed by line breaks)
    formatted = formatted.replace(/(<br>){2,}/g, '<br><br>');

    return formatted;
  }

  function showTypingIndicator() {
    chatMessages.appendChild(typingIndicator);
    typingIndicator.classList.add('active');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTypingIndicator() {
    typingIndicator.classList.remove('active');
    if (typingIndicator.parentNode) {
      typingIndicator.parentNode.removeChild(typingIndicator);
    }
  }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    chatInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
      // Call the AI chatbot API using configuration
      const response = await fetch(CHATBOT_CONFIG.apiUrl, {
        method: 'POST',
        headers: CHATBOT_CONFIG.headers,
        body: JSON.stringify(CHATBOT_CONFIG.formatRequest(message))
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      hideTypingIndicator();

      // Parse the response using the config parser
      const botResponse = CHATBOT_CONFIG.parseResponse(data);

      if (!botResponse) {
        console.warn('Could not parse response:', data);
        addMessage('Sorry, I received an unexpected response format.', false);
      } else {
        addMessage(botResponse, false);
      }

    } catch (error) {
      hideTypingIndicator();
      console.error('Error calling chatbot API:', error);
      addMessage(CHATBOT_CONFIG.errorMessage, false);
    }
  }

  // Event listeners
  sendButton.addEventListener('click', sendMessage);

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Focus input on load
  chatInput.focus();

  // Listen for focus requests from parent window
  window.addEventListener('message', (event) => {
    if (event.data.type === 'FOCUS_INPUT') {
      chatInput.focus();
    }
  });
})();
