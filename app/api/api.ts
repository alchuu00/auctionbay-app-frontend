import Axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'

export async function apiRequest<D = Record<string, unknown>, R = unknown>(
  method: 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch',
  path: string,
  input?: D,
  options?: {
    headers?: AxiosRequestHeaders
  } & AxiosRequestConfig,
) {
  try {
    // TODO: replace hard coded url with .env.development
    const response = await Axios.request<R>({
      baseURL: "http://localhost:8080",
      url: path,
      method: method,
      data: input,
      headers: options?.headers,
      withCredentials: true,
    })
    console.log(response)
    return response
  } catch (error: any) {
    return error.response
  }
}

export * from './user'