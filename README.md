# AI Task Manager

A full-stack task management application with AI-powered assistance built using Java Spring Boot, React, and Node.js.

## Tech Stack

### Backend
- Java 17 / Spring Boot 4
- Spring Security + JWT Authentication
- Spring Data JPA + Hibernate
- PostgreSQL

### Frontend
- React 18
- React Router
- Axios

### Middleware
- Node.js / Express
- http-proxy-middleware

### AI Integration
- Google Gemini API
- Features: task summarization, breakdown, and prioritization

## Architecture
```
React (3000) → Node/Express Middleware (4000) → Spring Boot (8080) → PostgreSQL
```

## Features
- JWT Authentication with BCrypt password hashing
- Project management with full CRUD
- Kanban board with TODO, IN_PROGRESS, DONE columns
- AI assistant to summarize, prioritize and breakdown tasks
- Protected routes on both frontend and backend

## AI Tools Used During Development
- Claude for architecture planning, debugging, and code review
- Used for JWT implementation guidance and CORS troubleshooting

## Running Locally

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL

### Backend
```bash
./mvnw spring-boot:run
```

### Middleware
```bash
cd middleware
node index.js
```

### Frontend
```bash
cd frontend
npm start
```

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Projects
- GET /api/projects/user/{userId}
- POST /api/projects
- DELETE /api/projects/{id}

### Tasks
- GET /api/tasks/project/{projectId}
- POST /api/tasks
- PUT /api/tasks/{id}
- DELETE /api/tasks/{id}

### AI
- POST /api/ai/assist

