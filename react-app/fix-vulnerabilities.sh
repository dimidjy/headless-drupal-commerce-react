#!/bin/bash

# Script to fix npm vulnerabilities without breaking changes

echo "Fixing npm vulnerabilities..."

# Install specific versions of vulnerable packages
npm install --save nth-check@^2.0.1 postcss@^8.4.31

# Update packages with vulnerabilities
npx npm-force-resolutions

# Reinstall packages to apply resolutions
npm install

echo "Security fixes applied. Running npm audit to verify..."
npm audit

echo "Done! If any vulnerabilities remain, they may require manual intervention." 