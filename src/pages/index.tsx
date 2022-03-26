import { NextSeo } from "next-seo";
import { Typography } from "@mui/material";

function HomePage() {
  return (
    <>
      <Typography>IGame主页</Typography>
    </>
  );
}

function SeoPage() {
  return (
    <>
      <NextSeo
        title="优雅的游戏下载网站 - IGame"
        description="你一直想要的游戏下载网站，简单，快速且优雅"
      />
      <HomePage />
    </>
  );
}

export default SeoPage;
