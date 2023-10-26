import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { UserType } from '../models/auth'

export interface CreateUserFields {
  first_name?: string
  last_name?: string
  email: string
  password: string
  confirm_password: string
  role_id: string
}

interface Props {
  defaultValues?: UserType
}

export const useCreateUpdateUserForm = ({ defaultValues }: Props) => {
  const CreateUserSchema = Yup.object().shape({
    first_name: Yup.string().notRequired(),
    last_name: Yup.string().notRequired(),
    email: Yup.string().email().required('Please enter a valid email'),
    password: Yup.string()
      .matches(
        /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/,
        'Password must have at least one number, lower or upper case letter and it has to be longer than 5 characters.',
      )
      .required(),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), ""], 'Passwords do not match')
      .required('Passwords do not match'),
    role_id: Yup.string().required('Role field is required'),
  })


  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
      role_id: '',
      ...defaultValues,
    },
    mode: 'onSubmit',
    resolver: yupResolver(CreateUserSchema),

  })

  return {
    handleSubmit,
    errors,
    control,
  }
}

export type CreateUpdateUserForm = ReturnType<typeof useCreateUpdateUserForm>