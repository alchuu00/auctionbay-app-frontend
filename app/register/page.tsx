import RegisterForm from "../components/RegisterForm";
import React from "react";
import Image from "next/image";

const RegisterPage = () => {
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

      <RegisterForm></RegisterForm>
    </div>
  );
};

export default RegisterPage;
