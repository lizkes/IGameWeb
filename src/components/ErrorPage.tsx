import { Container } from "@mui/material";
import { NextSeo } from "next-seo";

import { HOME_URL } from "src/variants";
import { ErrorComponent, MuiLinkButton } from "src/components";

type Props = {
  message: string;
  reason?: string;
};

function ErrorPage({ message, reason }: Props) {
  return (
    <>
      <NextSeo
        title="错误页面 - IGame"
        description="你一直想要的游戏下载网站，简单，快速且优雅"
      />
      <Container
        maxWidth="xl"
        sx={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ flexGrow: 2 }} />
        <ErrorComponent
          message={message}
          reason={reason}
        />
        <div style={{ marginBottom: "32px" }} />
        <MuiLinkButton
          href={HOME_URL}
          size="large"
          variant="contained"
        >
          返回主页
        </MuiLinkButton>
        <div style={{ flexGrow: 3 }} />
      </Container>
    </>
  );
}

export default ErrorPage;
