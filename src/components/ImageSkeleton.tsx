import { useState, ImgHTMLAttributes, FC } from "react";
import { Skeleton, Fade } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  paddingTop: string;
  width?: string;
  alt?: string;
  timeout?: number;
}

const ImageSkeleton: FC<Props> = ({
  src,
  paddingTop,
  width = "100%",
  alt = "图片",
  timeout = 300,
}) => {
  const theme = useTheme();

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        paddingTop: paddingTop,
        width: width,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Fade
        in={imageLoaded}
        timeout={timeout}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "100%",
            height: "100%",
            backgroundSize: "contain",
            objectFit: "contain",
          }}
        >
          <Image
            src={src}
            alt={alt}
            layout="fill"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </Fade>
      <Fade
        in={!imageLoaded}
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

export default ImageSkeleton;
