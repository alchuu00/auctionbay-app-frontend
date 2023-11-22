"use client";

import EyeIcon from "@heroicons/react/outline/EyeIcon";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, set } from "react-hook-form";
import Link from "next/link";
import { StatusCode } from "../../constants/errorConstants";
import { useRegisterForm, RegisterUserFields } from "../../hooks/useRegister";
import authStore from "../../stores/authStore";
import * as API from "../../api/api";
import ToastWarning from "../../components/ToastWarning";
import Logo from "../../components/Topbar/Logo";

const RegisterForm = () => {
  const [toggleHiddenPassword, setToggleHiddenPassword] = useState(true);
  const [toggleHiddenConfirmPassword, setToggleHiddenConfirmPassword] =
    useState(true);
  const { handleSubmit, errors, control } = useRegisterForm();
  const [showInputErrorMessage, setShowInputErrorMessage] = useState(false);
  const [showResponseErrorMessage, setShowResponseErrorMessage] =
    useState(false);
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  const errorFields = [
    { field: "first_name", message: errors.first_name?.message },
    { field: "last_name", message: errors.last_name?.message },
    { field: "email", message: errors.email?.message },
    { field: "password", message: errors.password?.message },
    { field: "confirm_password", message: errors.confirm_password?.message },
  ];

  const firstError = errorFields.find((errorField) => errorField.message);

  const handleToggleHiddenPassword = () => {
    setToggleHiddenPassword(!toggleHiddenPassword);
  };

  const handleToggleHiddenConfirmPassword = () => {
    setToggleHiddenConfirmPassword(!toggleHiddenConfirmPassword);
  };

  const onSubmit = handleSubmit(async (data: RegisterUserFields) => {
    const response = await API.register(data);

    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message);
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message);
    } else {
      authStore.login(response.data);
      router.push("/auctions/all");
    }
  });
  return (
    <div className="flex flex-col justify-between items-center h-screen py-10 bg-white w-1/3 text-md">
      <Logo />
      <div className="text-center mb-5">
        <h1 className="font-bold text-4xl">Hello!</h1>
        <p className="text-md font-light">Please enter your details</p>
      </div>
      <div className="w-4/5">
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center items-center w-full"
          noValidate>
          <div className="flex gap-4 w-full">
            <Controller
              control={control}
              name="first_name"
              render={({ field }) => (
                <div className="mb-3 w-full">
                  <label htmlFor="first_name" className="font-light">
                    First name:
                  </label>
                  <input
                    {...field}
                    value={field.value as string}
                    type="text"
                    placeholder="Placeholder"
                    aria-label="First Name"
                    aria-describedby="first name"
                    className="border w-full font-light py-2 px-4 rounded-2xl"
                  />
                </div>
              )}
            />
            <Controller
              control={control}
              name="last_name"
              render={({ field }) => (
                <div className="mb-3 w-full">
                  <label htmlFor="last_name" className="font-light">
                    Last Name:
                  </label>
                  <input
                    {...field}
                    value={field.value as string}
                    type="text"
                    placeholder="Placeholder"
                    aria-label="Last Name"
                    aria-describedby="last name"
                    className="border w-full font-light py-2 px-4 rounded-2xl"
                  />
                </div>
              )}
            />
          </div>
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
                  value={field.value as string}
                  type="email"
                  placeholder="Placeholder"
                  aria-label="Email"
                  aria-describedby="Email"
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
                    type={toggleHiddenPassword ? "password" : "text"}
                    placeholder="Placeholder"
                    aria-label="Password"
                    aria-describedby="password"
                    className="border w-full font-light py-2 px-4 rounded-2xl"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <EyeIcon
                      className="h-5 w-5 text-gray-400 cursor-pointer"
                      onClick={handleToggleHiddenPassword}
                    />
                  </div>
                </div>
              </div>
            )}
          />
          <Controller
            control={control}
            name="confirm_password"
            render={({ field }) => (
              <div className="mb-3 w-full">
                <label htmlFor="confirm_password" className="font-light">
                  Confirm Password:
                </label>
                <div className="relative">
                  <input
                    {...field}
                    type={toggleHiddenConfirmPassword ? "password" : "text"}
                    placeholder="Placeholder"
                    aria-label="Confirm Password"
                    aria-describedby="confirm password"
                    className="border w-full font-light py-2 px-4 rounded-2xl"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <EyeIcon
                      className="h-5 w-5 text-gray-400 cursor-pointer"
                      onClick={handleToggleHiddenConfirmPassword}
                    />
                  </div>
                </div>
              </div>
            )}
          />
          <button
            type="submit"
            className="bg-fluoro-yellow font-medium px-4 py-2 rounded-2xl w-full">
            Sign Up
          </button>
        </form>
      </div>
      <div className="font-light">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-bold">
          Log In
        </Link>
      </div>
      {firstError && <ToastWarning errorMessage={firstError.message} />}
      {apiError && <ToastWarning errorMessage={apiError} />}
    </div>
  );
};

export default RegisterForm;
