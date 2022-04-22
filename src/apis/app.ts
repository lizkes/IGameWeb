import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useMutation, QueryClient } from "react-query";
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
type AppAmountQueryArg = {
  appType: AppType;
};
type AppAmountQueryData = {
  amount: number;
};
const useAppAmountQuery = (
  { appType }: AppAmountQueryArg,
  options?: ApiQueryOptions<AppAmountQueryData>
) => {
  return useQuery<AxiosResponse<AppAmountQueryData, any>, AxiosError>(
    ["appAmount", appType],
    () => {
      return baseAxios.get("/app/amount", {
        params: { type: appType },
      });
    },
    options
  );
};
const prefetchAppAmountQuery = async (
  queryClient: QueryClient,
  { appType }: AppAmountQueryArg
) => {
  await queryClient.prefetchQuery(["appAmount", appType], async () => {
    const { data } = await baseAxios.get("/app/amount", {
      params: { type: appType },
    });
    return { data };
  });
};

type AppBriefInfosQueryArg = {
  appType: AppType;
  offset: number;
  limit: number;
  sortBy: string;
  tagIds: Array<number>;
  dependAppId?: number | null;
};
type AppBriefInfosQueryData = Array<{
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
}>;
const useAppBriefInfosQuery = (
  {
    appType,
    offset,
    limit,
    sortBy,
    tagIds,
    dependAppId = null,
  }: AppBriefInfosQueryArg,
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
const prefetchAppBriefInfosQuery = async (
  queryClient: QueryClient,
  {
    appType,
    offset,
    limit,
    sortBy,
    tagIds,
    dependAppId = null,
  }: AppBriefInfosQueryArg
) => {
  await queryClient.prefetchQuery(
    ["appBriefInfos", appType, offset, limit, sortBy, tagIds, dependAppId],
    async () => {
      const { data } = await baseAxios.get("/app/brief_infos", {
        params: {
          type: appType,
          offset: offset,
          limit: limit,
          sort_by: sortBy,
          tag_ids: tagIds.join(","),
          depend_app_id: dependAppId,
        },
      });
      return { data };
    }
  );
};

type AppInfoQueryArg = {
  id?: number | null;
  type?: AppType | null;
  appId?: number | null;
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
  { id = null, type = null, appId = null }: AppInfoQueryArg,
  options?: ApiQueryOptions<AppInfoQueryData>
) => {
  return useQuery<AxiosResponse<AppInfoQueryData, any>, AxiosError>(
    ["appInfo", id, type, appId],
    async () => {
      return baseAxios.get("/app/info", {
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
const prefetchAppInfoQuery = async (
  queryClient: QueryClient,
  { id = null, type = null, appId = null }: AppInfoQueryArg
) => {
  await queryClient.prefetchQuery(["appInfo", id, type, appId], async () => {
    const { data } = await baseAxios.get("/app/info", {
      params: {
        id: id,
        type: type,
        app_id: appId,
      },
    });
    return { data };
  });
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
  prefetchAppAmountQuery,
  prefetchAppBriefInfosQuery,
  prefetchAppInfoQuery,
};
