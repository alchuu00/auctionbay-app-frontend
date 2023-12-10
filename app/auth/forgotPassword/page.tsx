'use client'

import React, { useState } from "react";
import Link from "next/link";
import AuthHero from "../components/AuthHero";
import { AuthLayout } from "../AuthLayout";
import Logo from "@/app/components/Logo";
import * as API from '@/src/api/api';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState(''); // manage the state of the email input field

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // call your API function to send the password reset email
      await API.sendPasswordResetEmail(email);
      toast.info('Password reset email sent');
    } catch (error) {
      toast.error('Failed to send password reset email');
    }
  };

  return (
    <AuthLayout>
      <AuthHero />
      <div className="flex flex-col lg:justify-between justify-around items-center h-screen py-10 bg-white lg:w-1/3 w-full">
        <Logo />
        <div className="text-center">
          <h1 className="font-bold text-4xl mb-2">Forgot password?</h1>
          <p className="font-light">
            No worries, we will send you reset instructions
          </p>
        </div>
        <div className="w-4/5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-40">
            <label htmlFor="email" className=" font-light">
              E-mail:
            </label>
            <input
              id="email"
              type="text"
              placeholder="Placeholder"
              className="border w-full font-light py-2 px-4 rounded-2xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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