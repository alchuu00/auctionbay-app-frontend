import React from "react";
import Image from "next/image";
import Link from "next/link";

const ForgotPassword = () => {
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
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full"
            ></Image>
          </Link>
        </div>
        <div className="text-center">
          <h1 className="font-bold text-3xl mb-2">Forgot password?</h1>
          <p className="text-sm font-light">
            No worries, we will send you reset instructions
          </p>
        </div>
        <div className="w-4/5">
          <form action="" className="flex flex-col gap-2 mb-40">
            <label htmlFor="email" className="text-sm font-light">
              E-mail:
            </label>
            <input
              id="email"
              type="text"
              placeholder="Placeholder"
              className="border w-full text-sm font-light py-2 px-4 rounded-2xl"
            />
            {/* TODO: submit form and send password reset email */}
            <button
              type="submit"
              value="Submit"
              className="bg-fluoro-yellow text-sm font-medium px-4 py-2 rounded-2xl"
            >
              Submit
            </button>
            <Link href="/login" className="text-xs font-light mt-3 text-center">
              <span className="mr-2">&lt;</span>Back to login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
