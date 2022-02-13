import { NextSeo } from "next-seo";
import { ReactElement } from "react";
import { Typography } from "@mui/material";
import Layout from "src/components/Layout";

function Home() {
  return (
    <>
      <NextSeo
        title="IGame 优雅的游戏下载网站"
        description="你一直想要的游戏下载网站，简单，快速且优雅"
      />
      <main>
        <Typography>IGame主页</Typography>
      </main>
    </>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
