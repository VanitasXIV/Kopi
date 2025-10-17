const { createCanvas } = require('canvas');
const fs = require('fs');

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');

  // Draw rounded rectangle background
  const radius = size * 0.2;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();

  // Draw chat bubble
  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'white';
  ctx.lineWidth = size * 0.06;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const bubbleSize = size * 0.6;
  const x = size * 0.2;
  const y = size * 0.15;
  const bubbleRadius = size * 0.08;

  // Main bubble
  ctx.beginPath();
  ctx.moveTo(x + bubbleRadius, y);
  ctx.lineTo(x + bubbleSize - bubbleRadius, y);
  ctx.quadraticCurveTo(x + bubbleSize, y, x + bubbleSize, y + bubbleRadius);
  ctx.lineTo(x + bubbleSize, y + bubbleSize * 0.6 - bubbleRadius);
  ctx.quadraticCurveTo(x + bubbleSize, y + bubbleSize * 0.6, x + bubbleSize - bubbleRadius, y + bubbleSize * 0.6);
  ctx.lineTo(x + bubbleSize * 0.3, y + bubbleSize * 0.6);
  ctx.lineTo(x + bubbleSize * 0.15, y + bubbleSize * 0.85);
  ctx.lineTo(x + bubbleSize * 0.25, y + bubbleSize * 0.6);
  ctx.lineTo(x + bubbleRadius, y + bubbleSize * 0.6);
  ctx.quadraticCurveTo(x, y + bubbleSize * 0.6, x, y + bubbleSize * 0.6 - bubbleRadius);
  ctx.lineTo(x, y + bubbleRadius);
  ctx.quadraticCurveTo(x, y, x + bubbleRadius, y);
  ctx.closePath();
  ctx.stroke();

  return canvas;
}

// Generate icons
const sizes = [16, 48, 128];
sizes.forEach(size => {
  const canvas = drawIcon(size);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`icon-${size}.png`, buffer);
  console.log(`Created icon-${size}.png`);
});

console.log('All PNG icons created successfully!');
