#!/bin/bash

# Цвета для вывода
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${BLUE}=== Останавливаем локальные порты... ===${NC}"
# Находим процессы по портам и убиваем их
for port in 9000 8080 8091 8092 8093 3000; do
  pid=$(lsof -t -i :$port)
  if [ -n "$pid" ]; then
    echo "Завершаем процесс на порту $port (PID $pid)..."
    kill -9 $pid 2>/dev/null || true
  fi
done

echo -e "${BLUE}=== Останавливаем Docker-контейнеры... ===${NC}"
docker-compose down

echo -e "${GREEN}Все сервисы и контейнеры остановлены.${NC}"
