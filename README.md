# Smart Campus Operations Hub

Smart Campus Operations Hub is a full-stack campus operations system with a **Spring Boot REST API backend** and a **React + Vite frontend**. It supports campus resources, bookings, maintenance tickets, notifications, authentication, and role-based access.

## Tech Stack

- Backend: Spring Boot 3, Java 17, Spring Security, Spring Data MongoDB
- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Database: MongoDB Atlas
- Auth: Email/password and Google OAuth

## Project Structure

```text
backend/     Spring Boot backend API
frontend/    React + Vite frontend
```

## Prerequisites

Install these before running the project:

- Java 17 or newer
- Node.js 18 or newer
- npm
- Internet connection for MongoDB Atlas and dependency downloads

Maven does not need to be installed globally because the backend includes Maven wrapper files.

## Backend Setup

Open a terminal from the project root:

```powershell
cd backend
```

Run the backend:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend starts at:

```text
http://localhost:8080
```

API base path:

```text
http://localhost:8080/api/v1
```

To compile without running tests:

```powershell
.\mvnw.cmd -q -DskipTests compile
```

## Frontend Setup

Open a second terminal from the project root:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Run the frontend:

```powershell
npm run dev
```

The frontend starts at:

```text
http://localhost:5173
```

Build the frontend:

```powershell
npm run build
```

## Running the Full Project

Use two terminals:

Terminal 1:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Terminal 2:

```powershell
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Environment Notes

Backend configuration is in:

```text
backend/src/main/resources/application.yml
```

Important backend settings:

- Server port: `8080`
- MongoDB URI: configured under `spring.data.mongodb.uri`
- Google OAuth variables:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

If needed, set Google OAuth credentials as environment variables instead of hardcoding them.

## Default Routes

Frontend:

```text
/login
/dashboard
/resources
/notifications
/settings/notifications
/users
```

Role-specific ticket routes:

```text
/student/tickets
/admin/tickets
/technician/tickets
```

## Common Issues

### npm ENOENT in backend

The backend is a Spring Boot/Maven app, not a normal Node backend. Use:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Use npm only inside the `frontend` folder.

### Frontend cannot call backend

Make sure the backend is running on:

```text
http://localhost:8080
```

The Vite dev server proxies `/api` requests to the backend.

### Port already in use

Run the frontend on another port:

```powershell
npm run dev -- --port 5188
```

## Main Modules

- Dashboard overview
- Resource browsing and management
- Booking workflows
- Maintenance and incident tickets
- Notifications and notification preferences
- User management with role-based access

## Build Check

Before submission or demo:

```powershell
cd backend
.\mvnw.cmd -q -DskipTests compile
```

```powershell
cd frontend
npm run build
```
