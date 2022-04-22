import { Container, Typography } from "@mui/material";
import { NextSeo } from "next-seo";

import { HOME_URL } from "src/variants";
import { MuiLinkButton } from "src/components";

function NotFoundPage() {
  return (
    <>
      <NextSeo
        title="页面不存在 - IGame"
        description="你一直想要的游戏下载网站，简单，快速且优雅"
      />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography
          color="primary"
          variant="h1"
          fontWeight="400"
          sx={{ mb: 4 }}
        >
          页面不存在
        </Typography>
        <MuiLinkButton
          href={HOME_URL}
          variant="contained"
          size="large"
        >
          返回主页
        </MuiLinkButton>
      </Container>
    </>
  );
}

export default NotFoundPage;
