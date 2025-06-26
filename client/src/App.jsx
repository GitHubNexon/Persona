// src/App.jsx
import React, { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./components/NotFound";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Monitoring from "./pages/Monitoring";
import Activities from "./pages/Activities";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";

function App() {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <>
      <PrivateRoute
        element={
          // <Router basename="/HRIS/">
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
              <Route
                path="/monitoring"
                element={
                  <ProtectedRoute requiredRole="mr">
                    <Layout>
                      <Monitoring />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activities"
                element={
                  <ProtectedRoute requiredRole="ac">
                    <Layout>
                      <Activities />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute requiredRole="rp">
                    <Layout>
                      <Reports />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute requiredRole="an">
                    <Layout>
                      <Analytics />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute requiredRole="nt">
                    <Layout>
                      <Notifications />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="ad">
                    <Layout>
                      <Admin />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              {/* Redirect to home for undefined routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        }
      />
      {/* ToastContainer for displaying toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
