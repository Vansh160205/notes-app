# Use official OpenJDK 22 image
FROM eclipse-temurin:22-jdk-alpine

# Set working directory inside the container
WORKDIR /app

# Copy Maven files first for caching
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Copy source code
COPY src ./src

# Make Maven wrapper executable
RUN chmod +x ./mvnw

# Build the Spring Boot app
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

# Expose port your app will run on
EXPOSE 8080

# Start Spring Boot
CMD ["java", "-jar", "target/notes-0.0.1-SNAPSHOT.jar"]
