import { apiRoutes } from "../constants/apiConstatnts";
import { apiRequest } from "./api";

export const resetUserPassword = async (data: { token: string, email: string, password: string }, id: string) =>
  apiRequest<{ token: string, email: string, password: string }, void>(
    "post",
    `${apiRoutes.RESET_PASSWORD}/${data.token}`,
    data
  );

  export const sendPasswordResetEmail = async (email: string) =>
  apiRequest<{ email: string }, void>(
    "post",
    `${apiRoutes.RESET_PASSWORD}/${email}`,
    { email }
  );