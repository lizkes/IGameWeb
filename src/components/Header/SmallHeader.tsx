import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AppBar, Box, Container, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import HideOnScroll from "src/components/HideOnScroll";

const HeaderDrawer = dynamic(() => import("./HeaderDrawer"));

export default function BigHeader() {
  const theme = useTheme();

  return (
    <>
      <HideOnScroll>
        <AppBar
          sx={{
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0",
          }}
        >
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              height: "64px",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  width: "36.8px",
                }}
              >
                <Link href="/">
                  <a>
                    <Image
                      src="/igame.svg"
                      alt="Logo"
                      width="100px"
                      height="100px"
                      layout="responsive"
                    />
                  </a>
                </Link>
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Link href="/register" passHref>
              <Button component="a" sx={{ mr: 1 }} variant="contained">
                注册
              </Button>
            </Link>
            <HeaderDrawer />
          </Container>
        </AppBar>
      </HideOnScroll>
      <Box
        sx={{
          height: "64px",
        }}
      />
    </>
  );
}
