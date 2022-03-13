import * as React from "react";
import Link from "next/link";
import { IconButton, Button, Drawer, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

export default function HeaderDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <IconButton aria-label="菜单" onClick={() => setOpen(!open)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          role="presentation"
          onClick={() => setOpen(false)}
          display="flex"
          flexDirection="column"
          width="240px"
          padding="24px"
        >
          <Button
            variant="outlined"
            size="large"
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              paddingLeft: "16px",
              mb: "12px",
            }}
          >
            <SearchIcon sx={{ mr: 1 }} />
            搜索 IGame
          </Button>
          <Link href="/login" passHref>
            <Button
              component="a"
              variant="outlined"
              size="large"
              sx={{ mb: "12px" }}
            >
              登陆
            </Button>
          </Link>
          <Link href="/register" passHref>
            <Button component="a" variant="contained" size="large">
              注册
            </Button>
          </Link>
        </Box>
      </Drawer>
    </>
  );
}
