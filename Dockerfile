# Use Node.js 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application to the container
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Make the start.sh file executable
RUN chmod +x start.sh

EXPOSE 8080

# Run the start.sh script
CMD ["./start.sh"]
