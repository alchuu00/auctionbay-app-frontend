import { apiRoutes } from "../constants/apiConstatnts";
import { CreateUpdateUserFields } from "../hooks/useCreateUpdateUser";
import { LoginUserFields } from "../hooks/useLogin";
import { RegisterUserFields } from "../hooks/useRegister";
import { UpdatePasswordFields } from "../hooks/useUpdatePassword";
import { UpdateUserFields } from "../hooks/useUpdateUser";
import { UserType } from "../models/auth";
import { apiRequest } from "./api";

export const fetchUser = async (id: string) =>
  apiRequest<string, UserType>("get", `${apiRoutes.FETCH_USERS}/${id}`);

export const fetchUsers = async (pageNumber: number) =>
  apiRequest<number, UserType[]>(
    "get",
    `${apiRoutes.FETCH_USERS}?page=${pageNumber}`
  );

export const login = async (data: LoginUserFields) =>
  apiRequest<LoginUserFields, UserType>("post", apiRoutes.LOGIN, data);

export const register = async (data: RegisterUserFields) =>
  apiRequest<RegisterUserFields, void>("post", apiRoutes.SIGNUP, data);

export const signout = async () =>
  apiRequest<undefined, void>("post", apiRoutes.SIGNOUT);

export const refreshTokens = async () =>
  apiRequest<undefined, UserType>("get", apiRoutes.REFRESH_TOKENS);

export const uploadAvatar = async (formData: FormData, id: string) =>
  apiRequest<FormData, void>(
    "post",
    `${apiRoutes.UPLOAD_AVATAR_IMAGE}/${id}`,
    formData
  );

export const createUser = async (data: CreateUpdateUserFields) =>
  apiRequest<CreateUpdateUserFields, void>("post", apiRoutes.USERS_PREFIX, data);

export const updateUser = async (data: UpdateUserFields, id: string) =>
  apiRequest<UpdateUserFields, void>(
    "patch",
    `${apiRoutes.USERS_PREFIX}/${id}`,
    data
  );

  export const updateUserPassword = async (data: Omit<UpdatePasswordFields, 'new_password'>, id: string) =>
  apiRequest<UpdatePasswordFields, void>(
    "patch",
    `${apiRoutes.USERS_PREFIX}/${id}`,
    data
  );

export const deleteUser = async (id: string) =>
  apiRequest<string, UserType>("delete", `${apiRoutes.USERS_PREFIX}/${id}`);