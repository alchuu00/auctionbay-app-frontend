import { apiRoutes } from "../constants/apiConstatnts";
import { ResetPasswordFields } from "../hooks/useFormPasswordReset";
import { apiRequest } from "./api";

export const sendPasswordResetEmail = async (email: string) =>
  apiRequest<{ email: string }, void>(
    "post",
    `${apiRoutes.AUTH_PREFIX}/send-password-reset-email`,
    { email }
  );

export const getUserFromToken = async (token: string) =>
  apiRequest<void, void>("get", `${apiRoutes.RESET_PASSWORD_PREFIX}/${token}`);

export const resetUserPassword = async (
  updateUserDto: ResetPasswordFields,
  id: string,
  token: string
) =>
  apiRequest<{ updateUserDto: ResetPasswordFields; token: string }, void>(
    "patch",
    `${apiRoutes.RESET_PASSWORD_PREFIX}/${id}`,
    { updateUserDto, token }
  );
