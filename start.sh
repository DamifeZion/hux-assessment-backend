#!/usr/bin/env bash

# We use this script because bcrypt fails to work on render unless this script is used

# Install new dependencies if any
npm install

# Uninstall the current bcrypt modules
npm uninstall bcrypt

# Install the bcrypt modules for the current environment
npm install bcrypt

# Build the TypeScript code
npm run build

echo "Starting API server"

# Start the server
npm start
