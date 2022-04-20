import { Box, Button, Container, Typography } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import Link from "next/link";
import { NextSeo } from "next-seo";

import { HOME_URL } from "src/variants";

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            overflowWrap: "break-word",
            color: (t) => t.palette.error.light,
          }}
        >
          <ErrorOutline
            sx={{
              fontSize: {
                xs: "2rem",
                lg: "2.6rem",
              },
              marginRight: "4px",
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: {
                xs: "2rem",
                lg: "2.6rem",
              },
            }}
          >
            {message}
          </Typography>
        </Box>
        {reason === undefined ? (
          <div style={{ marginBottom: "32px" }} />
        ) : (
          <Typography
            variant="body1"
            sx={{
              fontSize: {
                xs: "1.5rem",
                lg: "2rem",
              },
              marginBottom: "32px",
            }}
          >
            {reason}
          </Typography>
        )}
        <Link
          href={HOME_URL}
          passHref
        >
          <Button
            component="a"
            size="large"
            variant="contained"
          >
            返回主页
          </Button>
        </Link>
        <div style={{ flexGrow: 3 }} />
      </Container>
    </>
  );
}

export default ErrorPage;
