import { apiRoutes } from "../constants/apiConstatnts";
import { CreateUpdateUserFields } from "../hooks/useFormCreateUpdateUser";
import { LoginUserFields } from "../hooks/useFormLogin";
import { RegisterUserFields } from "../hooks/useFormRegister";
import { UpdatePasswordFields } from "../hooks/useFormUpdatePassword";
import { UpdateUserFields } from "../hooks/useFormUpdateUser";
import { UserType } from "../models/auth";
import { apiRequest } from "./api";

export const fetchUser = async (id: string) =>
  apiRequest<string, UserType>("get", `${apiRoutes.USERS_PREFIX}/${id}`);

export const fetchUsers = async (pageNumber: number) =>
  apiRequest<number, UserType[]>(
    "get",
    `${apiRoutes.USERS_PREFIX}?page=${pageNumber}`
  );

export const login = async (data: LoginUserFields) =>
  apiRequest<LoginUserFields, UserType>("post", apiRoutes.LOGIN_PREFIX, data);

export const register = async (data: RegisterUserFields) =>
  apiRequest<RegisterUserFields, void>("post", apiRoutes.SIGNUP_PREFIX, data);

export const signout = async () =>
  apiRequest<undefined, void>("post", apiRoutes.SIGNOUT_PREFIX);

export const refreshTokens = async () =>
  apiRequest<undefined, UserType>("get", apiRoutes.REFRESH_TOKENS_PREFIX);

export const uploadAvatar = async (formData: FormData, id: string) =>
  apiRequest<FormData, void>(
    "post",
    `${apiRoutes.UPLOAD_AVATAR_IMAGE_PREFIX}/${id}`,
    formData
  );

export const createUser = async (data: CreateUpdateUserFields) =>
  apiRequest<CreateUpdateUserFields, void>(
    "post",
    apiRoutes.USERS_PREFIX,
    data
  );

export const updateUser = async (data: UpdateUserFields, id: string) =>
  apiRequest<UpdateUserFields, void>(
    "patch",
    `${apiRoutes.USERS_PREFIX}/${id}`,
    data
  );

export const updateUserPassword = async (
  data: Omit<UpdatePasswordFields, "new_password">,
  id: string
) =>
  apiRequest<UpdatePasswordFields, void>(
    "patch",
    `${apiRoutes.USERS_PREFIX}/${id}`,
    data
  );
