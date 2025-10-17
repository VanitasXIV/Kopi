// Create and inject the chatbot button
(function() {
  'use strict';

  // Check if button already exists
  if (document.getElementById('chatbot-widget-button')) {
    return;
  }

  // Create floating button
  const button = document.createElement('div');
  button.id = 'chatbot-widget-button';
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    <span>Kopi</span>
  `;
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'Open Kopi chatbot');

  // Create chatbot container
  const container = document.createElement('div');
  container.id = 'chatbot-widget-container';
  container.style.display = 'none';

  // Create close button
  const closeButton = document.createElement('div');
  closeButton.id = 'chatbot-widget-close';
  closeButton.innerHTML = '&times;';
  closeButton.setAttribute('role', 'button');
  closeButton.setAttribute('aria-label', 'Close chatbot');

  // Create iframe for chatbot
  const iframe = document.createElement('iframe');
  iframe.id = 'chatbot-widget-iframe';
  iframe.src = chrome.runtime.getURL('chatbot.html');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowtransparency', 'true');

  // Assemble the widget
  container.appendChild(closeButton);
  container.appendChild(iframe);
  document.body.appendChild(button);
  document.body.appendChild(container);

  // Toggle chatbot visibility
  button.addEventListener('click', () => {
    if (container.style.display === 'none') {
      container.style.display = 'flex';
      button.style.display = 'none';

      // Focus the input in the iframe after a short delay
      setTimeout(() => {
        iframe.contentWindow.postMessage({ type: 'FOCUS_INPUT' }, '*');
      }, 100);
    }
  });

  closeButton.addEventListener('click', () => {
    container.style.display = 'none';
    button.style.display = 'flex';
  });

  // Allow closing with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && container.style.display !== 'none') {
      container.style.display = 'none';
      button.style.display = 'flex';
    }
  });
})();
