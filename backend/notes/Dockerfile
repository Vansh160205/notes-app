# Use official OpenJDK 22 image
FROM eclipse-temurin:22-jdk-alpine

# Set working directory inside the container
WORKDIR /app

# Copy Maven files first for caching
COPY pom.xml .

# Copy source code
COPY src ./src

# Build the Spring Boot app
# Use Maven wrapper if exists, else fallback to mvn
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

# Expose the port your app runs on
EXPOSE 8080

# Run the jar
CMD ["java", "-jar", "target/notes-0.0.1-SNAPSHOT.jar"]
