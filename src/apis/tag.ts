import { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { baseAxios, ApiQueryOptions } from ".";

type TagInfo = {
  tag_id: number;
  tag_name: string;
};
type TagBriefInfosQueryData = Array<TagInfo>;
const useTagInfosQuery = (
  { tagType }: { tagType: string },
  options?: ApiQueryOptions<TagBriefInfosQueryData>
) => {
  return useQuery<AxiosResponse<TagBriefInfosQueryData, any>, AxiosError>(
    ["tagInfos", tagType],
    () => {
      return baseAxios.get("/tag/infos", {
        params: { tag_type: tagType },
      });
    },
    options
  );
};

export type { TagInfo as Tag };
export { useTagInfosQuery };
