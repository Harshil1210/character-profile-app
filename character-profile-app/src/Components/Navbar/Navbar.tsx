import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className=" text-black p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 flex justify-between items-center w-full">
      <div className="text-xl md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold font-sans">
        <Link to="/" className="text-gradient-blue">
          Rick & Morty
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
