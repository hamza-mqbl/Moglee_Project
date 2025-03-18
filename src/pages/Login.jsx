import React, { useEffect } from "react";
import { LoginComponent } from "../components/Login/Login.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const nevigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (isAuthenticated === true) {
      nevigate("/");
    }
  }, []);
  return (
    <div className="w-full h-screen bg-gray-50">
      <LoginComponent />
    </div>
  );
};

export default Login;
