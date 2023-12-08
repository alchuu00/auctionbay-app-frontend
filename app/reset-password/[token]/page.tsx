"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as API from "@/src/api/api";
import { Controller } from "react-hook-form";
import EyeIcon from "@heroicons/react/outline/EyeIcon";
import { AuthLayout } from "@/app/auth/AuthLayout";
import AuthHero from "@/app/auth/components/AuthHero";
import Logo from "@/app/components/Logo";
import Link from "next/link";
import { StatusCode } from "@/src/constants/errorConstants";
import { toast } from "react-toastify";
import { ResetPasswordFields, useResetPasswordForm } from "@/src/hooks/useFormPasswordReset";
import { routes } from "@/src/constants/routesConstants";

const DefaultResetPassword: React.FC = () => {
  const [toggleHiddenNew, setToggleHiddenNew] = useState(true);
  const [toggleHiddenConfirm, setToggleHiddenConfirm] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  const router = useRouter();

  const params = useParams();
  const token = params.token;

  useEffect(() => {
    const fetchUser = async () => {
      const userIdFromApi = await API.getUserFromToken(token as string);
      const userFromApi = await API.fetchUser(userIdFromApi.data as string);
      setUser(userFromApi);
    };

    fetchUser();
  }, [token]);

  const { handleSubmit, errors, control } = useResetPasswordForm();

  useEffect(() => { 
    const firstError = Object.values(errors)[0];

    if (firstError?.message) {
      toast.error(firstError.message);
    }
}, [errors]);


  const handleResetPassword = async (data: ResetPasswordFields) => {
    const response = await API.resetUserPassword(
      { password: data.password, confirm_password: data.confirm_password },
      user?.data.id as string, token as string
    );
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      toast.error(response.data.message);
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      toast.error(response.data.message);
    } else {
      router.push(`${routes.LOGIN}`);
      toast.success("Password reset successfully");
    }
  };

  const onSubmit = handleSubmit(async (data: ResetPasswordFields) => {
    await handleResetPassword(data);
  });

  const handleToggleHiddenNew = () => {
    setToggleHiddenNew(!toggleHiddenNew);
  };

  const handleToggleHiddenConfirm = () => {
    setToggleHiddenConfirm(!toggleHiddenConfirm);
  };

  return (
    <AuthLayout>
      <AuthHero />
      <div className="flex flex-col lg:justify-between justify-around items-center h-screen py-10 bg-white lg:w-1/3 w-screen">
        <Logo />
        <div className="text-center">
          <h1 className="font-bold text-4xl mb-2">Reset your password</h1>
          <p className="font-light">Change your password in the form below.</p>
        </div>
        <div className="w-4/5">
          <form onSubmit={onSubmit} className="flex flex-col gap-2 mb-40">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <div className="mb-3 w-full">
                  <label htmlFor="new-password" className="font-light">
                    New password:
                  </label>
                  <div className="relative">
                    <input
                      {...field}
                      type={toggleHiddenNew ? "password" : "text"}
                      aria-label="New Password"
                      aria-describedby="new password"
                      className="border-2 border-gray-blue w-full font-light py-2 px-4 rounded-2xl"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <EyeIcon
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={handleToggleHiddenNew}
                      />
                    </div>
                  </div>
                </div>
              )}
            />
            <Controller
              name="confirm_password"
              control={control}
              render={({ field }) => (
                <div className="mb-3 w-full">
                  <label htmlFor="repeat-password" className="font-light">
                    Repeat password:
                  </label>
                  <div className="relative">
                    <input
                      {...field}
                      type={toggleHiddenConfirm ? "password" : "text"}
                      aria-label="Repeat Password"
                      aria-describedby="repeat password"
                      className="border-2 border-gray-blue w-full font-light py-2 px-4 rounded-2xl"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <EyeIcon
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={handleToggleHiddenConfirm}
                      />
                    </div>
                  </div>
                </div>
              )}
            />
            <button
              type="submit"
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

export default DefaultResetPassword;
