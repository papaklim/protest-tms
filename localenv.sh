#!/bin/bash

echo "Stopping all existing containers..."
docker stop $(docker ps -a -q) 2>/dev/null || true

echo "Starting ProTEST infrastructure (PostgreSQL, Kafka, MinIO)..."
docker-compose up -d protest-db protest-kafka protest-minio

echo "Waiting for PostgreSQL to be ready..."
until docker exec protest-db pg_isready -U postgres -d postgres > /dev/null 2>&1; do
  sleep 1
done

echo "Waiting for MinIO S3 to be ready..."
until curl -s http://localhost:19000/minio/health/live > /dev/null; do
  sleep 1
done

echo "Infrastructure is up and running!"
echo "PostgreSQL is available on port 15432"
echo "Kafka is available on port 19092"
echo "MinIO Console is available on http://localhost:19001 (User: minioadmin, Pass: minioadmin)"
