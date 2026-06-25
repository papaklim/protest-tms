import axios from 'axios';

// Базовый клиент
export const apiClient = axios.create({
  // Указываем порт WireMock для работы с заглушками
  // Когда бэкенд будет готов, поменяем порт на 8080 (API Gateway)
  baseURL: 'http://localhost:8089', 
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default apiClient;
