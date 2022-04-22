import { useState, useEffect, useMemo, useRef, useCallback, FC } from "react";
import { useSwipeable } from "react-swipeable";
import { Box, Backdrop, Slide } from "@mui/material";
import { styled } from "@mui/material/styles";
import { NavigateBefore, NavigateNext, PlayArrow } from "@mui/icons-material";
import Image from "next/image";

import { VideoPlayer } from "src/components";

interface Props {
  medias: Array<Media>;
  timeout?: number;
}

interface Media {
  contentUrl: string;
  thumbUrl: string;
  type: string;
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

const MediaCarousel: FC<Props> = ({ timeout = 300, medias }) => {
  const [firstShow, setFirstShow] = useState(true);
  const [beforeActive, setBeforeActive] = useState(0);
  const [nowActive, setNowActive] = useState(0);
  const [alreadyActive, setAlreadyActive] = useState([0]);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [backdropImage, setBackdropImage] = useState("");
  const vmPlayerRefs = useRef<Array<any | null>>([]);

  const videoMedias = useMemo(
    () => medias.filter((v) => v.type === "video"),
    [medias]
  );
  const imageMedias = useMemo(
    () => medias.filter((v) => v.type === "image"),
    [medias]
  );

  const videoMediaItems = useMemo(
    () =>
      videoMedias.map((video, index) => (
        <VideoPlayer
          key={`video${index}`}
          src={video.contentUrl}
          poster={video.thumbUrl}
          hlsOptions={{
            maxBufferLength: 30,
          }}
          setRef={(ref) => {
            vmPlayerRefs.current[index] = ref;
          }}
        />
      )),
    [videoMedias]
  );

  const imageMediaItems = useMemo(
    () =>
      imageMedias.map((image, index) => (
        <div
          key={`image${index}`}
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
          }}
          onClick={() => {
            setBackdropImage(image.contentUrl);
            setBackdropOpen(true);
          }}
        >
          <Image
            src={image.contentUrl}
            alt={`图片${index}`}
            layout="fill"
          />
        </div>
      )),
    [imageMedias]
  );
  const thumbItem = useMemo(
    () =>
      medias.map((thumb, index) => (
        <div
          key={`thumb${index}`}
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
          }}
        >
          <Image
            src={thumb.thumbUrl}
            alt={`封面${index}`}
            layout="fill"
          />
        </div>
      )),
    [medias]
  );

  const nowActiveIsVideo = useMemo(
    () => nowActive < videoMedias.length,
    [nowActive, videoMedias]
  );

  const setActive = useCallback(
    (index: number) => {
      index %= medias.length;
      if (index < 0) index += medias.length;

      if (index !== nowActive) {
        if (nowActiveIsVideo) {
          // 暂停视频
          const activeVideoElement = vmPlayerRefs.current[nowActive].current;
          if (!activeVideoElement?.paused) {
            activeVideoElement?.pause();
          }
        }

        if (firstShow) {
          setFirstShow(false);
        }

        setBeforeActive(nowActive);
        setNowActive(index);
        if (!alreadyActive.includes(index)) {
          setAlreadyActive(alreadyActive.concat(index));
        }
      }
    },
    [alreadyActive, firstShow, medias.length, nowActive, nowActiveIsVideo]
  );

  const toBefore = useCallback(() => {
    setActive(nowActive - 1);
  }, [setActive, nowActive]);

  const toNext = useCallback(() => {
    setActive(nowActive + 1);
  }, [setActive, nowActive]);

  const isNext = useCallback(() => {
    if (nowActive === 0 && beforeActive === medias.length - 1) {
      return true;
    }
    if (nowActive === medias.length - 1 && beforeActive === 0) {
      return false;
    }
    if (nowActive > beforeActive) {
      return true;
    }
    return false;
  }, [beforeActive, nowActive, medias.length]);

  const getDirection = useCallback(
    (index: number) => {
      if (index === nowActive) {
        if (isNext()) {
          return "left";
        }
        return "right";
      }
      if (isNext()) {
        return "right";
      }
      return "left";
    },
    [isNext, nowActive]
  );

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => toNext(),
    onSwipedRight: () => toBefore(),
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        toBefore();
      } else if (e.key === "ArrowRight") {
        toNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toBefore, toNext]);

  return (
    <Box
      sx={{
        userSelect: "none",
      }}
    >
      <Box
        {...swipeHandlers}
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          paddingTop: "56.25%",
          "&:hover": {
            "& #nextButton": {
              opacity: 1,
              visibility: "visible",
            },
            "& #beforeButton": {
              opacity: 1,
              visibility: "visible",
            },
          },
        }}
      >
        {videoMediaItems.concat(imageMediaItems).map((item, index) =>
          alreadyActive.includes(index) ? (
            <Box
              key={`mediaItemContainer${index}`}
              sx={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                zIndex: index === nowActive ? 2 : 1,
              }}
            >
              <Slide
                direction={getDirection(index)}
                in={index === nowActive}
                timeout={firstShow ? 0 : timeout}
                easing={{
                  enter: "linear",
                  exit: "linear",
                }}
              >
                <Box>{item}</Box>
              </Slide>
            </Box>
          ) : null
        )}
        <NavButton
          id="beforeButton"
          sx={{
            left: 0,
            backgroundImage:
              "linear-gradient(to left, transparent, rgba(0,0,0,.4))",
            height: nowActiveIsVideo ? "calc(100% - 64px)" : "100%",
          }}
          role="button"
          tabIndex={-1}
          onClick={toBefore}
          aria-label="上一个"
        >
          <NavigateBefore
            sx={{
              width: "48px",
              height: "48px",
            }}
          />
        </NavButton>
        <NavButton
          id="nextButton"
          sx={{
            right: 0,
            backgroundImage:
              "linear-gradient(to right, transparent, rgba(0,0,0,.4))",
            height: nowActiveIsVideo ? "calc(100% - 64px)" : "100%",
          }}
          role="button"
          tabIndex={-1}
          onClick={toNext}
          aria-label="下一个"
        >
          <NavigateNext
            sx={{
              width: "48px",
              height: "48px",
            }}
          />
        </NavButton>
        <Backdrop
          open={backdropOpen}
          onClick={() => setBackdropOpen(false)}
          style={{
            zIndex: 2000,
            backgroundColor: "black",
          }}
        >
          <img
            alt="图片"
            src={backdropImage}
            style={
              windowHeight > windowWidth * 0.5625
                ? {
                    width: "100%",
                    cursor: "pointer",
                  }
                : {
                    height: "100%",
                    cursor: "pointer",
                  }
            }
          />
        </Backdrop>
      </Box>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: "14px",
          },
          padding: "8px 0",
        }}
      >
        {thumbItem.map((item, index) => (
          <Box
            key={`thumbItemContainer${index}`}
            sx={{
              margin: "6px",
              position: "relative",
              cursor: "pointer",
              borderRadius: "1px",
              "&:hover": {
                opacity: "100%",
                filter: "brightness(1.2)",
              },
              transition: "all 300ms, border 0ms",
              flex: {
                default: "0 0 25%",
                large: "0 0 20%",
                tablet: "0 0 16.67%",
              },
            }}
            role="button"
            tabIndex={0}
            style={{
              border: index === nowActive ? "2px solid white" : "",
              opacity: index === nowActive ? "100%" : "50%",
            }}
            onClick={() => setActive(index)}
          >
            {item}
            {medias[index].type === "video" && (
              <PlayArrow
                sx={{
                  position: "absolute",
                  width: {
                    default: "2rem",
                    large: "3rem",
                  },
                  height: {
                    default: "2rem",
                    large: "3rem",
                  },
                  top: {
                    default: "calc(50% - 1rem)",
                    large: "calc(50% - 1.5rem)",
                  },
                  left: {
                    default: "calc(50% - 1rem)",
                    large: "calc(50% - 1.5rem)",
                  },
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MediaCarousel;
