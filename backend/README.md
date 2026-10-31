# Doctor Appointment System — Backend

Spring Boot 3.2 / Java 17 / Spring Security / JWT / Spring Data JPA / MySQL.

## Required environment variables

Configure these in Render (or your hosting provider):

| Variable | Purpose |
| --- | --- |
| `PORT` | Supplied automatically by Render |
| `DB_URL` | Full JDBC URL, such as `jdbc:mysql://HOST:3306/DATABASE?sslMode=REQUIRED&serverTimezone=UTC` |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Random signing secret of at least 32 bytes |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed frontend origins; include your exact Vercel URL |

The Filess.io hostname shown in the recorded Render failure no longer resolves. Create or choose a reachable MySQL database and copy its current JDBC connection details into Render. The application source intentionally contains no database credentials.

## Render configuration

- Root directory / Docker build context: repository root
- Runtime: Docker
- Dockerfile path: `backend/Dockerfile`
- Health check path: `/health`
- Set all variables listed above in the service environment.

## Local run

From `backend/`, run `./mvnw spring-boot:run` (Windows: `mvnw.cmd spring-boot:run`) after defining the environment variables. The API listens on port 8080 by default.
