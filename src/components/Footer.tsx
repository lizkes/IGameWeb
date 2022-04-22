import { Container, Typography, Box } from "@mui/material";

import { MuiLink } from "src/components";

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
            <MuiLink
              href="https://share.igame.ml"
              target="_blank"
              rel="noopener"
            >
              IGame资源站
            </MuiLink>
          </Typography>
        </Box>
        <Box flexGrow="1">
          <Typography>
            与其他同好交流，有问题询问作者，请加入
            <MuiLink
              href="https://jq.qq.com/?_wv=1027&k=vH1V9RF1"
              target="_blank"
              rel="noopener"
            >
              IGame资源站
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </footer>
  );
}
