import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PrivateRoute from "./pages/PrivateRoute";
import Register from "./pages/Register";
import Adminlogin from "./pages/Adminlogin.jsx";
import AdminPrivateRoute from "./pages/AdminPrivateRoute"; 
import ProductDisplay from "./pages/ProductDisplay.jsx";
import CartPage from "./pages/CartPage.jsx";
import AdminDashboard from "./pages/AdminDashboard"; // Example admin page
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminAddProduct  from "./pages/AdminAddProduct.jsx"



const App = () => {
    return (
        <Router>
           
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin-login" element={<Adminlogin/>}/>
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/product/:id"
                    element={
                        <PrivateRoute>
                            <ProductDisplay/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <PrivateRoute>
                            <CartPage/>
                        </PrivateRoute>
                    }
                />
        <Route
          path="/admin-dashboard"
          element={
            <AdminPrivateRoute>
              <AdminDashboard />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <AdminPrivateRoute>
              <AdminEditProduct/>
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminPrivateRoute>
              <AdminAddProduct/>
            </AdminPrivateRoute>
          }
        />
        
            </Routes>
        </Router>
    );
};

export default App;
