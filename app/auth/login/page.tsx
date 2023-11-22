"use client";

import React from "react";
import LoginForm from "../components/LoginForm";
import { AuthLayout } from "../AuthLayout";
import AuthHero from "../components/AuthHero";

const LoginPage = () => {
  return (
    <AuthLayout>
      <AuthHero></AuthHero>
      <LoginForm></LoginForm>
    </AuthLayout>
  );
};

export default LoginPage;
