#!/bin/bash
set -e

echo "==> Current directory:"
pwd

echo "==> Node version:"
node --version

echo "==> NPM version:"
npm --version

echo "==> Checking for package-lock.json..."
ls -la package-lock.json

echo "==> Running npm ci..."
npm ci --legacy-peer-deps

echo "==> Running build:production..."
npm run build:production

echo "==> Build complete!"
