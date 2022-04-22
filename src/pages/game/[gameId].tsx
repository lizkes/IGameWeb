import { ReactElement, useMemo, useState } from "react";
import { dehydrate, QueryClient } from "react-query";
import { Grid, Typography, Divider, Button, Box, Chip } from "@mui/material";
import { Update, Visibility, Favorite, Download } from "@mui/icons-material";
import { NextSeo } from "next-seo";

import { baseAxios } from "src/apis";
import { useAppInfoQuery, prefetchAppInfoQuery } from "src/apis/app";
import { handleAxiosError } from "src/utils/error";
import { dateFormat, toDate } from "src/utils/time";
import {
  NormalSkeleton,
  Layout,
  BasePage,
  ErrorPage,
  MediaCarousel,
  MarkdownOverflowBox,
  MarkdownParser,
  ImageSkeleton,
  ResourceContainer,
  MuiLinkButton,
} from "src/components";
import { Media } from "src/components/MediaCarousel";

type Tag = {
  tag_id: number;
  tag_name: string;
};

type RightGridProps = {
  gameId: number;
  tags: Array<Tag>;
  title: string;
  shortDescription: string;
  view: number;
  subscription: number;
  downloaded: number;
  image: string;
  updatedAt: string;
};

function RightGrid({
  gameId,
  tags,
  title,
  shortDescription,
  view,
  subscription,
  downloaded,
  image,
  updatedAt,
}: RightGridProps) {
  const [rightGridRef, setRightGridRef] = useState<HTMLDivElement | null>(null);

  return (
    <Grid
      item
      ref={(newRef) => setRightGridRef(newRef)}
      sx={{
        order: {
          default: 0,
          pad: 2,
        },
        position: "relative",
        padding: "0 12px",
        width: {
          default: "100%",
          pad: "30%",
          tablet: "25%",
        },
      }}
    >
      <Box
        sx={{
          position: {
            pad: "fixed",
          },
          width: {
            default: "100%",
            pad: (rightGridRef?.clientWidth ?? 24) - 24,
          },
        }}
      >
        <ImageSkeleton
          src={image}
          paddingTop="57.31%"
          alt={title}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: "2px",
            margin: "12px 0 0 0",
          }}
        >
          <Box>
            <Chip
              sx={{ margin: "0 2px" }}
              icon={<Visibility />}
              color="secondary"
              size="small"
              label={view}
            />
            <Chip
              sx={{ margin: "0 2px" }}
              icon={<Favorite />}
              color="secondary"
              size="small"
              label={subscription}
            />
            <Chip
              sx={{ margin: "0 2px" }}
              icon={<Download />}
              color="secondary"
              size="small"
              label={downloaded}
            />
          </Box>
          <Chip
            sx={{ margin: "0 2px" }}
            icon={<Update />}
            color="secondary"
            size="small"
            label={dateFormat(toDate(updatedAt))}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            flexWrap: "wrap",
            rowGap: "2px",
            margin: "6px 0 12px 0",
          }}
        >
          {tags.map((tag) => (
            <Chip
              sx={{ margin: "0 2px" }}
              color="primary"
              size="small"
              key={tag.tag_id}
              label={tag.tag_name}
            />
          ))}
        </Box>
        <MarkdownParser>{shortDescription}</MarkdownParser>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "16px 0 0 0",
          }}
        >
          <Button
            variant="contained"
            size="large"
            color="success"
            sx={{
              width: "100%",
              marginBottom: "8px",
            }}
            onClick={() =>
              document.querySelector("#ResourceContainer")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "center",
              })
            }
          >
            下载链接
          </Button>
          <MuiLinkButton
            href={`/expansions?game=${gameId}`}
            size="large"
            variant="contained"
            color="secondary"
          >
            相关拓展
          </MuiLinkButton>
        </Box>
      </Box>
    </Grid>
  );
}

function GamePage({ gameId }: { gameId: number }) {
  // 查询API
  const gameInfoQuery = useAppInfoQuery({
    id: gameId,
    type: "game",
  });

  // 处理API数据
  const gameInfo = useMemo(() => {
    if (gameInfoQuery.data) {
      return gameInfoQuery.data.data;
    }
    return null;
  }, [gameInfoQuery.data]);

  if (gameInfoQuery.isLoading) {
    // 等待页面
    return (
      <>
        <NextSeo
          title="正在加载 - IGame"
          description="你一直想要的游戏下载网站，简单，快速且优雅"
        />
        <BasePage>
          <NormalSkeleton paddingTop="100%" />
        </BasePage>
      </>
    );
  } else if (gameInfoQuery.isError) {
    // 错误页面
    return (
      <ErrorPage
        message="获取游戏详细信息失败"
        reason={handleAxiosError(gameInfoQuery.error).content}
      />
    );
  } else {
    const medias: Array<Media> = [];
    for (const [index, video] of gameInfo!.content_videos.entries()) {
      medias.push({
        type: "video",
        mediaUrl: video,
        thumbUrl: gameInfo!.content_video_thumbs[index],
      });
    }
    for (const image of gameInfo!.content_images) {
      medias.push({
        type: "image",
        mediaUrl: image,
        thumbUrl: image,
      });
    }

    return (
      <>
        <NextSeo
          title={`${gameInfo!.name} - IGame`}
          description="你一直想要的游戏下载网站，简单，快速且优雅"
        />
        <BasePage>
          <Typography
            variant="h1"
            fontWeight="bold"
            sx={{
              fontSize: {
                default: "2.125rem",
                large: "3rem",
              },
              lineHeight: "1.25",
              letterSpacing: "0em",
              "&::before": {
                content: "'《'",
              },
              "&::after": {
                content: "'》'",
              },
            }}
          >
            {gameInfo!.name}
          </Typography>
          <Divider
            sx={{
              margin: "16px 0 24px 0",
            }}
          />
          <Grid
            container
            sx={{
              width: {
                default: "calc(100% + 16px)",
                tablet: "calc(100% + 24px)",
              },
              margin: {
                default: "0 -8px",
                tablet: "0 -12px",
              },
            }}
          >
            <Grid
              item
              sx={{
                order: 1,
                padding: "0 12px",
                width: {
                  default: "100%",
                  pad: "70%",
                  tablet: "75%",
                },
              }}
            >
              <Divider
                sx={{
                  display: {
                    default: "block",
                    pad: "none",
                  },
                  margin: {
                    default: "24px 0",
                    pad: "0",
                  },
                }}
              />
              <MediaCarousel medias={medias} />
              <Divider
                sx={{
                  margin: "24px 0",
                }}
              />
              <MarkdownOverflowBox>
                {gameInfo!.long_description}
              </MarkdownOverflowBox>
            </Grid>
            <RightGrid
              gameId={gameId}
              tags={gameInfo!.tags}
              title={gameInfo!.name}
              shortDescription={gameInfo!.short_description}
              view={gameInfo!.viewed}
              subscription={gameInfo!.subscribed}
              downloaded={gameInfo!.downloaded}
              image={gameInfo!.horizontal_image}
              updatedAt={gameInfo!.updated_at}
            />
          </Grid>
          <Divider
            sx={{
              margin: "16px 0 24px 0",
            }}
          />
          <ResourceContainer appId={gameInfo!.app_id} />
        </BasePage>
      </>
    );
  }
}

GamePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default GamePage;

// https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await baseAxios.get("/app/amount", { params: { type: "game" } });
  const paths = [...Array(res.data.amount).keys()].map((gameCount) => ({
    params: { gameId: (gameCount + 1).toString() },
  }));
  // https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-blocking
  return { paths, fallback: true };
}

// https://nextjs.org/docs/api-reference/data-fetching/get-static-props
export async function getStaticProps({
  params,
}: {
  params: { gameId: string };
}) {
  const queryClient = new QueryClient();
  await prefetchAppInfoQuery(queryClient, {
    id: parseInt(params.gameId),
    type: "game",
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      gameId: parseInt(params.gameId),
    },
    revalidate: 28800,
  };
}
