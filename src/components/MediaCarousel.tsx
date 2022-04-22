import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { Box, Backdrop, Slide } from "@mui/material";
import { styled } from "@mui/material/styles";
import { NavigateBefore, NavigateNext, PlayArrow } from "@mui/icons-material";
import Image from "next/image";

import { VideoPlayer } from "src/components";

interface Props {
  medias: Array<Media>;
}
interface Media {
  type: "video" | "image";
  mediaUrl: string;
  thumbUrl: string;
}

const NavButton = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  width: "48px",
  height: "100%",
  opacity: 0,
  display: theme.breakpoints.up("lg") ? "flex" : "none",
  visibility: "hidden",
  cursor: "pointer",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 3,
  transition: "all 300ms",
}));

function MediaCarousel({ medias }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [backdropOpen, setBackdropOpen] = useState(false);

  const thumbs = useMemo(
    () =>
      medias.map((media, index) => (
        <>
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "56.25%",
            }}
          >
            <Image
              src={media.thumbUrl}
              alt={`封面${index}`}
              layout="fill"
            />
          </div>
          {media.type === "video" && (
            <PlayArrow
              sx={{
                position: "absolute",
                width: {
                  xs: "2rem",
                  lg: "3rem",
                },
                height: {
                  xs: "2rem",
                  lg: "3rem",
                },
                top: {
                  xs: "calc(50% - 1rem)",
                  lg: "calc(50% - 1.5rem)",
                },
                left: {
                  xs: "calc(50% - 1rem)",
                  lg: "calc(50% - 1.5rem)",
                },
              }}
            />
          )}
        </>
      )),
    [medias]
  );

  return (
    <div style={{ userSelect: "none" }}>
      <div style={{ display: "flex", overflowX: "auto", padding: "8px 0" }}>
        {medias.map((_, index) => (
          <Box
            key={`thumb${index}`}
            sx={{
              margin: "6px",
              position: "relative",
              cursor: "pointer",
              border: index === currentIndex ? "2px solid white" : "initial",
              opacity: index === currentIndex ? "100%" : "50%",
              borderRadius: "1px",
              "&:hover": {
                opacity: "100%",
                filter: "brightness(1.2)",
              },
              transition: "all 300ms, border 0ms",
              flex: {
                xs: "0 0 25%",
                lg: "0 0 20%",
              },
            }}
            role="button"
            tabIndex={0}
            onClick={() => setCurrentIndex(index)}
          >
            {thumbs[index]}
          </Box>
        ))}
      </div>
    </div>
  );
}

export default MediaCarousel;
export type { Media };
