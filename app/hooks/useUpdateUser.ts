import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { UserType } from "../models/auth";

export interface UpdateUserFields {
  first_name?: Yup.Maybe<string>;
  last_name?: Yup.Maybe<string>;
  email?: Yup.Maybe<string>;
  password?: Yup.Maybe<string>;
  confirm_password?: Yup.Maybe<string>;
  new_password?: Yup.Maybe<string>;
}

interface Props {
  defaultValues?: UpdateUserFields | null;
}

export const useUpdateUserForm = ({ defaultValues }: Props) => {
  const UpdateUserSchema = Yup.object().shape({
    first_name: Yup.string().notRequired(),
    last_name: Yup.string().notRequired(),
    email: Yup.string().email().notRequired(),
    password: Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .matches(
      /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/,
      'Password must have at least one number, lower or upper case letter and it has to be longer than 5 characters.',
    )
    .notRequired(),
    confirm_password: Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .when('password', (password, schema) => {
      if (password || password.length > 0) {
        return schema.oneOf([Yup.ref('password')], 'Passwords do not match');
      }
      return schema;
    })
    .notRequired(),
  new_password: Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .matches(
      /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/,
      'Password must have at least one number, lower or upper case letter and it has to be longer than 5 characters.',
    )
    .notRequired(),
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
    resolver: yupResolver(UpdateUserSchema),
  });

  return {
    handleSubmit,
    errors,
    control,
  };
};

export type UpdateUserForm = ReturnType<typeof useUpdateUserForm>;
