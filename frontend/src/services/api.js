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

const getMultipartConfig = () => ({
    headers: {
        'authorization': `Bearer ${localStorage.getItem("token_postify")}`,
        'Content-Type': 'multipart/form-data'
    }
});

// --- USER & ADMIN APIS ---
export const createUserApi = (data) => Api.post("/api/user/register", data);
export const loginUserApi = (data) => Api.post("api/user/login", data);
export const getUserById = (id) => Api.get(`/api/user/getUserByid/${id}`, getAuthHeader());

// --- POST APIS ---
export const createPostApi = (data) => Api.post("/api/posts/create", data, getMultipartConfig());
export const getPublishedPostsApi = () => Api.get("/api/posts/get_published", getAuthHeader());
export const getUserDraftsApi = (userId) => Api.get(`/api/posts/get_drafts/${userId}`, getAuthHeader());
export const deletePostApi = (id) => Api.delete(`/api/posts/delete/${id}`, getAuthHeader());
export const likePostApi = (id, userId) => 
    Api.put(`/api/posts/like/${id}`, { userId }, getAuthHeader());

export const addCommentApi = (id, data) => 
    Api.post(`/api/posts/comment/${id}`, data, getAuthHeader());