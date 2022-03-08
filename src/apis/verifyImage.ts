import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";
import { baseAxios, ApiMutationOptions } from ".";

type VerifyImageNewMutationData = {
  top: number;
  backgroud_url: string;
  puzzle_url: string;
};
const useVerifyImageNewMutation = (
  options?: ApiMutationOptions<VerifyImageNewMutationData, { endpoint: string }>
) => {
  return useMutation<
    AxiosResponse<VerifyImageNewMutationData, any>,
    AxiosError,
    { endpoint: string }
  >(
    ["verifyImageNew"],
    ({ endpoint }) => {
      return baseAxios.post("/verify_image/new", null, {
        params: { endpoint: endpoint },
      });
    },
    options
  );
};

const useVerifyImageVerifyMutation = (
  options?: ApiMutationOptions<void, { endpoint: string; left: number }>
) => {
  return useMutation<
    AxiosResponse<void, any>,
    AxiosError,
    { endpoint: string; left: number }
  >(
    ["verifyImageVerify"],
    ({ endpoint, left }) => {
      return baseAxios.post("/verify_image/verify", null, {
        params: {
          endpoint: endpoint,
          left: left,
        },
      });
    },
    options
  );
};

export type { VerifyImageNewMutationData };
export { useVerifyImageNewMutation, useVerifyImageVerifyMutation };
