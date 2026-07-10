import api from "./api";

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const response = await api.post("/login", data);

  return response.data;
};

export const logout = async (token: string) => {
  return api.post(
    "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const me = async (token: string) => {
  return api.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};