import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery } from "react-query";
import {
  baseAxios,
  getAuthAxios,
  ApiQueryOptions,
  ApiMutationOptions,
} from ".";

type Role = {
  role_id: number;
  role_name: string;
  expire_at?: string;
};
type UserInfoQueryData = {
  user_id: number;
  email: string;
  nick_name: string;
  exp: number;
  coin: number;
  roles: Array<Role>;
  avatar_url: string;
  login_at: string;
  created_at: string;
  daily_bonus_count: number;
  last_daily_bonus_time?: string;
};
const useUserInfoQuery = (
  { userId }: { userId: number },
  options?: ApiQueryOptions<UserInfoQueryData>
) => {
  return useQuery<AxiosResponse<UserInfoQueryData, any>, AxiosError>(
    ["userInfo", userId],
    async () => {
      const authAxios = await getAuthAxios();
      return authAxios.get(`/user/${userId}/info`);
    },
    options
  );
};

type UserLoginMutationData = {
  user_id: number;
  access_token: string;
  refresh_token: string;
};
const useUserLoginMutation = (
  options?: ApiMutationOptions<
    UserLoginMutationData,
    { email: string; password: string }
  >
) => {
  return useMutation<
    AxiosResponse<UserLoginMutationData, any>,
    AxiosError,
    { email: string; password: string }
  >(
    ["userLogin"],
    ({ email, password }) => {
      return baseAxios.post("/user/login", {
        email: email,
        password: password,
      });
    },
    options
  );
};

type UserRegisterMutationData = {
  user_id: number;
  access_token: string;
  refresh_token: string;
};
const useUserRegisterMutation = (
  options?: ApiMutationOptions<
    UserRegisterMutationData,
    {
      nickname: string;
      email: string;
      password: string;
      verifyCode: string;
    }
  >
) => {
  return useMutation<
    AxiosResponse<UserRegisterMutationData, any>,
    AxiosError,
    {
      nickname: string;
      email: string;
      password: string;
      verifyCode: string;
    }
  >(
    ["userRegister"],
    ({ nickname, email, password, verifyCode }) => {
      return baseAxios.post("/user/register", {
        nick_name: nickname,
        email: email,
        password: password,
        verify_code: verifyCode,
      });
    },
    options
  );
};

type UserResetPasswordMutationData = {
  user_id: number;
  access_token: string;
  refresh_token: string;
};
const useUserResetPasswordMutation = (
  options?: ApiMutationOptions<
    UserResetPasswordMutationData,
    {
      email: string;
      newPassword: string;
      verifyCode: string;
    }
  >
) => {
  return useMutation<
    AxiosResponse<UserResetPasswordMutationData, any>,
    AxiosError,
    {
      email: string;
      newPassword: string;
      verifyCode: string;
    }
  >(
    ["userResetPassword"],
    ({ email, newPassword, verifyCode }) => {
      return baseAxios.post("/user/reset_password", {
        email: email,
        new_password: newPassword,
        verify_code: verifyCode,
      });
    },
    options
  );
};

type UserDailyBonusMutationData = {
  user_id: number;
  daily_bonus_id: number;
  count: number;
  added_coin: number;
  added_exp: number;
  total_coin: number;
  total_exp: number;
};
const useUserDailyBonusMutation = (
  options?: ApiMutationOptions<UserDailyBonusMutationData, void>
) => {
  return useMutation<
    AxiosResponse<UserDailyBonusMutationData, any>,
    AxiosError
  >(
    ["userDailyBonus"],
    async () => {
      const authAxios = await getAuthAxios();
      return authAxios.post("/user/daily_bonus");
    },
    options
  );
};

export type { UserInfoQueryData };
export {
  useUserInfoQuery,
  useUserLoginMutation,
  useUserRegisterMutation,
  useUserResetPasswordMutation,
  useUserDailyBonusMutation,
};
