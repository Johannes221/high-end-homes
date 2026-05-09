#!/bin/bash
set -e

echo "==> Starting application..."
echo "==> Current directory:"
pwd
exec npm run start
