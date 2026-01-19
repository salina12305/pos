import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Api = axios.create({
    baseURL: baseURL,
    withCredentials:false,
    headers:{
        "Content-Type": "application/json",
    },
});

const config = {
    headers:{
        'authorization' : `Bearer ${localStorage.getItem("token_postify")}`
    }
}
// Helper to get fresh headers for every request
const getAuthHeader = () => ({
    headers: {
        'authorization': `Bearer ${localStorage.getItem("token_postify")}`
    }
});

const getAuthConfig = () => ({
    headers: {
        'authorization': `Bearer ${localStorage.getItem("token_postify")}`
    }
});

// --- USER & ADMIN APIS ---
export const createUserApi = (data) => Api.post("/api/user/register", data);
export const loginUserApi = (data) => Api.post("api/user/login", data);
export const getUserById = (id) => Api.get(`/api/user/getUserByid/${id}`, getAuthHeader());