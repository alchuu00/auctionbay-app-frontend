import Axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { refreshTokens } from "./user";

const instance = Axios.create();

// response interceptor to refresh token if response status is 401 unauthorized 
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { accessToken } = await refreshTokens();
      if (!accessToken) {
        window.location.href = "/";
        return Promise.reject(error);
      }
 
      instance.defaults.headers.common["Authorization"] =
        "Bearer " + accessToken;
      return instance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export async function apiRequest<D = Record<string, unknown>, R = unknown>(
  method: "get" | "delete" | "head" | "options" | "post" | "put" | "patch",
  path: string,
  input?: D,
  options?: {
    headers?: AxiosRequestHeaders;
  } & AxiosRequestConfig
) {
  try {
    const response = await Axios.request<R>({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      url: path,
      method: method,
      data: input,
      headers: options?.headers,
      withCredentials: true,
    });
    return response;
  } catch (error: any) {
    return error.response;
  }
}

export * from "./user";
export * from "./auctionItems";
export * from "./bids";
export * from "./passwordReset";
export * from "./notifications";
