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
  timeout: 10000,
});

type RefreshTokenData = {
  userId: number;
  access_token: string;
  refresh_token: string;
};
const getAuthAxios = async () => {
  let accessToken = getAccessToken();
  if (!accessToken) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return baseAxios;
    }
    try {
      const res = await baseAxios.post("/user/token", {
        refresh_token: refreshToken,
      });
      const data = res.data as RefreshTokenData;
      accessToken = data.access_token;
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
    } catch (err) {
      console.error(err);
      return baseAxios;
    }
  }
  return axios.create({
    baseURL: "https://api.igame.ml",
    headers: { Authorization: `token ${accessToken}` },
    timeout: 10000,
  });
};

export type { ApiQueryOptions, ApiMutationOptions };
export { baseAxios, getAuthAxios };
