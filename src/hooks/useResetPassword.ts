import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import * as Yup from "yup";

export interface ResetPasswordFields {
  confirm_password?: Yup.Maybe<string>;
  password?: Yup.Maybe<string>;
}

export const useResetPasswordForm = () => {
  const ResetPasswordSchema = Yup.object().shape({
    confirm_password: Yup.string().required(),
    password: Yup.string().required(),
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm({
    defaultValues: {
      confirm_password: "",
      password: "",
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

export type UpdatePasswordForm = ReturnType<typeof useResetPasswordForm>;
