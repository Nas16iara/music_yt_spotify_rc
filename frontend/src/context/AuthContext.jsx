/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // Check authentication status on app start
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // Include cookies
        });

        if (response.ok) {
          const userData = await response.json();
          setAuthUser(userData.user);
          setIsLoggedIn(true);
        } else {
          setAuthUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error.message);
        setAuthUser(null);
      }
      finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const authContextValue = {
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn,
    loading,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
