import axios from 'axios';

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    withCredentials: true, 
});

axiosInstance.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized access - Redirecting to login page");
            
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
