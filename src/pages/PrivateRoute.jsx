import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

function PrivateRoute({ children }) {
    const location = useLocation();
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Make a request to check if the user is authenticated
                const response = await axios.get("http://localhost:3000/check", {
                    withCredentials: true,
                });
                setAuthenticated(true); // User is authenticated
            } catch (error) {
                setAuthenticated(false); // User is not authenticated
            }
        };

        checkAuth();
    }, []);

    if (authenticated === null) {
        return <div>Loading...</div>; // Or a spinner
    }

    if (!authenticated) {
        // Redirect to login page if the user is not authenticated
        return <Navigate to="/" state={{ from: location }} />;
    }

    return children;
}

export default PrivateRoute;
