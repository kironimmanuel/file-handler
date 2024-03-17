import axios from 'axios';

export const octetStreamHttpClient = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 1000,
    headers: { 'Content-Type': 'application/octet-stream' },
});

export const multipartHttpClient = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 1000,
    headers: { 'Content-Type': 'multipart/form-data' },
});
