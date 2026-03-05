# Smart Task Manager API

## Auth Routes
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

## Task Routes
POST   /api/tasks
GET    /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
GET    /api/tasks/stats

## Features
- JWT Authentication
- Protected Routes
- Task Ownership Authorization
- Filtering & Search
- Pagination
- Dashboard Statistics