# Step 1: Use an official OpenJDK image
FROM eclipse-temurin:22-jdk-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy Maven files first (for caching)
COPY pom.xml .

# Step 4: Copy the source code
COPY src ./src

# Step 5: Build the Spring Boot app
# If you have a local Maven install, use: mvn clean package
# If you want wrapper fallback, try ./mvnw
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

# Step 6: Expose the port your app runs on
EXPOSE 8080

# Step 7: Run the jar
CMD ["java", "-jar", "target/notes-0.0.1-SNAPSHOT.jar"]
