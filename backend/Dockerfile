# Use official Maven image to build
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build the project
RUN mvn clean package -DskipTests

# Use lightweight Java runtime
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy built jar from previous stage
COPY --from=build /app/target/*.jar app.jar

# Run application
CMD ["java", "-jar", "app.jar"]