import { useEffect, useRef, useState } from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

import { MarkdownParser } from "src/components";

type Props = {
  children: string;
};

function MarkdownOverflowBox({ children }: Props) {
  const parserRef = useRef<HTMLDivElement>(null);
  const [parserOverHeight, setParserOverHeight] = useState(false);
  const [parserCollpsed, setParserCollpsed] = useState(false);

  useEffect(() => {
    if (parserRef.current) {
      const imgNumber = parserRef.current.querySelectorAll("img").length;
      if (parserRef.current.clientHeight + imgNumber * 50 > 1000) {
        setParserOverHeight(true);
        setParserCollpsed(true);
      }
    }
  }, [children]);

  return (
    <Box
      sx={{
        position: "relative",
        margin: "0 auto",
        maxWidth: "800px",
      }}
    >
      <Box
        ref={parserRef}
        sx={{
          maxHeight: parserCollpsed ? "1000px" : "none",
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MarkdownParser>{children}</MarkdownParser>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: "56px",
          background:
            "rgba(0, 0, 0, 0) linear-gradient(rgba(18, 18, 18, 0), rgb(18, 18, 18)) repeat scroll 0% 0%",
          display: parserCollpsed ? "flex" : "none",
          height: "100px",
          width: "100%",
        }}
      />
      <ButtonBase
        sx={{
          width: "100%",
          height: "48px",
          backgroundColor: "#414141",
          borderRadius: "4px",
          marginTop: "8px",
          opacity: "70%",
          "&:hover": {
            opacity: "100%",
          },
          transition: "all 150ms",
          display: parserOverHeight ? "flex" : "none",
        }}
        onClick={() => {
          setParserCollpsed(!parserCollpsed);
        }}
      >
        {parserCollpsed ? (
          <>
            <Typography>显示全部</Typography>
            <ArrowDropDown />
          </>
        ) : (
          <>
            <Typography>显示部分</Typography>
            <ArrowDropUp />
          </>
        )}
      </ButtonBase>
    </Box>
  );
}

export default MarkdownOverflowBox;
