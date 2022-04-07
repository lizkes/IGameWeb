import { FC } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { ErrorOutline, InfoOutlined } from "@mui/icons-material";
import Link from "next/link";

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
  return (
    <Container
      maxWidth="xl"
      sx={{
        padding: "16px",
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
          marginBottom: "16px",
          color: (t) =>
            variant === "info" ? t.palette.info.light : t.palette.error.light,
        }}
      >
        {variant === "info" ? (
          <InfoOutlined
            sx={{
              marginRight: "4px",
              fontSize: {
                xs: "2rem",
                lg: "2.6rem",
              },
            }}
          />
        ) : (
          <ErrorOutline
            sx={{
              marginRight: "4px",
              fontSize: {
                xs: "2rem",
                lg: "2.6rem",
              },
            }}
          />
        )}
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
      {returnHomeButton ? (
        <Link href={HOME_URL} passHref>
          <Button component="a" size="large" variant="contained">
            返回主页
          </Button>
        </Link>
      ) : null}
      <Box sx={{ flexGrow: 3 }} />
    </Container>
  );
};

export default MessagePage;
