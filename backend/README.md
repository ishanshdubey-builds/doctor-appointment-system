# Doctor Appointment System - Backend

## Project Description
The backend for the Doctor Appointment System (DAS) providing REST APIs for user authentication, appointment booking, patient records management, and doctor schedules.

## Tech Stack
- **Java 17**
- **Spring Boot 3.2.2**
- **Spring Security & JWT**
- **Spring Data JPA**
- **MySQL**

## How to Run Locally

1. Clone the repository and navigate to the `backend` directory.
2. Ensure you have Java 17+ installed.
3. Update `src/main/resources/application.properties` or set environment variables for your local MySQL instance.
4. Run the application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
5. The API will be available at `http://localhost:8080`.

## Environment Variables Needed

Create an environment or update the configuration with the following keys:
- `PORT` (Default: 8080)
- `DB_URL` (JDBC connection string)
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET` (For signing JWT tokens, ensure it is randomly generated and secure)

## Live URL
*(Add production URL here after deployment via Railway: e.g., https://das-backend.railway.app)*

## Screenshots
*(Provide relevant API structure or Swagger screenshots here)*
