import React from "react";
import Navbar from "./Navbar";
import treasure from "../assets/treasure-chest.svg"

function Treasure() {
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
      </div>
    </div>
  );
}

export default Treasure;
