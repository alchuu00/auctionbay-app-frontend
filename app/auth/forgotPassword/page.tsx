import React from "react";
import Image from "next/image";
import Link from "next/link";
import AuthHero from "../components/AuthHero";
import { AuthLayout } from "../AuthLayout";
import Logo from "../../components/Topbar/Logo";

const ForgotPassword = () => {
  return (
    <AuthLayout>
      <AuthHero />
      <div className="flex flex-col justify-between items-center h-screen py-10 bg-white w-1/3">
        <Logo />
        <div className="text-center">
          <h1 className="font-bold text-4xl mb-2">Forgot password?</h1>
          <p className="font-light">
            No worries, we will send you reset instructions
          </p>
        </div>
        <div className="w-4/5">
          <form action="" className="flex flex-col gap-2 mb-40">
            <label htmlFor="email" className=" font-light">
              E-mail:
            </label>
            <input
              id="email"
              type="text"
              placeholder="Placeholder"
              className="border w-full font-light py-2 px-4 rounded-2xl"
            />
            {/* TODO: submit form and send password reset email */}
            <button
              type="submit"
              value="Submit"
              className="bg-fluoro-yellow font-medium px-4 py-2 rounded-2xl">
              Submit
            </button>
            <Link
              href="/auth/login"
              className="font-light mt-3 text-center text-xs">
              <span className="mr-2">&lt;</span>Back to login
            </Link>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
