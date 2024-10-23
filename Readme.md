# Hux Ventures Assessment - Backend

This is the backend solution for the Hux Ventures Fullstack Developer Assessment. It is a RESTful API built using Node.js (TypeScript) with MongoDB for the database, providing user authentication and contact management functionality.

## Features

-  User registration and login (JWT Authentication)
-  Create, retrieve, update, and delete contacts
-  Protected routes using JWT
-  Swagger API documentation
-  Unit tests (Jest)

## Technologies

-  Node.js
-  Express
-  TypeScript
-  MongoDB (Mongoose)
-  JWT Authentication
-  Jest (Unit Testing)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/DamifeZion/hux-assessment-backend.git
cd hux-assessment-backend
```

2. Install dependencies:

```bash
   npm install
```

3. Create a .env file in the root of your project and add the following environment variables:

```bash
   PORT=5000
   DB_CONN=your_mongo_connection_string
   SECRET_KEY=your_jwt_secret_key
   EMAIL_SERVICE=your_email_service_provider
   EMAIL_USER=your_email_user
   EMAIL_PASSWORD=your_email_password
   SERVER_BASE_URL=http://localhost:5000

```

4. Start the server:

```bash
npm start
```

The API will now be running at http://localhost:5000.

# Docker

To run the backend using Docker:

1. Build the Docker image:

```bash
   docker build -t hux-assessment-backend .
```

2. Run the Docker container:

```bash
   docker run -p 5000:5000 hux-assessment-backend
```

# API Endpoints

## User Routes

-  POST /api/v1/user/register: Register a new user
-  POST /api/v1/user/login: Login with email and password
-  POST /api/v1/user/forgot-password: Request a password reset
-  POST /api/v1/user/reset_password/:resetToken: Reset password

## Contact Routes

-  GET /api/v1/contact: Get all contacts
-  GET /api/v1/contact/:id: Get a single contact by ID
-  POST /api/v1/contact: Create a new contact
-  PUT /api/v1/contact/:id: Update a contact
-  DELETE /api/v1/contact/:id: Delete a contact

# Swagger Documentation

API documentation is available at

```bash
   http://localhost:5000/api-docs
```

# Testing

Unit tests are implemented using Jest.

## Run the tests:

```bash
   npm test
```
