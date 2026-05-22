# syntax=docker/dockerfile:1.7
#
# Multi-stage build for the Spring Boot backend.
#
#   Stage 1 (builder): Eclipse Temurin JDK 17 + Gradle wrapper. Builds the
#                      bootable jar. Heavy (~700 MB), discarded after build.
#   Stage 2 (runtime): Eclipse Temurin JRE 17 alpine, copy in the jar only.
#                      Final image ~180 MB. No build tools, no source.
#
# Why a multi-stage build:
#   - Smaller runtime image → faster pulls on every deploy.
#   - No JDK / Gradle on the production image → smaller attack surface.
#   - Build dependencies are cached separately from app code so a code-only
#     change reuses the dependency layer.

# ---------- Stage 1: build ----------
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /workspace

# Copy gradle wrapper + build scripts first. This lets Docker cache the
# dependency download layer — as long as build.gradle and settings.gradle
# don't change, dependencies aren't re-downloaded on subsequent builds.
COPY gradlew settings.gradle build.gradle ./
COPY gradle ./gradle
RUN chmod +x ./gradlew

# Resolve and download dependencies. The --no-daemon flag matters in CI: a
# Gradle daemon outlives the build step and can leak memory inside the layer.
RUN ./gradlew --no-daemon dependencies > /dev/null 2>&1 || true

# Now copy the source — changes here invalidate from here down.
COPY src ./src

# bootJar produces a single executable jar. -x test skips tests; we run those
# in CI separately, not on every container build (would slow deploys to a crawl).
RUN ./gradlew --no-daemon bootJar -x test

# ---------- Stage 2: runtime ----------
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Non-root user. Spring Boot doesn't need root and most managed cloud platforms
# (Cloud Run, Render, Fly) refuse to run containers as UID 0.
RUN groupadd --system spring && useradd --system --gid spring --shell /bin/false spring

# Copy the fat jar built in the previous stage. Renamed to `app.jar` so the
# ENTRYPOINT below stays stable even when the project version bumps.
COPY --from=builder /workspace/build/libs/*.jar app.jar
RUN chown spring:spring app.jar
USER spring

# Spring Boot listens on 8080 by default. Cloud platforms typically set $PORT;
# we read it via SERVER_PORT (Spring's standard env var) when present.
EXPOSE 8080

# JVM flags worth knowing:
#   -XX:+UseContainerSupport      Auto-detect container cgroup limits (default
#                                 since JDK 10 but explicit for clarity).
#   -XX:MaxRAMPercentage=75.0     Cap heap at 75% of container RAM, leaving
#                                 room for metaspace + native code + threads.
#                                 Without this the JVM happily OOMs on a
#                                 512 MB Render free dyno.
ENTRYPOINT ["sh", "-c", "exec java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -jar app.jar"]