 🗳️ VotingApp

**VotingApp** is a full-stack online voting system built with **Spring Boot**, **MySQL**, and **React + Vite**. It leverages Domain-Driven Design (DDD) principles for clean architecture and JWT authentication for security.

## 📚 Features

- Voter registration & login (JWT)
- Cast a voteModel for candidateModels
- Real-time result tallying
- Admin panel for managing candidateModels
- Route protection for authenticated users

**Use your preferred IDE**


The only requirement is having Node.js & npm installed.

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.


# Step 2: Navigate to the project directory.
cd `vote-app`

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```


## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

# Voting Platform API Documentation

## Overview

This document outlines the API endpoints and data structures required for the voting platform backend. The backend should be implemented using SpringBoot with MySQL as the database.



## API Endpoints

### Authentication

#### POST /api/auth/login

Authenticates a user and returns a JWT token.

- Request Body:

```json
{
  "email": "string",
  "password": "string"
}
```

- Response (200 OK):

```json
{
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "isAdmin": "boolean",
    "createdAt": "string"
  },
  "token": "string"
}
```

#### POST /api/auth/register

Creates a new user account.

- Request Body:

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

- Response: Same as login endpoint

#### POST /api/auth/logout

Invalidates the current user's token.

- Request: Requires Authorization header
- Response (200 OK):

```json
{
  "success": true
}
```

#### GET /api/auth/me

Returns the current user's information.

- Request: Requires Authorization header
- Response (200 OK): User object

### Candidates

#### GET /api/candidates

Returns all candidates.

- Response (200 OK):

```json
[
  {
    "id": "number",
    "name": "string",
    "party": "string",
    "position": "string",
    "imageUrl": "string",
    "voteCount": "number",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

#### GET /api/candidates/:id

Returns a specific candidate.

- Response (200 OK): Single candidate object

#### POST /api/admin/candidates

Creates a new candidate (Admin only).

- Request Body:

```json
{
  "name": "string",
  "party": "string",
  "position": "string",
  "imageUrl": "string"
}
```

- Response (201 Created): Created candidate object

#### PUT /api/admin/candidates/:id

Updates a candidate (Admin only).

- Request Body: Partial candidate object
- Response (200 OK): Updated candidate object

#### DELETE /api/admin/candidates/:id

Deletes a candidate (Admin only).

- Response (204 No Content)

### Votes

#### POST /api/votes

Casts a vote for a candidate.

- Request Body:

```json
{
  "candidateId": "number"
}
```

- Response (201 Created):

```json
{
  "id": "number",
  "userId": "number",
  "candidateId": "number",
  "createdAt": "string"
}
```

#### GET /api/votes/results

Returns election results.

- Response (200 OK): Array of candidates with vote counts

#### GET /api/votes/check

Checks if the current user has voted.

- Response (200 OK):

```json
{
  "hasVoted": "boolean"
}
```

#### GET /api/votes/user

Returns the current user's vote.

- Response (200 OK):

```json
{
  "candidateId": "number"
}
```

## Implementation Requirements

### Security

1. Authentication

   - Use JWT for authentication
   - Implement token refresh mechanism
   - Store passwords using bcrypt or argon2
   - Implement role-based authorization

2. API Security
   - Implement rate limiting
   - Add CORS configuration
   - Input validation
   - SQL injection prevention
   - XSS prevention

### Required Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^7.0.0",
    "joi": "^17.10.1",
    "winston": "^3.10.0"
  }
}
```

### Environment Variables

```env
DATABASE_URL=mysql://user:password@localhost:3306/voting_app
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
PORT=8080
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Error Handling

All endpoints should return appropriate HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Unprocessable Entity
- 500: Internal Server Error

Error responses should follow this format:

```json
{
  "error": {
    "message": "string",
    "code": "string",
    "details": {}
  }
}
```

## Testing

Implement tests for:

1. Authentication flows
2. CRUD operations for candidates
3. Voting mechanism
4. Authorization checks
5. Input validation
6. Error handling

## Additional Considerations

1. Implement proper logging
2. Add request validation middleware
3. Use TypeScript for type safety
4. Add API documentation using Swagger/OpenAPI
5. Implement database migrations
6. Add monitoring and health check endpoints


## APPENDIX

![Dashboard Interface](images/Vote1.png)