import { Box, Button, Container, Typography } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

type Props = {
  message: string;
  reason?: string;
};

function ErrorComponent({ message, reason }: Props) {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          overflowWrap: "break-word",
          color: (t) => t.palette.error.light,
        }}
      >
        <ErrorOutline
          sx={{
            fontSize: {
              xs: "2rem",
              lg: "2.6rem",
            },
            marginRight: "4px",
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: {
              xs: "2rem",
              lg: "2.6rem",
            },
          }}
        >
          {message}
        </Typography>
      </Box>
      {reason !== undefined ? (
        <Typography
          variant="body1"
          sx={{
            fontSize: {
              xs: "1.5rem",
              lg: "2rem",
            },
          }}
        >
          {reason}
        </Typography>
      ) : null}
    </div>
  );
}

export default ErrorComponent;
