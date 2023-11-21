import React from "react";
import Link from "next/link";
import Logo from "../Topbar/Logo";

const Navbar = () => {
  return (
    <div className="w-screen flex justify-between items-center text-md py-5 px-8">
      <div>
        <Logo />
      </div>
      <div className="flex gap-2 items-center">
        <Link href="/login" className="font-bold">
          Log In
        </Link>
        <p className="font-light">or</p>
        <Link
          href="/register"
          className="bg-gray-800 text-white py-2 px-4 rounded-2xl">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
