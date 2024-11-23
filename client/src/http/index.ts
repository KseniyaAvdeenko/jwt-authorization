import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";

export const BASE_URL = 'http://localhost:5000/api'

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: BASE_URL,

})

axiosInstance.interceptors.request.use((config) => {
    if (config.headers) config.headers.Authorization = `Bearer ${localStorage.access}`
    return config;
})

axiosInstance.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalRequest = error.config;
    try {
        originalRequest._isRetry = true
        if (error.response.status === 401 && error.config && !originalRequest._isRetry) {
            const response = await axios.get<AuthResponse>(BASE_URL + '/refresh', {withCredentials: true})
            console.log(response)
            localStorage.setItem('access', response.data.accessToken)
            axiosInstance.request(originalRequest)
        }
    } catch (e) {
        console.log(e)
    }
    throw error
})

export default axiosInstance;