#!/usr/bin/env bash

# Check if the environment is production
if [ "$NODE_ENV" = "production" ]; then
    echo "Running in production mode"

    # Install new dependencies if any
    npm install

    # Uninstall the current bcrypt modules
    npm uninstall bcrypt

    # Install the bcrypt modules for the current environment
    npm install bcrypt

    # Build the TypeScript code
    npm run build
else
    echo "Not running in production mode, skipping npm install, build and bcrypt operations"
fi

echo "Starting API server"

# Start the server
npm start
