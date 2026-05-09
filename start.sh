#!/bin/bash
set -e

echo "==> Starting application from my-app directory..."
cd my-app
exec npm run start
