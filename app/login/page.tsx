"use client";

import React from "react";
import Image from "next/image";

import LoginForm from "../components/LandingPage/LoginForm";

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
      <LoginForm></LoginForm>
    </div>
  );
};

export default LoginPage;
