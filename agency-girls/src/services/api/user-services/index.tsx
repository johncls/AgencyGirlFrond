import { apiUrl } from "../../../config";
import type { User, UserCreate } from "../../../interfaces/typeUser";
import axios from "axios";

// Interceptor para agregar el token automáticamente a cada petición
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const userGetAllServices = async (page: number = 1, limit: number = 10) => {
    
   const { data} = await axios.get(`${apiUrl}/api/User/get-all?page=${page}&pageSize=${limit}`);
   return data;
}

export const userCreateServices = async (userCreate: UserCreate) => {
    const { data } = await axios.post(`${apiUrl}/api/User/create`, userCreate);
    return data;
}

export const userUpdateServices = async (user: Partial<User>) => {
    const { data } = await axios.put(`${apiUrl}/api/User/update`, user);
    return data;
}

export const userDeleteServices = async (identification: string) => {
    const { data} = await axios.delete(`${apiUrl}/api/User/delete?identification=${identification}`);
    return data;
}

export const userResetCountServices = async () => {
    const { data} = await axios.post(`${apiUrl}/api/User/resetCounter`);
    return data;
}