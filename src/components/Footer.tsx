import { Container, Typography, Link as MuiLink, Box } from "@mui/material";
import Link from "next/link";

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
              passHref
            >
              <MuiLink
                color="secondary"
                underline="hover"
                target="_blank"
                rel="noopener"
              >
                IGame资源站
              </MuiLink>
            </Link>
          </Typography>
        </Box>
        <Box flexGrow="1">
          <Typography>
            与其他同好交流，有问题询问作者，请加入
            <Link
              href="https://jq.qq.com/?_wv=1027&k=vH1V9RF1"
              passHref
            >
              <MuiLink
                color="secondary"
                underline="hover"
                target="_blank"
                rel="noopener"
              >
                IGame交流群
              </MuiLink>
            </Link>
          </Typography>
        </Box>
      </Container>
    </footer>
  );
}
