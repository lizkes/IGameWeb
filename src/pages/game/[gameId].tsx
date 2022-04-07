import { ReactElement, useMemo } from "react";
import { Grid, Typography, Divider } from "@mui/material";
import { NextSeo } from "next-seo";

import { useAppInfoQuery } from "src/apis/app";
import { handleAxiosError } from "src/utils/error";
import { useSnackbar } from "src/hooks";
import NormalSkeleton from "src/components/NormalSkeleton";
import Layout from "src/components/Layout";
import BasePage from "src/components/BasePage";
import MessagePage from "src/components/MessagePage";

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
    const m = [];
    for (const [index, video] of contentVideos.entries()) {
      m.push({
        type: "video",
        contentUrl: video,
        thumbUrl: contentVideoThumbs[index],
      });
    }
    for (const image of contentImages) {
      m.push({
        type: "image",
        contentUrl: image,
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
      <HTMLContentBox>{content}</HTMLContentBox>
      <Divider
        sx={{
          margin: "16px 0 24px 0",
        }}
      />
      <ResourceContainer appId={appId} />
    </Grid>
  );
}

function GamePage({ gameId }: { gameId: number }) {
  const sendSnackbar = useSnackbar();

  // 获取指定app信息
  const appInfoQuery = useAppInfoQuery(
    {
      id: gameId,
      type: "game",
    },
    {
      enabled: gameId !== undefined,
      onError: (error) => {
        const errorInfo = handleAxiosError(error);
        sendSnackbar("获取游戏详细信息失败", errorInfo.content, "error");
      },
    }
  );

  // 处理获取数据
  const appInfo = useMemo(() => {
    if (appInfoQuery.data) {
      return appInfoQuery.data.data;
    }
    return undefined;
  }, [appInfoQuery.data]);

  // 返回页面
  if (appInfoQuery.isLoading) {
    return (
      <>
        <NextSeo
          title="正在获取数据 - IGame"
          description="你一直想要的游戏下载网站，简单，快速且优雅"
        />
        <BasePage>
          <NormalSkeleton paddingTop="100%" />
        </BasePage>
      </>
    );
  } else if (appInfo === undefined) {
    // 错误页面
    return (
      <>
        <NextSeo
          title="错误页面"
          description="你一直想要的游戏下载网站，简单，快速且优雅"
        />
        <MessagePage message="获取游戏详细信息失败" variant="error" />
      </>
    );
  } else {
    return (
      <>
        <NextSeo
          title={`${appInfo.name} - IGame`}
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
            {appInfo.name}
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
              appId={appInfo.app_id}
              content={appInfo.long_description}
              contentImages={appInfo.content_images}
              contentVideos={appInfo.content_videos}
              contentVideoThumbs={appInfo.content_video_thumbs}
            />
            <RightGrid
              tags={appInfo.tags}
              title={appInfo.name}
              description={appInfo.short_description}
              view={appInfo.viewed}
              subscription={appInfo.subscribed}
              downloaded={appInfo.downloaded}
              image={appInfo.horizontal_image}
              updatedAt={appInfo.updated_at}
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
