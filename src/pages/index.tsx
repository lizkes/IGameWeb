import { NextSeo } from "next-seo";
import { Typography } from "@mui/material";

function HomePage() {
  return (
    <>
      <NextSeo
        title="优雅的游戏下载网站 - IGame"
        description="你一直想要的游戏下载网站，简单，快速且优雅"
      />
      <Typography>IGame主页</Typography>
    </>
  );
}

export default HomePage;
