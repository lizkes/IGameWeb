import axios, { AxiosError, AxiosResponse } from "axios";
import { QueryKey, UseMutationOptions, UseQueryOptions } from "react-query";

import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "src/utils/localStorage";

type ApiQueryOptions<T = void> = Omit<
  UseQueryOptions<
    AxiosResponse<T, any>,
    AxiosError,
    AxiosResponse<T, any>,
    QueryKey
  >,
  "queryKey" | "queryFn"
>;
type ApiMutationOptions<T = void, V = void> = Omit<
  UseMutationOptions<AxiosResponse<T, any>, AxiosError, V, unknown>,
  "mutationKey" | "mutationFn"
>;

const baseAxios = axios.create({
  baseURL: "https://api.igame.ml",
  timeout: 8000,
});

const getAuthAxios = async () => {
  let accessToken = getAccessToken();
  if (accessToken === null) {
    const refreshToken = getRefreshToken();
    if (refreshToken === null) {
      return baseAxios;
    }

    const res = await baseAxios.post("/user/token", {
      refresh_token: refreshToken,
    });
    if (res.status !== 200) {
      return baseAxios;
    }

    type RefreshTokenData = {
      userId: number;
      access_token: string;
      refresh_token: string;
    };
    const data = res.data as RefreshTokenData;
    accessToken = data.access_token;
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);
  }
  return axios.create({
    baseURL: "https://api.igame.ml",
    headers: { Authorization: `token ${accessToken}` },
    timeout: 8000,
  });
};

export type { ApiQueryOptions, ApiMutationOptions };
export { baseAxios, getAuthAxios };
