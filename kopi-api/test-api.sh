#!/bin/bash

echo "Testing Kopi API..."
echo ""

# Test health endpoint
echo "1. Health Check:"
curl -s http://localhost:5173/health | python3 -m json.tool
echo ""
echo ""

# Test chat endpoint
echo "2. Chat Test:"
curl -s -X POST http://localhost:5173/api/chat \
  -H 'Content-Type: application/json' \
  --data-raw '{"message":"Hi Kopi! Introduce yourself in one sentence."}' | python3 -m json.tool
echo ""
