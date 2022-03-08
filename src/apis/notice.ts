import { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { getAuthAxios, ApiQueryOptions } from ".";

type NoticeAmountQueryData = {
  amount: number;
};
const useNoticeAmountQuery = (
  options?: ApiQueryOptions<NoticeAmountQueryData>
) => {
  return useQuery<AxiosResponse<NoticeAmountQueryData, any>, AxiosError>(
    ["noticeAmount"],
    async () => {
      const authAxios = await getAuthAxios();
      return authAxios.get("/notice/amount");
    },
    options
  );
};

type NoticeUnreadAmountQueryData = {
  amount: number;
};
const useNoticeUnreadAmountQuery = (
  options?: ApiQueryOptions<NoticeUnreadAmountQueryData>
) => {
  return useQuery<AxiosResponse<NoticeUnreadAmountQueryData, any>, AxiosError>(
    ["noticeUnreadAmount"],
    async () => {
      const authAxios = await getAuthAxios();
      return authAxios.get("/notice/unread_amount");
    },
    options
  );
};

type NoticeInfo = {
  notice_id: number;
  title: string;
  content: string;
  read: boolean;
  created_at: string;
};
type NoticeInfosQueryData = Array<NoticeInfo>;
const useNoticeInfosQuery = (
  {
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  },
  options?: ApiQueryOptions<NoticeInfosQueryData>
) => {
  return useQuery<AxiosResponse<NoticeInfosQueryData, any>, AxiosError>(
    ["noticeInfos", offset, limit],
    async () => {
      const authAxios = await getAuthAxios();
      return authAxios.get("/notice/infos", {
        params: {
          offset: offset,
          limit: limit,
        },
      });
    },
    options
  );
};

export type { NoticeInfo };
export {
  useNoticeAmountQuery,
  useNoticeUnreadAmountQuery,
  useNoticeInfosQuery,
};
