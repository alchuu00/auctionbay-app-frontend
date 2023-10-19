import React from "react";
import Image from "next/image";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="flex justify-between items-center h-screen">
      <div className="flex justify-center items-center w-2/3">
        <Image
          src="/registerImg.png"
          alt="Hero Image"
          width={500}
          height={500}
        />
      </div>
      <div className="flex flex-col justify-between items-center h-screen py-10 bg-white w-1/3">
        <div>
        <Link href="/"><Image src="/logo.png" alt="Logo" width={50} height={50} className="rounded-full"></Image></Link>
        </div>
        <div className="text-center">
          <h1 className="font-bold text-3xl">Welcome back!</h1>
          <p className="text-sm font-light">Please enter your details</p>
        </div>
        <div className="w-4/5">
          <form action="" className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-light">E-mail:</label>
            <input id="email" type="text" placeholder="Placeholder" className="border w-full max-w-xs text-sm font-light py-2 px-4 rounded-2xl" />
            <label htmlFor="password" className="text-sm font-light">Password:</label>
            <input id="password" type="text" placeholder="Placeholder" className="border w-full max-w-xs text-sm font-light py-2 px-4 rounded-2xl" />
            <Link href="/" className="font-light text-xs text-right">Forgot password?</Link>
            <button type="submit" value="Submit" className="bg-fluoro-yellow text-sm font-medium px-4 py-2 rounded-2xl">Login</button>
          </form>
        </div>
        <div className="text-sm font-light">Don`t have an account? <Link href="/register" className="text-sm font-bold">Sign Up</Link></div>
      </div>
    </div>
  );
};

export default LoginPage;
