import { FC } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { ErrorOutline, InfoOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";

import { HOME_URL } from "src/variants";

type Props = {
  message: string;
  variant: "info" | "error";
  returnHomeButton?: boolean;
};

const MessagePage: FC<Props> = ({
  message,
  variant = "error",
  returnHomeButton = true,
}) => {
  const router = useRouter();

  return (
    <Container
      maxWidth="xl"
      sx={{
        padding: "16px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ flexGrow: 2 }} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          overflowWrap: "break-word",
          padding: "16px 0",
          color: (t) =>
            variant === "info" ? t.palette.info.light : t.palette.error.light,
        }}
      >
        {variant === "info" ? (
          <InfoOutlined
            sx={{
              marginRight: "4px",
            }}
          />
        ) : (
          <ErrorOutline
            sx={{
              marginRight: "4px",
            }}
          />
        )}
        <Typography
          variant="h1"
          sx={{
            fontSize: {
              xs: "1.4rem",
              xl: "1.6rem",
            },
            lineHeight: "1.6",
            textAlign: "center",
          }}
        >
          {message}
        </Typography>
      </Box>
      {returnHomeButton ? (
        <Button variant="contained" onClick={() => router.push(HOME_URL)}>
          返回主页
        </Button>
      ) : null}
      <Box sx={{ flexGrow: 3 }} />
    </Container>
  );
};

export default MessagePage;
