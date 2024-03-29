import { FC } from "react";
import { Skeleton, Fade, Theme } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type Props = {
  paddingTop?: string;
  timeout?: number;
  width?: string;
  height?: string;
};

const NormalSkeleton: FC<Props> = ({
  paddingTop = "0px",
  timeout = 300,
  width = "100%",
  height = "100%",
}) => {
  const theme = useTheme();

  return (
    <div
      style={{
        position: "relative",
        width: width,
        height: height,
        paddingTop: paddingTop,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Fade
        in
        timeout={timeout}
      >
        <Skeleton
          animation="wave"
          variant="rectangular"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: theme.palette.background.paper,
          }}
        />
      </Fade>
    </div>
  );
};

export default NormalSkeleton;
