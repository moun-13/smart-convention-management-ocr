import axios from "axios";

export type UserRole = "admin" | "editor" | "decideur";

export interface UserPayload {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
}

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};

export const getUser = async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const createUser = async (data: UserPayload) => {
    const response = await api.post("/users", data);
    return response.data;
};

export const updateUser = async (id: number, data: UserPayload) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};
