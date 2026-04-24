# Smart Campus Operations Hub

Professional foundation for a university group project, built with Spring Boot and React.

## Project Structure

```text
/backend          - Spring Boot 3.2+ (Java 17)
  /src/main/java/com/groupxx/smartcampus
    /config       - Shared configurations (Security, Mongo, OAuth2)
    /common       - Standard API responses & constants
    /exception    - Global exception handling
    /security     - Auth logic starters
    /resource     - Facility & Asset Module (Member 1)
    /booking      - Booking Module (Member 2)
    /ticket       - Incident/Maintenance Module (Member 3)
    /notification - Notification & Auth Module (Member 4)

/frontend         - React (Vite) + Tailwind CSS
  /src
    /api          - Shared Axios instance
    /components   - Shared UI & Layout components
    /features     - Module-specific features (Auth, Bookings, etc.)
    /pages        - View-level components
    /routes       - Application routing
```

## Getting Started

### Backend
1. Ensure Java 17+ and Maven are installed.
2. Update `backend/src/main/resources/application.yml` with your MongoDB URI and Google OAuth credentials.
3. Run: `mvn spring-boot:run`

### Frontend
1. Navigate to `/frontend`.
2. Run: `npm install`
3. Run: `npm run dev`

## Team Collaboration Rules
- **Modules**: Each member must work exclusively within their assigned package/folder.
- **Shared Code**: Changes to `common`, `config`, or `components/ui` should be discussed before pushing.
- **Naming**: Use camelCase for methods/variables and PascalCase for Classes/Components.
- **CI/CD**: Ensure every PR passes the GitHub Actions build before merging.
