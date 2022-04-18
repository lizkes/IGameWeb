import { ReactElement, useMemo, useState } from "react";
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
        <HtmlParser variant="description">{description}</HtmlParser>
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
          {variant === "game" ? (
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
          ) : null}
        </Box>
      </Box>
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
      enabled: gameId !== null,
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
    return null;
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
  } else if (appInfo === null) {
    // 错误页面
    return (
      <>
        <NextSeo
          title="错误页面"
          description="你一直想要的游戏下载网站，简单，快速且优雅"
        />
        <MessagePage
          message="获取游戏详细信息失败"
          variant="error"
        />
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
