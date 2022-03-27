import { ReactElement, useState, useMemo } from "react";
import {
  Container,
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
import { dehydrate, QueryClient } from "react-query";

import Layout from "src/components/Layout";
import ImageSkeleton from "src/components/ImageSkeleton";
import NormalSkeleton from "src/components/NormalSkeleton";
import MessagePage from "src/components/MessagePage";
import { useSnackbar, useStore } from "src/hooks";
import { ENTRY_NUMBER_PER_PAGE } from "src/variants";
import { handleAxiosError } from "src/utils/error";
import { dateFormat, toDate } from "src/utils/time";
import { expToLevel } from "src/utils/exp";
import { baseAxios } from "src/apis";
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
} as const;

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
        <ImageSkeleton src={src} alt={title} paddingTop="150%" />
        <CardContent
          sx={{
            padding: "4px",
          }}
        >
          <Box
            sx={{
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
          </Box>
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
      enabled: userId !== undefined,
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
    return undefined;
  }, [gameAmountQuery.data]);
  const gameBriefInfos = useMemo(() => {
    if (gameBriefInfosQuery.data) {
      return gameBriefInfosQuery.data.data;
    }
    return undefined;
  }, [gameBriefInfosQuery.data]);

  // 返回页面
  if (gameBriefInfosQuery.isLoading) {
    // 等待页面
    return (
      <Container
        maxWidth="xl"
        sx={{
          padding: {
            xs: "8px",
            lg: "16px",
          },
          height: "100%",
        }}
      >
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
              <Box>
                <NormalSkeleton paddingTop="150%" />
                <NormalSkeleton paddingTop="100px" />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  } else if (gameBriefInfos === undefined) {
    // 错误页面
    return <MessagePage message="获取游戏封面失败" variant="error" />;
  } else {
    // 正常页面
    return (
      <Container
        maxWidth="xl"
        sx={{
          padding: {
            xs: "8px",
            lg: "16px",
          },
          height: "100%",
        }}
      >
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
        {gameAmount === undefined ? null : (
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
      </Container>
    );
  }
}

function SeoPage({ pageId }: { pageId: number }) {
  return (
    <>
      <NextSeo
        title={`游戏库第${pageId}页 - IGame`}
        description="你一直想要的游戏下载网站，简单，快速且优雅"
      />
      <GamesPage pageId={pageId} />
    </>
  );
}

SeoPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SeoPage;

// https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await baseAxios.get("/app/amount", { params: { type: "game" } });
  // Get the paths we want to pre-render based on posts
  const pageAmount: number = Math.ceil(
    parseInt(res.data.amount) / ENTRY_NUMBER_PER_PAGE
  );
  const paths = [...Array(pageAmount).keys()].map((pageCount) => ({
    params: { pageId: (pageCount + 1).toString() },
  }));
  // https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-blocking
  return { paths, fallback: true };
}

// https://nextjs.org/docs/api-reference/data-fetching/get-static-props
export async function getStaticProps({
  params,
}: {
  params: { pageId: string };
}) {
  const queryClient = new QueryClient();
  await prefetchAppAmountQuery(queryClient, {
    appType: "game",
  });
  await prefetchAppBriefInfosQuery(queryClient, {
    appType: "game",
    offset: (parseInt(params.pageId) - 1) * ENTRY_NUMBER_PER_PAGE,
    limit: ENTRY_NUMBER_PER_PAGE,
    sortBy: "id",
    tagIds: [],
    dependAppId: null,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      pageId: parseInt(params.pageId),
    },
    revalidate: 28800,
  };
}
