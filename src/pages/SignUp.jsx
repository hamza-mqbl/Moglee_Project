import React, { useEffect } from "react";
import Signupcomponent from "../components/Signup/Signup.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SignUp = () => {
  const nevigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (isAuthenticated === true) {
      nevigate("/");
    }
  }, []);
  return (
    <div>
      <Signupcomponent />
    </div>
  );
};

export default SignUp;
