import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { UserType } from "../models/auth";

export interface CreateUpdateUserFields {
  first_name?: Yup.Maybe<string>;
  last_name?: Yup.Maybe<string>;
  email: string;
  password: string;
  confirm_password: string;
  new_password?: Yup.Maybe<string>;
}

interface Props {
  defaultValues?: UserType | null;
}

export const useCreateUpdateUserForm = ({ defaultValues }: Props) => {
  const CreateUserSchema = Yup.object().shape({
    first_name: Yup.string().notRequired(),
    last_name: Yup.string().notRequired(),
    email: Yup.string().email().required("Please enter a valid email"),
    password: Yup.string()
      .matches(
        /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/,
        "Password must have at least one number, lower or upper case letter and it has to be longer than 5 characters."
      )
      .required(),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords do not match")
      .required("Passwords do not match"),
    new_password: Yup.string()
      .matches(
        /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/,
        "Password must have at least one number, lower or upper case letter and it has to be longer than 5 characters."
      )
      .required(),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      new_password: "",
      ...defaultValues,
    },
    mode: "onSubmit",
    resolver: yupResolver(CreateUserSchema),
  });

  return {
    handleSubmit,
    errors,
    control,
  };
};

export type CreateUpdateUserForm = ReturnType<typeof useCreateUpdateUserForm>;
