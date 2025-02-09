import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

function AdminPrivateRoute({ children }) {
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        // Call the admin-check endpoint
        await axios.get("http://localhost:3000/admin-check", {
          withCredentials: true,
        });
        setAuthenticated(true);
      } catch (error) {
        setAuthenticated(false);
      }
    };

    checkAdminAuth();
  }, []);

  if (authenticated === null) {
    return <div>Loading...</div>; // Optionally, show a spinner or loading indicator
  }

  if (!authenticated) {
    // Redirect to the admin login page if not authenticated as admin
    return <Navigate to="/admin-login" state={{ from: location }} />;
  }

  return children;
}

export default AdminPrivateRoute;
