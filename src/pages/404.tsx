import { Button, Container, Typography } from "@mui/material";
import Link from "next/link";

export default function Custom404() {
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
      <Typography
        color="secondary"
        variant="h1"
        fontWeight="400"
        sx={{ mb: 2 }}
      >
        该页面不存在
      </Typography>

      <Link href="/" passHref>
        <Button component="a" size="large" variant="contained">
          返回主页
        </Button>
      </Link>
    </Container>
  );
}
