import axios from "axios";

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

export const createConvention = async (data: Record<string, unknown>) => {
  const response = await api.post("/conventions", data);
  return response.data;
};

export const getConventions = async () => {
  const response = await api.get("/conventions");
  return response.data;
};

export const getConvention = async (id: number) => {
  const response = await api.get(`/conventions/${id}`);
  return response.data;
};

export const updateConvention = async (id: number, data: Record<string, unknown>) => {
  const response = await api.put(`/conventions/${id}`, data);
  return response.data;
};

export const deleteConvention = async (id: number) => {
  const response = await api.delete(`/conventions/${id}`);
  return response.data;
};

export const getSecteurs = async () => {
  const response = await api.get("/secteurs");
  return response.data;
};

export const getDomaines = async () => {
  const response = await api.get("/domaines");
  return response.data;
};

export const getProgrammes = async () => {
  const response = await api.get("/programmes");
  return response.data;
};

export const getProvinces = async () => {
  const response = await api.get("/provinces");
  return response.data;
};

export const getTypesConvention = async () => {
  const response = await api.get("/type-conventions");
  return response.data;
};

export const getPorteursProjet = async () => {
  const response = await api.get("/porteur-projets");
  return response.data;
};

export const getPartenaires = async () => {
  const response = await api.get("/partenaires");
  return response.data;
};

export const uploadPieceJointe = async (
  conventionId: number,
  file: File
) => {
  const formData = new FormData();

  formData.append("convention_id", conventionId.toString());

  formData.append("fichier", file);

  const response = await api.post(
    "/piece-jointes",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

