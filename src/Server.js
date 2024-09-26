import axios from 'axios';

const server = axios.create({
  // baseURL: 'http://127.0.0.1:8000/',
  baseURL: 'https://159.89.166.72/',
});

// const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://127.0.0.1:8000/';
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://159.89.166.72:8000/';

const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

server.interceptors.request.use(
  (req) => {
    const token = getCookie('token');
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      req.headers['X-CSRFToken'] = csrfToken;
    }
    console.log('Request Headers:', req.headers); 
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

server.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Token invalid or expired. Waiting for 10 seconds before clearing local storage and cookies.');

      // Wait for 10 seconds (10,000 milliseconds)
      await new Promise((resolve) => setTimeout(resolve, 10000));

      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      localStorage.clear();
      window.location.href = '/'; 
    } else if (error.response && error.response.status === 403) {
      console.warn('CSRF token missing or invalid. Please refresh the page.');
    } else if (!error.response) {
      console.error('No response received from the server. Waiting for 10 seconds before redirecting to home page.');

      // Wait for 10 seconds (10,000 milliseconds)
      await new Promise((resolve) => setTimeout(resolve, 10000));

      localStorage.clear();
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      window.location.href = '/'; 
    }

    return Promise.reject(error);
  }
);


export { server, WEBSOCKET_URL };
