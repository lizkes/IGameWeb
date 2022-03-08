import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";
import { baseAxios, ApiMutationOptions } from ".";

const useVerifyEmailMutation = (
  options?: ApiMutationOptions<
    void,
    { emailAddr: string; emailType: "register_user" | "reset_password" }
  >
) => {
  return useMutation<
    AxiosResponse<void, any>,
    AxiosError,
    { emailAddr: string; emailType: "register_user" | "reset_password" }
  >(
    ["verifyEmail"],
    ({ emailAddr, emailType }) => {
      return baseAxios.post("/email/verify", {
        email_addr: emailAddr,
        email_type: emailType,
      });
    },
    options
  );
};

export { useVerifyEmailMutation };
