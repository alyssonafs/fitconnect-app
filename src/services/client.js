import axios from "axios";

export const HTTPClient = axios.create({
    baseURL: "https://localhost:7132",
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization",
        "Access-Control-Allow-Methods" : "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Content-Type": "application/json;charset-UTF-8",
    }
});

HTTPClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;        
    },
    (error) => Promise.reject(error)
);

export default HTTPClient;