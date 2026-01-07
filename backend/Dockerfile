FROM eclipse-temurin:17-jdk-alpine AS builder

# Install bash for gradle wrapper compatibility
RUN apk add --no-cache bash

WORKDIR /app

# Copy gradle files
COPY build.gradle settings.gradle ./
COPY gradle gradle
COPY gradlew ./

# Download dependencies (use bash explicitly for gradlew)
RUN chmod +x gradlew && bash ./gradlew dependencies --no-daemon

# Copy source and build
COPY src src
RUN bash ./gradlew bootJar --no-daemon

# Runtime image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy jar from builder
COPY --from=builder /app/build/libs/cafe24-crm-api.jar app.jar

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8089

ENTRYPOINT ["java", "-jar", "app.jar"]
