import { ReactElement, FC } from "react";
import { Slide, useScrollTrigger } from "@mui/material";

type Props = {
  children: ReactElement;
};

export default function HideOnScroll({ children }: Props) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}
