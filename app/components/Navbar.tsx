import React from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-screen flex justify-between items-center text-sm py-5 px-8">
      <div>
      <Link href="/"><Image src="/logo.png" alt="Logo" width={50} height={50} className="rounded-full"></Image></Link>
      </div>
      <div className="flex gap-2 items-center">
        <Link href="/login" className="font-bold">Log In</Link>
        <p className="font-light">or</p>
        <Link href="/register" className="bg-gray-800 text-white py-2 px-4 rounded-2xl">Sign Up</Link>
      </div>
    </div>
  );
};

export default Navbar;
