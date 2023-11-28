import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import * as Yup from "yup";

export interface ResetPasswordFields {
  password?: Yup.Maybe<string>;
  confirm_password?: Yup.Maybe<string>;
}

export const useResetPasswordForm = () => {
  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string().required(),
    confirm_password: Yup.string().required(),
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm({
    defaultValues: {
      password: "",
      confirm_password: "",
    },
    mode: "onSubmit",
    resolver: yupResolver(ResetPasswordSchema),
  });

  return {
    handleSubmit,
    errors,
    isValid,
    control,
  };
};

export type ResetPasswordForm = ReturnType<typeof useResetPasswordForm>;
