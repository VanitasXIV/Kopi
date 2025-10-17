# Chatbot Widget Chrome Extension

A Chrome extension that embeds a floating chatbot icon on any webpage, allowing users to interact with a chatbot without modifying the target website.

## Features

- Floating chat button that appears on all web pages
- Beautiful, responsive chatbot interface
- Smooth animations and modern UI
- Works on any website without requiring permissions
- Easy to customize and integrate with your own chatbot API

## Installation

1. **Generate Icons** (if not already generated)
   ```bash
   cd chrome-extension
   npm install
   node generate-png-icons.js
   ```

2. **Load the Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `chrome-extension` folder
   - The extension should now be active

3. **Test the Extension**
   - Visit any website
   - You should see a purple floating chat button in the bottom-right corner
   - Click it to open the chatbot interface

## File Structure

```
chrome-extension/
├── manifest.json          # Extension configuration
├── content.js            # Script injected into web pages
├── styles.css            # Styling for the floating button and container
├── chatbot.html          # Chatbot interface HTML
├── chatbot.js            # Chatbot functionality
├── generate-png-icons.js # Script to generate extension icons
├── icon-16.png          # Extension icon (16x16)
├── icon-48.png          # Extension icon (48x48)
├── icon-128.png         # Extension icon (128x128)
├── package.json         # Node.js dependencies
└── README.md            # This file
```

## Customization

### Configure Your Chatbot API

The extension is pre-configured to connect to `http://localhost:5173/api/chat`. To customize the API settings, edit `config.js`:

```javascript
const CHATBOT_CONFIG = {
  // Your API endpoint
  apiUrl: 'http://localhost:5173/api/chat',

  // Customize the request format
  formatRequest: (message) => ({
    message: message,
    // Add any other fields your API expects
  }),

  // Customize how to parse the response
  parseResponse: (data) => {
    // Adjust based on your API's response structure
    return data.response || data.message || data.reply;
  },

  // Custom headers if needed
  headers: {
    'Content-Type': 'application/json',
    // Add authentication headers here if needed
    // 'Authorization': 'Bearer YOUR_TOKEN',
  }
};
```

**Important:** After changing the API URL, update `host_permissions` in `manifest.json` to match your server's host.

### Change Colors

Edit the gradient colors in `styles.css` and `chatbot.html`:
- Main gradient: `#667eea` to `#764ba2`
- Update both files for consistency

### Modify Button Position

In `styles.css`, change the `bottom` and `right` values:
```css
#chatbot-widget-button {
  bottom: 24px;  /* Distance from bottom */
  right: 24px;   /* Distance from right */
}
```

## How It Works

1. **Content Script**: `content.js` runs on every webpage and injects the floating button
2. **Iframe Isolation**: The chatbot interface loads in an iframe for complete isolation from the host page
3. **No Page Modification**: The extension doesn't require any changes to the target website
4. **Universal Compatibility**: Works on all websites through Chrome's content script injection

## Troubleshooting

**Extension doesn't appear:**
- Make sure you've loaded the extension in `chrome://extensions/`
- Check that Developer mode is enabled
- Verify all files are in the correct folder

**Icons missing:**
- Generate icons using `create-icons.html`
- Ensure icon files are named exactly as specified
- Icons must be in the same folder as `manifest.json`

**Chatbot doesn't work on some sites:**
- Some sites with strict CSP (Content Security Policy) may block iframes
- Check the browser console for errors

## License

MIT License - feel free to modify and use for your projects!
