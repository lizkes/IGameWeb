import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useMutation } from "react-query";
import {
  ApiQueryOptions,
  ApiMutationOptions,
  baseAxios,
  getAuthAxios,
} from ".";

type Tag = {
  tag_id: number;
  tag_name: string;
};
type AppType = "game" | "expansion";

type ArticleAmountQueryData = {
  amount: number;
};
const useAppAmountQuery = (
  { appType }: { appType: AppType },
  options?: ApiQueryOptions<ArticleAmountQueryData>
) => {
  return useQuery<AxiosResponse<ArticleAmountQueryData, any>, AxiosError>(
    ["appAmount", appType],
    () => {
      return baseAxios.get("/app/amount", {
        params: { type: appType },
      });
    },
    options
  );
};

type AppBriefInfo = {
  id: number;
  type: AppType;
  app_id: number;
  name: string;
  tags: Array<Tag>;
  viewed: number;
  downloaded: number;
  subscribed: number;
  allowed_exp: number;
  vertical_image: string;
  horizontal_image: string;
  updated_at: string;
};
type AppBriefInfosQueryData = Array<AppBriefInfo>;
const useAppBriefInfosQuery = (
  {
    appType,
    offset,
    limit,
    sortBy,
    tagIds,
    dependAppId,
  }: {
    appType: AppType;
    offset: number;
    limit: number;
    sortBy: string;
    tagIds: Array<number>;
    dependAppId?: number;
  },
  options?: ApiQueryOptions<AppBriefInfosQueryData>
) => {
  return useQuery<AxiosResponse<AppBriefInfosQueryData, any>, AxiosError>(
    ["appBriefInfos", appType, offset, limit, sortBy, tagIds, dependAppId],
    () => {
      return baseAxios.get("/app/brief_infos", {
        params: {
          type: appType,
          offset: offset,
          limit: limit,
          sort_by: sortBy,
          tag_ids: tagIds.join(","),
          depend_app_id: dependAppId,
        },
      });
    },
    options
  );
};

type AppInfoQueryData = {
  id: number;
  type: AppType;
  app_id: number;
  name: string;
  short_description: string;
  long_description: string;
  tags: Array<Tag>;
  viewed: number;
  downloaded: number;
  subscribed: number;
  allowed_exp: number;
  vertical_image: string;
  horizontal_image: string;
  content_images: Array<string>;
  content_video_thumbs: Array<string>;
  content_videos: Array<string>;
  depend_app_id?: number;
  depend_app_name?: string;
  updated_at: string;
};
const useAppInfoQuery = (
  { id, type, appId }: { id?: number; type?: AppType; appId?: number },
  options?: ApiQueryOptions<AppInfoQueryData>
) => {
  return useQuery<AxiosResponse<AppInfoQueryData, any>, AxiosError>(
    ["appInfo", id, type, appId],
    async () => {
      const authAxios = await getAuthAxios();
      return authAxios.get("/app/info", {
        params: {
          id: id,
          type: type,
          app_id: appId,
        },
      });
    },
    options
  );
};

type AppSubscribeStatusQueryData = {
  subscribe: boolean;
  created_at?: string;
};
const useAppSubscribeStatusQuery = (
  { appId }: { appId: number },
  options?: ApiQueryOptions<AppSubscribeStatusQueryData>
) => {
  return useQuery<AxiosResponse<AppSubscribeStatusQueryData, any>, AxiosError>(
    ["appSubscribeStatus", appId],
    async () => {
      const authAxios = await getAuthAxios();
      return authAxios.get(`/app/${appId}/subscribe_status`);
    },
    options
  );
};

const useAppSubscribeMutation = (
  options?: ApiMutationOptions<void, { appId: number }>
) => {
  return useMutation<AxiosResponse<void, any>, AxiosError, { appId: number }>(
    ["appSubscribe"],
    async ({ appId }) => {
      const authAxios = await getAuthAxios();
      return authAxios.post(`/app/${appId}/subscribe`);
    },
    options
  );
};

const useAppUnsubscribeMutation = (
  options?: ApiMutationOptions<void, { appId: number }>
) => {
  return useMutation<AxiosResponse<void, any>, AxiosError, { appId: number }>(
    ["appUnsubscribe"],
    async ({ appId }) => {
      const authAxios = await getAuthAxios();
      return authAxios.post(`/app/${appId}/unsubscribe`);
    },
    options
  );
};

export {
  useAppAmountQuery,
  useAppBriefInfosQuery,
  useAppInfoQuery,
  useAppSubscribeStatusQuery,
  useAppSubscribeMutation,
  useAppUnsubscribeMutation,
};
