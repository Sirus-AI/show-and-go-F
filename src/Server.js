import axios from 'axios';

const server = axios.create({


    // baseURL: 'http://127.0.0.1:8000/',
    baseURL: 'http://16.171.144.129/',
});

server.interceptors.request.use((req) => {
    const cookies = document.cookie.split(';');
    let token = null;

    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'token') {
            token = value;
            break;
        }
    }
    
    if (token && !req.url.includes('/login') && !req.url.includes('/register')) {
        req.headers.authorization = `Bearer ${token}`;
    }
    return req;
});

export default server;
