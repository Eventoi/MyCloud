import axios from 'axios';

// Функция для получения значения cookie по имени
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true
});

API.interceptors.request.use(config => {
  const method = config.method ? config.method.toLowerCase() : '';
  if (!['get', 'head', 'options'].includes(method)) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    // Если отправляется FormData — Content-Type не задаём!
    if (
      config.data instanceof FormData &&
      config.headers['Content-Type']
    ) {
      delete config.headers['Content-Type'];
    }
  }
  return config;
});

export default API;