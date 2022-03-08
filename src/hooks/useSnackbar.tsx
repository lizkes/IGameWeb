import { forwardRef, useCallback, ReactNode, useMemo } from "react";
import {
  Box,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Close, Done, ErrorOutline, InfoOutlined } from "@mui/icons-material";
import {
  SnackbarContent,
  useSnackbar as useNotistackSnackbar,
} from "notistack";

type SnackbarVariant = "info" | "success" | "error";
type SnackbarProps = {
  id: string | number;
  title: string;
  content?: string;
  variant?: SnackbarVariant;
};

const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(function Snackbar(
  { id, title, content, variant },
  ref
) {
  if (variant === undefined) {
    variant = "info";
  }

  const { closeSnackbar } = useNotistackSnackbar();
  const theme = useTheme();
  const breakpointUpMd = useMediaQuery(theme.breakpoints.up("md"), {
    noSsr: true,
  });

  const TitleIcon = useMemo(() => {
    switch (variant) {
      case "info":
        return <InfoOutlined />;
      case "success":
        return <Done />;
      case "error":
        return <ErrorOutline />;
    }
  }, [variant]);

  return (
    <SnackbarContent
      ref={ref}
      style={{
        width: breakpointUpMd ? "320px" : "260px",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          backgroundColor: (t) => {
            switch (variant) {
              case "info":
                return t.palette.primary.main;
              case "success":
                return t.palette.success.main;
              case "error":
                return t.palette.error.main;
            }
          },
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: "0px",
            right: "0px",
            height: "40px",
            width: "40px",
          }}
          onClick={() => closeSnackbar(id)}
        >
          <Close />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            overflowWrap: "break-word",
            padding: "16px 56px 8px 16px",
          }}
        >
          {TitleIcon}
          <Typography
            sx={{
              marginLeft: "4px",
              fontSize: {
                default: "1.2rem",
                large: "1.3rem",
              },
            }}
          >
            {title}
          </Typography>
        </Box>
        {content ? (
          <Typography
            sx={{
              width: "100%",
              padding: "0px 16px 16px 16px",
              overflowWrap: "break-word",
            }}
          >
            {content}
          </Typography>
        ) : null}
      </Paper>
    </SnackbarContent>
  );
});

const useSnackbar = () => {
  const { enqueueSnackbar } = useNotistackSnackbar();
  return (title: string, content?: string, variant?: SnackbarVariant) =>
    enqueueSnackbar(`${title}|${content}`, {
      content: (key, _) => (
        <Snackbar id={key} title={title} content={content} variant={variant} />
      ),
      autoHideDuration: variant === "error" ? 7000 : 4000,
      persist: false,
    });
};

export default useSnackbar;
