import type { ReactElement } from "react";
import { Box } from "@mui/material";

import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Header />
      <main style={{ flexGrow: 1, display: "flex" }}>{children}</main>
      <Footer />
    </Box>
  );
}
