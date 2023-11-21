import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import * as Yup from "yup";

export interface UpdateUserFields {
  first_name?: Yup.Maybe<string>;
  last_name?: Yup.Maybe<string>;
  email?: Yup.Maybe<string>;
}

interface Props {
  defaultValues?: UpdateUserFields | null;
}

export const useUpdateUserForm = ({ defaultValues }: Props) => {
  const UpdateUserSchema = Yup.object().shape({
    first_name: Yup.string().notRequired(),
    last_name: Yup.string().notRequired(),
    email: Yup.string().email().notRequired(),
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
