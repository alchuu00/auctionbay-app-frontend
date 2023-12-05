"use client";

import EyeIcon from "@heroicons/react/outline/EyeIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import * as API from "@/src/api/api";
import Logo from "@/app/components/Logo";
import { StatusCode } from "@/src/constants/errorConstants";
import { useLoginForm, LoginUserFields } from "@/src/hooks/useLogin";
import authStore from "@/src/stores/authStore";
import { userStorage } from "@/src/stores/userStorage";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [toggleHidden, setToggleHidden] = useState(true);

  const { handleSubmit, errors, control } = useLoginForm();

  useEffect(() => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  }, [errors]);

  const router = useRouter();

  const handleToggleHidden = () => {
    setToggleHidden(!toggleHidden);
  };

  const onSubmit = handleSubmit(async (data: LoginUserFields) => {
    const response = await API.login(data);
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      toast.error(response.data.message);
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      toast.error(response.data.message);
    } else {
      authStore.login(response.data);
      userStorage.setUser(response.data);
      router.push("/auctions/all");
    }
  });
  return (
    <div className="flex flex-col lg:justify-between justify-around items-center h-screen py-10 bg-white lg:w-1/3 w-full text-md">
      <Logo />
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
            href="/auth/forgotPassword"
            className="font-light text-xs text-right mb-3">
            Forgot password?
          </Link>
          <button
            type="submit"
            className="bg-fluoro-yellow font-medium px-4 py-2 rounded-2xl">
            Login
          </button>
        </form>
      </div>
      <div className="font-light">
        Don`t have an account?{" "}
        <Link href="/auth/register" className="font-bold">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
