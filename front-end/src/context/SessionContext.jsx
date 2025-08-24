import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api
        .get("/auth/session")
        .then((res) => {
          setUser(res.data?.user);
        })
        .catch((error) => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/";
    }, 200)
  };

  return (
    <SessionContext.Provider value={{ user, loading, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

/**
 * @returns user, loading, logout
 */
export function useSession() {
  return useContext(SessionContext);
}
