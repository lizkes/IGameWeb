import { ReactNode, FC } from "react";
import { Badge } from "@mui/material";
import { purple } from "@mui/material/colors";
import { keyframes } from "@emotion/react";

type Props = {
  children: ReactNode;
  color?: any;
  animation?: boolean;
  invisible?: boolean;
};

const ripple = keyframes({
  "0%": {
    transform: "scale(.8)",
    opacity: 1,
  },
  "100%": {
    transform: "scale(3)",
    opacity: 0,
  },
});

const FlashingBadge: FC<Props> = ({
  children,
  color = purple[500],
  animation = true,
  invisible = false,
}) => {
  return (
    <Badge
      invisible={invisible}
      sx={{
        "& .MuiBadge-badge": {
          backgroundColor: color,
          boxShadow: "0 0 0 2px #2a2a2a",
          margin: "0 6px 6px 0",
          "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: animation ? `${ripple} 1.2s infinite ease-in-out` : null,
            border: `1px solid ${color}`,
            content: "''",
          },
        },
      }}
      variant="dot"
      overlap="circular"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      {children}
    </Badge>
  );
};

export default FlashingBadge;
