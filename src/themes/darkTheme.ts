import { createTheme } from "@mui/material/styles";
import { zhCN } from "@mui/material/locale";
import { blue, green, purple, red } from "@mui/material/colors";

const darkTheme = createTheme(
  {
    palette: {
      mode: "dark",
      primary: { main: purple[500], light: purple[400], dark: purple[600] },
      secondary: { main: blue[800], light: blue[600] },
      error: { main: red[800], light: red[400] },
      success: { main: green[600] },
      info: { main: blue[800], light: blue[600] },
      background: { default: "#111111", paper: "#2a2a2a" },
    },
    typography: {
      // fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif",
      fontFamily: "'Microsoft YaHei', sans-serif",
      h1: {
        fontSize: "3rem",
      },
    },
    components: {
      // MuiButton: {
      //   styleOverrides: {
      //     contained: {
      //       textTransform: "none",
      //       fontWeight: "400",
      //       fontSize: "1rem",
      //       border: `1px solid ${purple[400]}`,
      //       backgroundColor: purple[400],
      //       "&:hover": {
      //         backgroundColor: purple[400],
      //         filter: "brightness(1.1)",
      //       },
      //     },
      //     outlined: {
      //       textTransform: "none",
      //       fontWeight: "400",
      //       fontSize: "1rem",
      //       borderColor: purple[400],
      //       color: purple[400],
      //       borderWidth: "2px",
      //       filter: "brightness(1.2)",
      //       "&:hover": {
      //         borderColor: purple[400],
      //         borderWidth: "2px",
      //         filter: "brightness(1.2)",
      //       },
      //     },
      //   },
      // },
      MuiChip: {
        styleOverrides: {
          root: {
            cursor: "pointer",
            transition: "all 150ms",
            "&:hover": {
              filter: "brightness(75%)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  },
  zhCN
);

export default darkTheme;
