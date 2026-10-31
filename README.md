# Doctor Appointment System (DAS)

A full-stack appointment portal for patients and doctors.

## Stack

- **Frontend:** React 18, React Router, Axios
- **Backend:** Java 17, Spring Boot 3, Spring Security, JWT, Spring Data JPA
- **Database:** MySQL

## Local development

### Backend

1. Install Java 17 and Maven (or use the included Maven wrapper).
2. Create a MySQL database.
3. Set these variables in the backend process environment:

```env
PORT=8080
DB_URL=jdbc:mysql://localhost:3306/doctor_appointment?serverTimezone=UTC
DB_USERNAME=your_local_mysql_user
DB_PASSWORD=your_local_mysql_password
JWT_SECRET=generate-a-random-secret-at-least-32-bytes-long
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

4. From `backend/`, run `./mvnw spring-boot:run` (Windows: `mvnw.cmd spring-boot:run`).

The API listens on `http://localhost:8080`; `GET /health` returns `ok`.

### Frontend

1. Install Node.js 18+.
2. From `frontend/frontend-ui/`, run `npm install`.
3. Create a local `.env` file:

```env
REACT_APP_API_URL=http://localhost:8080
```

4. Run `npm start`; the frontend opens on `http://localhost:3000`.

## Production deployment

### Backend on Render

- Create a **Docker** web service.
- Set the repository root as the Docker build context.
- Set Dockerfile path to `backend/Dockerfile`.
- Set the health check path to `/health`.
- Add these service environment variables:

| Variable | Value |
| --- | --- |
| `DB_URL` | JDBC URL of a reachable MySQL database |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | Random signing secret, at least 32 bytes |
| `CORS_ALLOWED_ORIGINS` | Exact deployed frontend origin, e.g. `https://your-project.vercel.app` |

Render supplies `PORT` automatically. Do not commit database URLs, passwords, or JWT secrets.

**Database note:** the prior deployment log showed a DNS failure for the old Filess.io MySQL hostname. Replace it with the current connection details of an active/reachable MySQL provider. The application cannot recover a database hostname that no longer resolves.

### Frontend on Vercel

- Set the project root directory to `frontend/frontend-ui`.
- Framework preset: Create React App.
- Build command: `npm run build`.
- Output directory: `build`.
- Add `REACT_APP_API_URL` with the HTTPS URL of the Render backend (no trailing slash).

The Vercel rewrite in `frontend/frontend-ui/vercel.json` supports React Router deep links.

## Security and data notes

- Registration and login are public; appointment and report endpoints require a valid JWT.
- Appointment creation derives the patient owner from the authenticated user, not the browser payload.
- Patient and doctor appointment lists are restricted to their own records.
- PDF reports are restricted to the patient and assigned doctor of the appointment.
- Old booking rows created before the patient-owner column was introduced have no reliable patient ID. They are not automatically assigned to accounts; reconcile those records manually if they need to appear in patient history.
