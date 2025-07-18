#!/bin/bash
echo "Resetting dependencies..."
rm -rf node_modules
rm -f pnpm-lock.yaml
rm -f package-lock.json
rm -f yarn.lock
pnpm install
echo "Dependencies reset complete!"
