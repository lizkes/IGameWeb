import Image from "next/image";
import { AppBar, Box, Typography, Container, Button } from "@mui/material";

import HideOnScroll from "src/components/HideOnScroll";

export default function Header() {
  return (
    <>
      <HideOnScroll>
        <AppBar
          sx={{
            backgroundColor: "#fff",
            boxShadow: "0",
            borderBottom: "1px solid black",
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
                  width: {
                    xs: "120px",
                    lg: "140px",
                  },
                }}
              >
                <Image
                  src="/Logo.png"
                  alt="Logo"
                  width="326px"
                  height="100px"
                  layout="responsive"
                />
              </Box>
              <Typography>IGame</Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="outlined" size="large" sx={{ mr: 1 }}>
              登陆
            </Button>
            <Button variant="contained" size="large">
              注册
            </Button>
          </Container>
        </AppBar>
      </HideOnScroll>
      <Box
        sx={{
          height: "64px",
          flexShrink: 0,
        }}
      />
    </>
  );
}

{
  /* <Container maxW="container.xl" display="flex" padding="3">
<Flex alignItems="center">
  <Text
    ml="2"
    fontSize="3xl"
    bgClip="text"
    fontWeight="bold"
    bgGradient="linear-gradient(135deg, rgba(173,45,241,1) 0%, rgba(226,45,241,1) 100%)"
  ></Text>
</Flex>
<Spacer />
<Button onClick={toggleColorMode} textStyle="button" mr="2">
  登陆
</Button>
<Button onClick={toggleColorMode} textStyle="button" variant="solid">
  注册
</Button>
</Container> */
}
