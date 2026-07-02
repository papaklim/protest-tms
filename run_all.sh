#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Запуск инфраструктуры (Docker) ===${NC}"
bash localenv.sh

echo -e "${BLUE}=== Сборка ресурсов бэкенда ===${NC}"
./gradlew processResources

echo -e "${BLUE}=== Запуск микросервисов в фоне... ===${NC}"
mkdir -p logs

echo "Запускается auth (порт 9000)..."
./gradlew :auth:bootRun > logs/auth.log 2>&1 &
echo "Запускается projects (порт 8091)..."
./gradlew :projects:bootRun > logs/projects.log 2>&1 &
echo "Запускается testcases (порт 8092)..."
./gradlew :testcases:bootRun > logs/testcases.log 2>&1 &
echo "Запускается runs (порт 8093)..."
./gradlew :runs:bootRun > logs/runs.log 2>&1 &

# Ждем немного перед запуском gateway, так как он зависит от других
sleep 3
echo "Запускается gateway (порт 8080)..."
./gradlew :gateway:bootRun > logs/gateway.log 2>&1 &

echo -e "${BLUE}=== Запуск фронтенда (Vite/React)... ===${NC}"
cd client
npm run dev > ../logs/client.log 2>&1 &
cd ..

echo -e "${GREEN}Все сервисы запущены в фоновом режиме!${NC}"
echo "Логи доступны в папке ./logs/"
echo "Для просмотра логов используйте: tail -f logs/<service>.log"
echo "Для остановки всех сервисов выполните: ./stop_all.sh"
