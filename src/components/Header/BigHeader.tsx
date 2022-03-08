import Image from "next/image";
import Link from "next/link";
import { AppBar, Box, Container, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useStore } from "src/hooks";
import HideOnScroll from "src/components/HideOnScroll";

export default function BigHeader() {
  const userId = useStore((store) => store.userId);

  return (
    <>
      <HideOnScroll>
        <AppBar
          sx={{
            backgroundColor: "#2a2a2a",
            backgroundImage: "none",
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
                  width: "120px",
                }}
              >
                <Link href="/">
                  <a>
                    <Image
                      src="/igame.png"
                      alt="Logo"
                      width="326px"
                      height="100px"
                      layout="responsive"
                    />
                  </a>
                </Link>
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="outlined"
              sx={{
                width: "220px",
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                paddingLeft: "16px",
                mr: 2,
              }}
            >
              <SearchIcon sx={{ mr: 1 }} />
              搜索 IGame
            </Button>
            <Link href="/login" passHref>
              <Button component="a" variant="outlined" sx={{ mr: 1 }}>
                登陆
              </Button>
            </Link>
            <Link href="/register" passHref>
              <Button component="a" variant="contained">
                注册
              </Button>
            </Link>
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
