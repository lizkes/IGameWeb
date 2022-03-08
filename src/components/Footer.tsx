import { Container, Typography, Link, Box } from "@mui/material";

export default function Footer() {
  return (
    <footer>
      <Container
        sx={{
          display: "flex",
        }}
      >
        <Box flexGrow="1">
          <Typography>
            获取更多免费游戏跟丰富MOD，请访问
            <Link
              href="https://share.igame.ml"
              underline="hover"
              target="_blank"
              rel="noopener"
            >
              IGame资源站
            </Link>
          </Typography>
        </Box>
        <Box flexGrow="1">
          <Typography>
            与其他同好交流，有问题询问作者，请加入
            <Link
              href="https://jq.qq.com/?_wv=1027&k=vH1V9RF1"
              underline="hover"
              target="_blank"
              rel="noopener"
            >
              IGame交流群
            </Link>
          </Typography>
        </Box>
      </Container>
    </footer>
  );
}
