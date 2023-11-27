import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import * as Yup from "yup";

export interface ResetPasswordFields {
  confirm_password?: Yup.Maybe<string>;
  new_password?: Yup.Maybe<string>;
}

export const useResetPasswordForm = () => {
  const UpdatePasswordSchema = Yup.object().shape({
    confirm_password: Yup.string().required(),
    new_password: Yup.string().required(),
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm({
    defaultValues: {
      confirm_password: "",
      new_password: "",
    },
    mode: "onSubmit",
    resolver: yupResolver(UpdatePasswordSchema),
  });

  return {
    handleSubmit,
    errors,
    isValid,
    control,
  };
};

export type UpdatePasswordForm = ReturnType<typeof useResetPasswordForm>;
