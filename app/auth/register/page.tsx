import RegisterForm from "../components/RegisterForm";
import React from "react";
import { AuthLayout } from "../AuthLayout";
import AuthHero from "../components/AuthHero";

const RegisterPage = () => {
  return (
    <AuthLayout>
      <AuthHero></AuthHero>
      <RegisterForm></RegisterForm>
    </AuthLayout>
  );
};

export default RegisterPage;
