const fs = require('fs');

// Create SVG icon
function createSVG(size) {
  const radius = size * 0.2;
  const bubbleSize = size * 0.6;
  const x = size * 0.2;
  const y = size * 0.15;
  const bubbleRadius = size * 0.08;
  const strokeWidth = size * 0.06;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Rounded rectangle background -->
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="url(#grad)"/>

  <!-- Chat bubble -->
  <path d="M ${x + bubbleRadius} ${y}
           L ${x + bubbleSize - bubbleRadius} ${y}
           Q ${x + bubbleSize} ${y} ${x + bubbleSize} ${y + bubbleRadius}
           L ${x + bubbleSize} ${y + bubbleSize * 0.6 - bubbleRadius}
           Q ${x + bubbleSize} ${y + bubbleSize * 0.6} ${x + bubbleSize - bubbleRadius} ${y + bubbleSize * 0.6}
           L ${x + bubbleSize * 0.3} ${y + bubbleSize * 0.6}
           L ${x + bubbleSize * 0.15} ${y + bubbleSize * 0.85}
           L ${x + bubbleSize * 0.25} ${y + bubbleSize * 0.6}
           L ${x + bubbleRadius} ${y + bubbleSize * 0.6}
           Q ${x} ${y + bubbleSize * 0.6} ${x} ${y + bubbleSize * 0.6 - bubbleRadius}
           L ${x} ${y + bubbleRadius}
           Q ${x} ${y} ${x + bubbleRadius} ${y}
           Z"
        fill="none" stroke="white" stroke-width="${strokeWidth}"
        stroke-linejoin="round" stroke-linecap="round"/>
</svg>`;
}

// Save SVG files
fs.writeFileSync('icon-16.svg', createSVG(16));
fs.writeFileSync('icon-48.svg', createSVG(48));
fs.writeFileSync('icon-128.svg', createSVG(128));

console.log('SVG icons created successfully!');
console.log('Now converting to PNG...');
