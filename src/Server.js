import axios from 'axios';

const server = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    // baseURL: 'http://13.60.94.148/',
});

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

export default server;
