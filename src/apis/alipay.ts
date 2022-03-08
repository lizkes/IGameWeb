import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";
import { getAuthAxios, ApiMutationOptions } from ".";

type AliPayPrecreateMutationData = {
  order_id: number;
  trade_no: string;
  qr_code: string;
};
const useAliPayPrecreateMutation = (
  options?: ApiMutationOptions<
    AliPayPrecreateMutationData,
    { goodId: number; goodAmount: number }
  >
) => {
  return useMutation<
    AxiosResponse<AliPayPrecreateMutationData, any>,
    AxiosError,
    { goodId: number; goodAmount: number }
  >(
    ["alipayPrecreate"],
    async ({ goodId, goodAmount }) => {
      const authAxios = await getAuthAxios();
      return authAxios.post("/alipay/precreate", {
        pay_method: "dang_mian_fu",
        good_id: goodId,
        good_amount: goodAmount,
      });
    },
    options
  );
};

type AlipayQueryMutationData = {
  trade_id: number;
};
const useAlipayQueryMutation = (
  options?: ApiMutationOptions<AlipayQueryMutationData, { orderId: number }>
) => {
  return useMutation<
    AxiosResponse<AlipayQueryMutationData, any>,
    AxiosError,
    { orderId: number }
  >(
    ["AlipayQuery"],
    async ({ orderId }) => {
      const authAxios = await getAuthAxios();
      return authAxios.get("/alipay/query", {
        params: {
          order_id: orderId,
        },
      });
    },
    options
  );
};

export { useAliPayPrecreateMutation, useAlipayQueryMutation };
