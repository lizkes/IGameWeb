import { Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import { NextSeo } from "next-seo";

import { HOME_URL } from "src/variants";

function NotFoundPage() {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography color="primary" variant="h1" fontWeight="400" sx={{ mb: 4 }}>
        页面不存在
      </Typography>

      <Link href={HOME_URL} passHref>
        <Button component="a" size="large" variant="contained">
          返回主页
        </Button>
      </Link>
    </Container>
  );
}

function SeoPage() {
  return (
    <>
      <NextSeo
        title="页面不存在 - IGame"
        description="你一直想要的游戏下载网站，简单，快速且优雅"
      />
      <NotFoundPage />
    </>
  );
}

export default SeoPage;
