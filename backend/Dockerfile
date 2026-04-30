FROM maven:3.9.6-eclipse-temurin-17

WORKDIR /app

# Copy ONLY backend folder
COPY backend /app

WORKDIR /app

RUN mvn clean package -DskipTests

CMD ["java", "-jar", "target/das-pro-rest-jpa-0.0.1-SNAPSHOT.jar"] 