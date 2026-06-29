# Use maven to compile the java application.
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build-env
WORKDIR /app
COPY pom.xml ./
# Download dependencies
RUN mvn dependency:go-offline
# Copy source code and build
COPY src ./src
RUN mvn package -DskipTests

# Build runtime image
FROM eclipse-temurin:17-jre
WORKDIR /app
# Copy the compiled jar from the build environment
COPY --from=build-env /app/target/*.jar app.jar
# Expose the default port
EXPOSE 8080
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
