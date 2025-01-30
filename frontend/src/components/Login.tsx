import React from "react";
import LoginForm from "./login-form";
import Navbar from "./Navbar";


function Login() {
    return (
      <div className="flex h-screen">
        {/* Sidebar/Navbar */}
        <div className="w-1/4 bg-gray-800 text-white flex justify-center items-center">
          <Navbar />
        </div>
  
        {/* Centered Login Form */}
        <div className="flex flex-1 justify-center items-center">
          <LoginForm />
        </div>
      </div>
    );
  }

export default Login;
