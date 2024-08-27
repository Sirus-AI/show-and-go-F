import axios from 'axios';

const server = axios.create({
     baseURL: 'http://127.0.0.1:8000/',
   // baseURL: 'http://139.59.48.40:80',
});

//const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://139.59.48.40:8000/';
 const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://127.0.01:8000/';

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

server.interceptors.request.use((req) => {
    const token = getCookie('token');   
    if (token) {
        req.headers.authorization = `Bearer ${token}`;
    }
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
        req.headers['X-CSRFToken'] = csrfToken;
    }
    console.log('Request Headers:', req.headers); // Debugging log
    return req;
}, (error) => {
    return Promise.reject(error);
});

server.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Handle token expiration or invalid token
            console.warn('Token invalid or expired. Clearing local storage and cookies.');
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            localStorage.removeItem('token');
            localStorage.removeItem('csrfToken');
            window.location.href = '/'; // Redirect to login page or handle as needed
        }
        return Promise.reject(error);
    }
);

export { server, WEBSOCKET_URL };
