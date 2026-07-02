// Хелперы для кодирования Base64Url
function arrayBufferToBase64Url(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Генерация случайного code_verifier (длина 43-128 символов)
export function generateCodeVerifier() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return arrayBufferToBase64Url(array.buffer);
}

// Генерация code_challenge (SHA-256 хэш в base64url)
export async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return arrayBufferToBase64Url(digest);
}

// Инициализация OIDC сессии и редирект на Auth-сервер
export async function initSessionAndRedirect() {
  const verifier = generateCodeVerifier();
  localStorage.setItem('codeVerifier', verifier);
  
  const challenge = await generateCodeChallenge(verifier);
  
  // Редирект на Auth Service (порт 9000)
  const authUrl = `http://localhost:9000/oauth2/authorize?` + new URLSearchParams({
    response_type: 'code',
    client_id: 'client',
    scope: 'openid profile',
    redirect_uri: 'http://localhost:3000/authorized',
    code_challenge: challenge,
    code_challenge_method: 'S256'
  }).toString();
  
  window.location.replace(authUrl);
}

// Получение accessToken из localStorage
export function getAccessToken() {
  return localStorage.getItem('access_token');
}

// Сохранение токенов
export function persistTokens(tokens) {
  if (tokens.access_token) {
    localStorage.setItem('access_token', tokens.access_token);
  }
  if (tokens.id_token) {
    localStorage.setItem('id_token', tokens.id_token);
  }
}

// Очистка сессии
export function clearSession() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('codeVerifier');
}

// Обмен авторизационного кода на токен
export async function exchangeCodeForToken(code) {
  const verifier = localStorage.getItem('codeVerifier');
  if (!verifier) {
    throw new Error('Отсутствует codeVerifier в localStorage');
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: 'client',
    code: code,
    redirect_uri: 'http://localhost:3000/authorized',
    code_verifier: verifier
  });

  const response = await fetch('/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ошибка получения токена: ${response.status} - ${errText}`);
  }

  const tokens = await response.json();
  persistTokens(tokens);
  return tokens;
}

// Авторизованный fetch к API Gateway с автоматической подстановкой префикса /bff
export async function apiFetch(path, options = {}) {
  const token = getAccessToken();
  if (!token) {
    initSessionAndRedirect();
    throw new Error('Нет токена авторизации. Перенаправление...');
  }

  // Подставляем префикс /bff, если его нет
  const cleanPath = path.startsWith('/api') ? path.replace(/^\/api/, '/bff') : path;
  const url = cleanPath.startsWith('/bff') ? cleanPath : `/bff${cleanPath}`;

  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  // Если тело запроса - объект, кодируем его в JSON и добавляем Content-Type
  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof URLSearchParams)) {
    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body
  });

  if (response.status === 401) {
    clearSession();
    initSessionAndRedirect();
    throw new Error('Сессия устарела. Перенаправление на страницу входа...');
  }

  return response;
}

// Декодирование ролей из JWT токена
export function getRolesFromToken() {
  const token = getAccessToken();
  if (!token) return [];
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    return payload.roles || [];
  } catch (e) {
    console.error('Ошибка декодирования JWT токена:', e);
    return [];
  }
}

