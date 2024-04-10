import axios from 'axios';

const server = axios.create({

       baseURL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/',
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
    if (token) {
        req.headers.authorization = `Bearer ${token}`
    }
    return req
})


export default server
