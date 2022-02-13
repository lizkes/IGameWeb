import { useMemo, useState, FC, ChangeEvent } from "react";
import { Box, Grid, Pagination } from "@mui/material";

import { MessagePage, BasePage } from "@/page";
import { useUserInfoQuery } from "@/api/user";
import { useAppBriefInfosQuery, useAppAmountQuery } from "@/api/app";
import NormalSkeleton from "@/component/NormalSkeleton";

import { handleAxiosError } from "@/util/errorHandler";

interface Props {
  variant: "game" | "expansion";
}

const CoverPage: FC<Props> = ({ variant }) => {
  const [offset, setOffset] = useState(0);
  const userId = useAppSelector((s) => s.user.userId);
  const limit = useMemo(() => 20, []);
  const paginationCurrentPage = useMemo(() => {
    return Math.floor(offset / limit) + 1;
  }, [offset, limit]);

  const dependAppId = useMemo(() => {
    if (variant === "expansion" && params.id) {
      return parseInt(params.id, 10);
    } else {
      return undefined;
    }
  }, [variant, params.id]);

  const userInfoQuery = useUserInfoQuery(
    { userId: userId },
    {
      enabled: userId !== 0,
      onError: (error) => {
        const errorInfo = handleAxiosError(error);
        sendSnackbar("获取用户信息失败", errorInfo.content, "error");
      },
    }
  );
  const appAmountQuery = useAppAmountQuery(
    {
      appType: variant,
    },
    {
      onError: (error) => {
        const errorInfo = handleAxiosError(error);
        sendSnackbar(
          `获取${variant === "game" ? "游戏" : "拓展"}数量失败`,
          errorInfo.content,
          "error"
        );
      },
    }
  );
  const appBriefInfosQuery = useAppBriefInfosQuery(
    {
      appType: variant,
      offset: offset,
      limit: limit,
      sortBy: "id",
      tagIds: [],
      dependAppId: dependAppId,
    },
    {
      onError: (error) => {
        const errorInfo = handleAxiosError(error);
        sendSnackbar("获取封面信息失败", errorInfo.content, "error");
      },
    }
  );

  // 处理获取数据
  const userExp = useMemo(() => {
    if (userInfoQuery.data) {
      return userInfoQuery.data.data.exp;
    }
    return 0;
  }, [userInfoQuery.data]);
  const appAmount = useMemo(() => {
    if (appAmountQuery.data) {
      return appAmountQuery.data.data.amount;
    }
    return undefined;
  }, [appAmountQuery.data]);
  const appBriefInfos = useMemo(() => {
    if (appBriefInfosQuery.data) {
      return appBriefInfosQuery.data.data;
    }
    return undefined;
  }, [appBriefInfosQuery.data]);

  // 返回页面
  if (appBriefInfosQuery.isLoading) {
    return (
      <BasePage>
        <Grid
          container
          sx={{
            width: {
              default: "calc(100% + 8px)",
              desktop: "calc(100% + 12px)",
            },
            margin: {
              default: "0 -4px",
              desktop: "0 -6px",
            },
          }}
        >
          {[...Array(10).keys()].map((index) => (
            <Grid
              key={index}
              item
              sx={{
                padding: {
                  default: "0 4px",
                  desktop: "0 6px",
                },
                width: {
                  default: "100%",
                  phone: "50%",
                  large: "33.3%",
                  pad: "25%",
                  tablet: "20%",
                },
              }}
            >
              <Box>
                <NormalSkeleton
                  sx={{
                    paddingTop: "150%",
                    marginBottom: "4px",
                  }}
                />
                <NormalSkeleton
                  sx={{
                    paddingTop: "86px",
                    marginBottom: "8px",
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </BasePage>
    );
  } else if (appBriefInfos === undefined) {
    if (appBriefInfosQuery.error === null) {
      return <MessagePage message="该游戏不存在" variant="error" />;
    } else {
      return (
        <MessagePage
          message={handleAxiosError(appBriefInfosQuery.error).content}
          variant="error"
        />
      );
    }
  } else if (appBriefInfos.length === 0) {
    return (
      <MessagePage
        message="该游戏暂无拓展"
        variant="info"
        returnHomeButton={false}
      />
    );
  } else {
    return (
      <BasePage>
        <Grid
          container
          sx={{
            width: {
              default: "calc(100% + 8px)",
              desktop: "calc(100% + 12px)",
            },
            margin: {
              default: "0 -4px",
              desktop: "0 -6px",
            },
          }}
        >
          {appBriefInfos.map((info) => (
            <Grid
              key={info.id}
              item
              sx={{
                padding: {
                  default: "0 4px",
                  desktop: "0 6px",
                },
                width: {
                  default: "100%",
                  phone: "50%",
                  large: "33.3%",
                  pad: "25%",
                  tablet: "20%",
                },
              }}
            >
              {userInfoQuery.isLoading ? (
                <NormalSkeleton sx={{ paddingTop: "150%" }} />
              ) : (
                <CoverCard
                  id={info.id}
                  title={info.name}
                  tags={info.tags}
                  allowedExp={info.allowed_exp}
                  image={info.vertical_image}
                  updatedAt={info.updated_at}
                  userExp={userExp}
                  variant={variant}
                />
              )}
            </Grid>
          ))}
        </Grid>
        {appAmount === undefined || paginationCurrentPage === 1 ? null : (
          <Pagination
            color="primary"
            count={Math.ceil(appAmount / limit)}
            page={paginationCurrentPage}
            onChange={(_: ChangeEvent<unknown>, value: number) => {
              const newOffset = (value - 1) * limit;
              if (offset !== newOffset) {
                setOffset(newOffset);
              }
            }}
            sx={{
              padding: "16px 0",
              ".MuiPagination-ul": {
                justifyContent: "center",
              },
            }}
          />
        )}
      </BasePage>
    );
  }
};

export default CoverPage;
