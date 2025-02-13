import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import treasure from "../assets/treasure-chest.svg";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function Treasure() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const res = await fetch(`${backendUrl}/auth/verify-token`, {
          method: "GET",
          credentials: "include", // Ensures the browser sends the HttpOnly cookie
        })
    
          res.status === 200 ? setIsAuthenticated(true) : setIsAuthenticated(false);
          const result = await res.json();
          console.log("Tresure Response:", result);

      } catch (e) {
        console.error("Treasure fetch failed:", e);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () =>{
    try {
      const res = await fetch(`${backendUrl}/auth/logout`, {
        method: "GET",
        credentials: "include", // Ensures the browser sends the HttpOnly cookie
      });

        const result = await res.json();

        navigate("/"); // Redirect to treasure page on success
      console.log("Response:", result);
    } catch (e) {
      console.error("Treasure fetch failed:", e);
    }
  }
  return (
    <div className="flex h-screen">
      {/* Sidebar/Navbar */}
      <div className="w-1/4 bg-gray-800 text-white flex justify-center items-center">
        <Navbar />
      </div>

      {/* Centered Login Form */}
      <div className="flex flex-1 justify-center items-center flex-col">
        <p className="text-xl font-bold">You are logged in</p>
        <img src={treasure} alt="treasure" height={200} width={200} />
        <p className="text-xl font-bold">JWT status: { isAuthenticated ? "Active (expires in 1 min)" : "Inactive" }</p>
        <Button onClick={handleLogout}>Logout</Button>
       
        
      </div>
    </div>
  );
}

export default Treasure;
