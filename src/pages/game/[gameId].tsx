import { ReactElement, useMemo, useState } from "react";
import { dehydrate, QueryClient } from "react-query";
import { Grid, Typography, Divider, Button, Box, Chip } from "@mui/material";
import { Update, Visibility, Favorite, Download } from "@mui/icons-material";
import { NextSeo } from "next-seo";

import { baseAxios } from "src/apis";
import { useAppInfoQuery, prefetchAppInfoQuery } from "src/apis/app";
import { handleAxiosError } from "src/utils/error";
import { dateFormat, toDate } from "src/utils/time";
import NormalSkeleton from "src/components/NormalSkeleton";
import Layout from "src/components/Layout";
import BasePage from "src/components/BasePage";
import ErrorPage from "src/components/ErrorPage";
import MediaCarousel, { Media } from "src/components/MediaCarousel";
import MarkdownOverflowBox from "src/components/MarkdownOverflowBox";
import MarkdownParser from "src/components/MarkdownParser";

type LeftGridProps = {
  appId: number;
  content: string;
  contentImages: Array<string>;
  contentVideos: Array<string>;
  contentVideoThumbs: Array<string>;
};

function LeftGrid({
  appId,
  content,
  contentImages,
  contentVideos,
  contentVideoThumbs,
}: LeftGridProps) {
  const medias = useMemo(() => {
    const m: Array<Media> = [];
    for (const [index, video] of contentVideos.entries()) {
      m.push({
        type: "video",
        mediaUrl: video,
        thumbUrl: contentVideoThumbs[index],
      });
    }
    for (const image of contentImages) {
      m.push({
        type: "image",
        mediaUrl: image,
        thumbUrl: image,
      });
    }
    return m;
  }, [contentImages, contentVideos, contentVideoThumbs]);

  return (
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
      <MarkdownOverflowBox>{content}</MarkdownOverflowBox>
      <Divider
        sx={{
          margin: "16px 0 24px 0",
        }}
      />
      <ResourceContainer appId={appId} />
    </Grid>
  );
}

const chipStyle = {
  cursor: "pointer",
  transition: "all 150ms",
  "&:hover": {
    filter: "brightness(75%)",
  },
  margin: "0 2px",
};

type Tag = {
  tag_id: number;
  tag_name: string;
};

type RightGridProps = {
  tags: Array<Tag>;
  title: string;
  description: string;
  view: number;
  subscription: number;
  downloaded: number;
  image: string;
  updatedAt: string;
};

function RightGrid({
  tags,
  title,
  description,
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
          alt={title}
          paddingTop="57.31%"
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
              sx={chipStyle}
              icon={<Visibility />}
              color="secondary"
              size="small"
              label={view}
            />
            <Chip
              sx={chipStyle}
              icon={<Favorite />}
              color="secondary"
              size="small"
              label={subscription}
            />
            <Chip
              sx={chipStyle}
              icon={<Download />}
              color="secondary"
              size="small"
              label={downloaded}
            />
          </Box>
          <Chip
            sx={chipStyle}
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
              sx={chipStyle}
              color="primary"
              size="small"
              key={tag.tag_id}
              label={tag.tag_name}
            />
          ))}
        </Box>
        <MarkdownParser>{description}</MarkdownParser>
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
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: blue[800],
              transition: "all 150ms",
              width: "100%",
              "&:hover": {
                filter: "brightness(75%)",
                backgroundColor: blue[800],
              },
            }}
            onClick={() => navigate(`${location.pathname}/expansion`)}
          >
            相关拓展
          </Button>
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
            <LeftGrid
              appId={gameInfo!.app_id}
              content={gameInfo!.long_description}
              contentImages={gameInfo!.content_images}
              contentVideos={gameInfo!.content_videos}
              contentVideoThumbs={gameInfo!.content_video_thumbs}
            />
            <RightGrid
              tags={gameInfo!.tags}
              title={gameInfo!.name}
              description={gameInfo!.short_description}
              view={gameInfo!.viewed}
              subscription={gameInfo!.subscribed}
              downloaded={gameInfo!.downloaded}
              image={gameInfo!.horizontal_image}
              updatedAt={gameInfo!.updated_at}
            />
          </Grid>
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
