import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const getStoredAuth = () => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!storedToken) {
    return { user: null, token: null };
  }

  try {
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken,
    };
  } catch {
    localStorage.removeItem("user");
    return { user: null, token: storedToken };
  }
};

function AuthProvider({ children }) {
  const [{ user, token }, setAuth] = useState(getStoredAuth);

  useEffect(() => {
    if (!token) {
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setAuth({ user: data.user, token });
          localStorage.setItem("user", JSON.stringify(data.user));
          return;
        }

        if (response.status === 401 || response.status === 403) {
          setAuth({ user: null, token: null });
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch {
        // Keep the stored session when the API is temporarily unavailable.
      }
    };

    validateToken();
  }, [token]);

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.error || "Login failed" };
    }

    const data = await response.json();
    setAuth({ user: data.user, token: data.token });
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    return { success: true, user: data.user };
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react-refresh/only-export-components -- Context + Provider + hook kept in one file deliberately; only affects dev hot-reload speed, not correctness.
export { AuthProvider, useAuth };
