import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useMutation } from "react-query";
import {
  baseAxios,
  getAuthAxios,
  ApiQueryOptions,
  ApiMutationOptions,
} from ".";

type ResourceProviderGroup = "normal" | "fast";

type ResourceAmountQueryData = {
  amount: number;
};
const useResourceAmountQuery = (
  { appId }: { appId: number },
  options?: ApiQueryOptions<ResourceAmountQueryData>
) => {
  return useQuery<AxiosResponse<ResourceAmountQueryData, any>, AxiosError>(
    ["resourceAmount", appId],
    () => {
      return baseAxios.get("/resource/amount", {
        params: { app_id: appId },
      });
    },
    options
  );
};

type ResourceBriefInfo = {
  id: number;
  name: string;
  version: string;
  allowed_exp: number;
};
type ResourceBriefInfosQueryData = Array<ResourceBriefInfo>;
const useResourceBriefInfosQuery = (
  {
    offset,
    limit,
    appId,
  }: {
    offset: number;
    limit: number;
    appId: number;
  },
  options?: ApiQueryOptions<ResourceBriefInfosQueryData>
) => {
  return useQuery<AxiosResponse<ResourceBriefInfosQueryData, any>, AxiosError>(
    ["resourceBriefInfos", offset, limit, appId],
    () => {
      return baseAxios.get("/resource/brief_infos", {
        params: {
          offset: offset,
          limit: limit,
          app_id: appId,
        },
      });
    },
    options
  );
};

type ResourceInfoQueryData = {
  id: number;
  app_id: number;
  name: string;
  type: number;
  version: string;
  description: string;
  allowed_exp: number;
  downloaded: number;
  can_normal_download: boolean;
  can_fast_download: boolean;
  require_systems: Array<number>;
  require_disk: number;
  updated_at: string;
};
const useResourceInfoQuery = (
  { resourceId }: { resourceId: number },
  options?: ApiQueryOptions<ResourceInfoQueryData>
) => {
  return useQuery<AxiosResponse<ResourceInfoQueryData, any>, AxiosError>(
    ["resourceInfo", resourceId],
    async () => {
      const authAxios = await getAuthAxios();
      return authAxios.get(`/resource/${resourceId}/info`);
    },
    options
  );
};

type ResourceDownloadUrlData = {
  trade_id: number;
  download_url: string;
  remain_coin?: number;
  downloaded: number;
};
const useResourceDownloadUrlMutation = (
  options?: ApiMutationOptions<
    ResourceDownloadUrlData,
    {
      resourceId: number;
      providerGroup: ResourceProviderGroup;
    }
  >
) => {
  return useMutation<
    AxiosResponse<ResourceDownloadUrlData, any>,
    AxiosError,
    {
      resourceId: number;
      providerGroup: ResourceProviderGroup;
    }
  >(
    ["resourceDownloadUrl"],
    async ({ resourceId, providerGroup }) => {
      const authAxios = await getAuthAxios();
      return authAxios.get(`/resource/${resourceId}/download_url`, {
        params: {
          provider_group: providerGroup,
        },
      });
    },
    options
  );
};

export {
  useResourceAmountQuery,
  useResourceBriefInfosQuery,
  useResourceInfoQuery,
  useResourceDownloadUrlMutation,
};
