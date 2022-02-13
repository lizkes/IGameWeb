import { ReactElement, FC } from "react";
import { Slide, useScrollTrigger } from "@mui/material";

type Props = {
  children: ReactElement;
};

const HideOnScroll: FC<Props> = ({ children }) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

export default HideOnScroll;
