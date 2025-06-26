import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Home from "../pages/Home";
import NotFound from "../components/NotFound";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const { user } = useAuth();

  return user ? (
    element
  ) : (
    // <Router basename="/HRIS/">
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default PrivateRoute;
