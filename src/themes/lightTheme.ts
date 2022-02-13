import { createTheme } from "@mui/material/styles";
import { purple } from "@mui/material/colors";

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: "Noto Sans SC",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: purple[400],
          "&:hover": {
            filter: "brightness(1.1)",
            backgroundColor: purple[400],
          },
        },
        outlined: {
          borderColor: purple[400],
          color: purple[400],
          "&:hover": {
            borderColor: purple[400],
            filter: "brightness(1.1)",
          },
        },
      },
    },
  },
});

export default lightTheme;
