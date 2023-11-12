"use client";

import EyeIcon from "@heroicons/react/outline/EyeIcon";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import Link from "next/link";
import { StatusCode } from "../constants/errorConstants";
import authStore from "../stores/authStore";
import * as API from "../api/api";
import Image from "next/image";
import { useLoginForm, LoginUserFields } from "../hooks/useLogin";
import "react-toastify/dist/ReactToastify.css";
import ToastWarning from "./ToastWarning";

const LoginForm = () => {
  const [toggleHidden, setToggleHidden] = useState(true);
  const { handleSubmit, errors, control } = useLoginForm();
  const [apiError, setApiError] = useState("");
  const [showInputErrorMessage, setShowInputErrorMessage] = useState(false);
  const [showResponseErrorMessage, setShowResponseErrorMessage] =
    useState(false);
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowResponseErrorMessage(false);
      setShowInputErrorMessage(false);
    }, 2000); // Set timeout to 2 seconds

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showInputErrorMessage, showResponseErrorMessage]);

  const handleToggleHidden = () => {
    setToggleHidden(!toggleHidden);
  };

  const onSubmit = handleSubmit(async (data: LoginUserFields) => {
    const response = await API.login(data);
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message);
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message);
    } else {
      authStore.login(response.data);
      router.push("/dashboard");
    }
  });
  return (
    <div className="flex flex-col justify-between items-center h-screen py-10 bg-white w-1/3 text-md">
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
        <h1 className="font-bold text-4xl">Welcome back!</h1>
        <p className="font-light text-md">Please enter your details</p>
      </div>
      <div className="w-4/5">
        <form onSubmit={onSubmit} className="flex flex-col gap-1 w-full">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <div className="mb-3 w-full flex flex-col">
                <label htmlFor="email" className="font-light">
                  E-mail:
                </label>
                <input
                  {...field}
                  type="email"
                  placeholder="Placeholder"
                  aria-label="Email"
                  aria-describedby="email"
                  className="border w-full font-light py-2 px-4 rounded-2xl"
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <div className="mb-3 w-full">
                <label htmlFor="password" className="font-light">
                  Password:
                </label>
                <div className="relative">
                  <input
                    {...field}
                    type={toggleHidden ? "password" : "text"}
                    placeholder="Placeholder"
                    aria-label="Password"
                    aria-describedby="password"
                    className="border w-full font-light py-2 px-4 rounded-2xl"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <EyeIcon
                      className="h-5 w-5 text-gray-400 cursor-pointer"
                      onClick={handleToggleHidden}
                    />
                  </div>
                </div>
              </div>
            )}
          />
          <Link
            href="/forgotPassword"
            className="font-light text-xs text-right mb-3"
          >
            Forgot password?
          </Link>
          <button
            onClick={() => {
              if (apiError) {
                setShowResponseErrorMessage(true);
              } else if (errors) {
                setShowInputErrorMessage(true);
              }
            }}  
            type="submit"
            className="bg-fluoro-yellow font-medium px-4 py-2 rounded-2xl"
          >
            Login
          </button>
        </form>
      </div>
      <div className="font-light">
        Don`t have an account?{" "}
        <Link href="/register" className="font-bold">
          Sign Up
        </Link>
      </div>
      {(errors.email && (
        <ToastWarning
          errorMessage={errors.email?.message}
          showErrorMessage={showInputErrorMessage}
        />
      )) ||
        (errors.password && (
          <ToastWarning
            errorMessage={errors.password?.message}
            showErrorMessage={showInputErrorMessage}
          />
        ))}
      <ToastWarning
        errorMessage={apiError}
        showErrorMessage={showResponseErrorMessage}
      />
    </div>
  );
};

export default LoginForm;
