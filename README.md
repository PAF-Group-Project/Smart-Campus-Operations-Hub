# Smart Campus Operations Hub---

Welcome to the Smart Campus Operations Hub repository! This project features a robust **Spring Boot REST API backend** and a scalable **React + Vite frontend** to power campus facility and asset management.

## Project Structure

The project encompasses two primary directories:

### Backend
A Spring Boot 3 application using:
- **Spring Data MongoDB** for robust document storage (Connection string configured for MongoDB Atlas).
- **Bean Validation** to ensure model constraints explicitly via `jakarta.validation` annotations.
- Standard **Model -> Repository -> Service -> Controller** layered architecture.
- Core endpoints located at `/api/v1/resources` supporting CRUD workflows with granular filtering.

#### Setup Instructions (Backend)
1. Ensure Java 17 and Maven are installed locally.
2. Navigate to the `backend/` directory.
3. Your database connection defaults to the configured MongoDB URI placeholder in `backend/src/main/resources/application.yml`. 
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   > The server will start on default port `8080`.

### Frontend
A Vite + React application styled elegantly with:
- **TailwindCSS** for responsive and highly customized utility designs.
- Built-in layouts (`DashboardLayout`, `Sidebar`) and shared UI components (`Badge`, `Modal`, `Button`, `EmptyState`, `LoadingSpinner`).
- Componentized architecture that is highly reactive and cleanly maps out Data API's onto local states utilizing `Axios` in `src/services`.

#### Setup Instructions (Frontend)
1. Ensure Node.js 18+ is installed globally.
2. Navigate to the `frontend/` directory.
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the interactive development server:
   ```bash
   npm run dev
   ```
   > The local development server will start on `http://localhost:5173/`. 
   > Port settings in the backend `@CrossOrigin` config support both `3000` and `5173`.


## Repository Layout

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

## Member 1 Module Scope (Facilities & Assets Catalogue)

- Maintain a catalogue of bookable resources: lecture halls, labs, meeting rooms, and equipment (projectors, cameras, etc.).
- Track key metadata for each resource, including type, capacity, location, availability windows, and status (e.g., `ACTIVE`, `OUT_OF_SERVICE`).
- Support search and filtering by resource attributes such as type, capacity, and location.

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
