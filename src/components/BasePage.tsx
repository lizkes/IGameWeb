import type { ReactNode } from "react";
import { Container } from "@mui/material";

export default function BasePage({ children }: { children: ReactNode }) {
  return (
    <Container
      maxWidth="xl"
      sx={{
        padding: {
          xs: "8px",
          lg: "16px",
        },
        height: "100%",
      }}
    >
      {children}
    </Container>
  );
}
