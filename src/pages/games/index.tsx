import { ReactElement, useMemo } from "react";
import { dehydrate, QueryClient } from "react-query";
import {
  Grid,
  Box,
  Pagination,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import { Update, LockOutlined, LockOpen } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import Image from "next/image";

import Layout from "src/components/Layout";
import NormalSkeleton from "src/components/NormalSkeleton";
import BasePage from "src/components/BasePage";
import MessagePage from "src/components/MessagePage";
import { useSnackbar, useStore } from "src/hooks";
import { ENTRY_NUMBER_PER_PAGE } from "src/variants";
import { handleAxiosError } from "src/utils/error";
import { dateFormat, toDate } from "src/utils/time";
import { expToLevel } from "src/utils/exp";
import { Tag } from "src/apis/tag";
import { useUserInfoQuery } from "src/apis/user";
import {
  useAppBriefInfosQuery,
  useAppAmountQuery,
  prefetchAppAmountQuery,
  prefetchAppBriefInfosQuery,
} from "src/apis/app";

const chipStyle = {
  cursor: "pointer",
  transition: "all 150ms",
  "&:hover": {
    filter: "brightness(75%)",
  },
};

type GameCoverProps = {
  id: number;
  src: string;
  tags: Tag[];
  title: string;
  allowedExp: number;
  updatedAt: string;
  userExp: number;
};

function GameCover({
  id,
  src,
  tags,
  title,
  allowedExp,
  updatedAt,
  userExp,
}: GameCoverProps) {
  const router = useRouter();
  const theme = useTheme();

  const sortedTags = useMemo(
    () => [...tags].sort((a, b) => a.tag_id - b.tag_id),
    [tags]
  );

  return (
    <Card
      sx={{
        borderRadius: 0,
      }}
      onClick={() => router.push(`/game/${id}`)}
    >
      <CardActionArea>
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "150%",
          }}
        >
          <Image
            src={src}
            alt={title}
            layout="fill"
          />
        </div>
        <CardContent
          sx={{
            padding: "4px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "2px",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "1.1rem",
                  sm: "1.4rem",
                  xl: "1.6rem",
                },
              }}
            >
              {title}
            </Typography>
          </div>
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              justifyContent: "start",
              flexWrap: "wrap",
              rowGap: "2px",
              margin: "0 -2px 3px -2px",
            }}
          >
            {sortedTags.map((tag) => (
              <Chip
                sx={{
                  ...chipStyle,
                  margin: "0 2px",
                }}
                color="primary"
                size="small"
                key={tag.tag_id}
                label={tag.tag_name}
              />
            ))}
          </Box>
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              justifyContent: "space-between",
              marginBottom: "2px",
            }}
          >
            <Chip
              sx={chipStyle}
              icon={<Update />}
              color="secondary"
              size="small"
              label={dateFormat(toDate(updatedAt))}
            />
            <Chip
              icon={allowedExp > userExp ? <LockOutlined /> : <LockOpen />}
              sx={{
                ...chipStyle,
                paddingLeft: "2px",
                backgroundColor:
                  allowedExp > userExp
                    ? theme.palette.error.main
                    : theme.palette.success.main,
                "& .MuiChip-label": {
                  paddingLeft: "6px",
                },
              }}
              size="small"
              label={
                allowedExp && allowedExp !== 0
                  ? `${expToLevel(allowedExp)}级用户`
                  : "所有人"
              }
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function GamesPage({ pageId }: { pageId: number }) {
  const sendSnackbar = useSnackbar();
  const router = useRouter();
  const userId = useStore((store) => store.userId);

  // 查询API
  const userInfoQuery = useUserInfoQuery(
    { userId: userId! },
    {
      enabled: userId !== null,
      onError: (error) => {
        const errorInfo = handleAxiosError(error);
        sendSnackbar("获取用户信息失败", errorInfo.content, "error");
      },
    }
  );
  const gameAmountQuery = useAppAmountQuery(
    {
      appType: "game",
    },
    {
      onError: (error) => {
        const errorInfo = handleAxiosError(error);
        sendSnackbar(`获取游戏总数量失败`, errorInfo.content, "error");
      },
    }
  );
  const gameBriefInfosQuery = useAppBriefInfosQuery(
    {
      appType: "game",
      offset: (pageId - 1) * ENTRY_NUMBER_PER_PAGE,
      limit: ENTRY_NUMBER_PER_PAGE,
      sortBy: "id",
      tagIds: [],
      dependAppId: null,
    },
    {
      onError: (error) => {
        const errorInfo = handleAxiosError(error);
        sendSnackbar("获取游戏简略信息失败", errorInfo.content, "error");
      },
    }
  );
  // 处理API数据
  const userExp = useMemo(() => {
    if (userInfoQuery.data) {
      return userInfoQuery.data.data.exp;
    }
    return 0;
  }, [userInfoQuery.data]);
  const gameAmount = useMemo(() => {
    if (gameAmountQuery.data) {
      return gameAmountQuery.data.data.amount;
    }
    return null;
  }, [gameAmountQuery.data]);
  const gameBriefInfos = useMemo(() => {
    if (gameBriefInfosQuery.data) {
      return gameBriefInfosQuery.data.data;
    }
    return null;
  }, [gameBriefInfosQuery.data]);

  // 返回页面
  if (gameBriefInfosQuery.isLoading) {
    // 等待页面
    return (
      <>
        <NextSeo
          title={`游戏库第${pageId}页 - IGame`}
          description="你一直想要的游戏下载网站，简单，快速且优雅"
        />
        <BasePage>
          <Grid
            container
            sx={{
              width: {
                xs: "calc(100% + 8px)",
                sm: "calc(100% + 12px)",
                lg: "calc(100% + 16px)",
              },
              margin: {
                xs: "0 -4px",
                sm: "0 -6px",
                lg: "0 -8px",
              },
            }}
          >
            {[...Array(20).keys()].map((index) => (
              <Grid
                key={index}
                item
                sx={{
                  padding: {
                    xs: "4px",
                    sm: "6px",
                    lg: "8px",
                  },
                  width: {
                    xs: "50%",
                    sm: "33.3%",
                    md: "25%",
                    lg: "20%",
                  },
                }}
              >
                <div>
                  <NormalSkeleton paddingTop="150%" />
                  <NormalSkeleton paddingTop="100px" />
                </div>
              </Grid>
            ))}
          </Grid>
        </BasePage>
      </>
    );
  } else if (gameBriefInfos === null) {
    // 错误页面
    return (
      <>
        <NextSeo
          title="错误页面"
          description="你一直想要的游戏下载网站，简单，快速且优雅"
        />
        <MessagePage
          message="获取游戏封面失败"
          variant="error"
        />
      </>
    );
  } else {
    // 正常页面
    return (
      <>
        <NextSeo
          title={`游戏库第${pageId}页 - IGame`}
          description="你一直想要的游戏下载网站，简单，快速且优雅"
        />
        <BasePage>
          <Grid
            container
            sx={{
              width: {
                xs: "calc(100% + 8px)",
                sm: "calc(100% + 12px)",
                lg: "calc(100% + 16px)",
              },
              margin: {
                xs: "0 -4px",
                sm: "0 -6px",
                lg: "0 -8px",
              },
            }}
          >
            {gameBriefInfos.map((info) => (
              <Grid
                key={info.id}
                item
                sx={{
                  padding: {
                    xs: "4px",
                    sm: "6px",
                    lg: "8px",
                  },
                  width: {
                    xs: "50%",
                    sm: "33.3%",
                    md: "25%",
                    lg: "20%",
                  },
                }}
              >
                {userInfoQuery.isLoading ? (
                  <NormalSkeleton paddingTop="150%" />
                ) : (
                  <GameCover
                    id={info.id}
                    title={info.name}
                    tags={info.tags}
                    allowedExp={info.allowed_exp}
                    src={
                      info.vertical_image === ""
                        ? "https://ae01.alicdn.com/kf/H7bd229b05c61482e80de14869873b1f1Q.jpg"
                        : info.vertical_image
                    }
                    updatedAt={info.updated_at}
                    userExp={userExp}
                  />
                )}
              </Grid>
            ))}
          </Grid>
          {gameAmount === null ? null : (
            <Pagination
              color="primary"
              count={Math.ceil(gameAmount / ENTRY_NUMBER_PER_PAGE)}
              page={pageId}
              onChange={(_: any, value: number) => {
                if (value !== pageId) {
                  router.push(`/games/${pageId}`, undefined, {
                    shallow: true,
                  });
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
      </>
    );
  }
}

GamesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default GamesPage;

// https://nextjs.org/docs/api-reference/data-fetching/get-static-props
export async function getStaticProps() {
  const queryClient = new QueryClient();
  await prefetchAppAmountQuery(queryClient, {
    appType: "game",
  });
  await prefetchAppBriefInfosQuery(queryClient, {
    appType: "game",
    offset: 0,
    limit: ENTRY_NUMBER_PER_PAGE,
    sortBy: "id",
    tagIds: [],
    dependAppId: null,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      pageId: 1,
    },
    revalidate: 28800,
  };
}
