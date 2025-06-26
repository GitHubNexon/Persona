import React, { createContext, useState, useContext, useEffect } from "react";
import { useSplash } from "./SplashContext";
import { fetchUser, auth, logoff } from "../api/authApi";
import axios from "axios"; // Ensure this is imported
import { showToast } from "../utils/toastNotifications";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { setShowSplash } = useSplash();
  const [user, setUser] = useState(null);

  // Add this to your AuthContext useEffect
  useEffect(() => {
    // Check for OAuth redirect parameters
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");

    if (error) {
      if (error === "auth_failed") {
        showToast("Authentication failed. Please try again.", "error");
      } else if (error === "google_auth_failed") {
        showToast("Google authentication failed. Please try again.", "error");
      } else if (error === "server_error") {
        showToast("Server error occurred. Please try again later.", "error");
      }
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Existing fetchUser logic...
    (async () => {
      try {
        const userData = await fetchUser();
        if (userData) {
          setUser(userData);
        } else {
          setShowSplash(false);
        }
      } catch (error) {
        console.error(
          "Fetch user failed:",
          error.response ? error.response.data : error.message
        );
        setShowSplash(false);
      }
      setShowSplash(false);
    })();
  }, [setShowSplash]);

  useEffect(() => {
    // Fetch user info on initial load
    (async () => {
      try {
        const userData = await fetchUser();
        if (userData) {
          setUser(userData);
        } else {
          setShowSplash(false);
        }
      } catch (error) {
        console.error(
          "Fetch user failed:",
          error.response ? error.response.data : error.message
        );
        setShowSplash(false);
      }
      setShowSplash(false);
    })();
  }, [setShowSplash]);

  const login = async (email, password) => {
    try {
      const { token, userData } = await auth(email, password);
      if (token && userData) {
        // Token will be managed by cookies
        setUser(userData);
        showToast("Login successful!", "success");
      } else {
        throw new Error("Invalid token or user data");
      }
    } catch (error) {
      if (error.status === 403) {
        showToast("Account is locked. Try again later.", "error");
      } else {
        showToast(
          "Login failed. Please check your credentials and try again.",
          "warning"
        );
      }
    }
  };

  const logout = async () => {
    try {
      await logoff();
      setUser(null);
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
