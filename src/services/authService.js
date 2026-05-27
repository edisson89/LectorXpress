// src/services/authService.js

// Asegúrate de que esta URL coincida con tu backend (puerto 8000)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const loginUser = async (email, password) => {
  try {
    // 1. Enviamos los datos al backend
    // Nota: FastAPI espera "username" y "password" en un Form data (x-www-form-urlencoded)
    // por eso usamos URLSearchParams en lugar de JSON simple.
    const formData = new URLSearchParams();
    formData.append('username', email); // FastAPI usa 'username' aunque sea email
    formData.append('password', password);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Error al iniciar sesión");
    }

    // 2. Si todo sale bien, guardamos el token
    if (data.access_token) {
      // Guardamos en localStorage para usarlo luego
      localStorage.setItem("token", data.access_token);
      return true;
    }
    
    return false;

  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
// Añade esto a tu archivo authService.js
export const registerUser = async (email, password) => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Error al registrar usuario");
    }

    return data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};