import React from "react";
import arrow from "../assets/Arrow to down.svg";

function Navbar() {
  return (
    <nav className="p-2">
      <ul className="flex justify-center flex-col gap-2 ">
        <li>
          <div className="border-2 rounded-md text-center">
            <a href="/" className="p-4">
              Login
            </a>
          </div>
          <img src={arrow} alt="down arrow" />
        </li>
        <li>
          <div className="border-2 rounded-md text-center">
            <a href="/signup" className="p-4">
              Sign Up
            </a>
          </div>
          <img src={arrow} alt="down arrow" />
        </li>
        <li className="border-2 rounded-md text-center">
          <a href="/treasure" className="p-4">
            Treasure
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
