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
      <Typography color="primary" variant="h1" fontWeight="400" sx={{ mb: 4 }}>
        页面不存在
      </Typography>

      <Link href="/" passHref>
        <Button component="a" size="large" variant="contained">
          返回主页
        </Button>
      </Link>
    </Container>
  );
}
