import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import * as Yup from "yup";

export interface UpdatePasswordFields {
  password?: Yup.Maybe<string>;
  confirm_password?: Yup.Maybe<string>;
  new_password?: Yup.Maybe<string>;
}

export const usePasswordForm = () => {
  const UpdatePasswordSchema = Yup.object().shape({
    password: Yup.string().required(),
    confirm_password: Yup.string().required(),
    new_password: Yup.string().required(),
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm({
    defaultValues: {
      password: "",
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

export type UpdatePasswordForm = ReturnType<typeof usePasswordForm>;
