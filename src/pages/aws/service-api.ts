import axios from "axios";

export const api_client = axios.create({
    baseURL: import.meta.env.VITE_api,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
})
