import { ReactNode, CSSProperties, MouseEventHandler } from "react";
import { Button, SxProps, Theme } from "@mui/material";
import Link from "next/link";

type Props = {
  href: string;
  size?: "small" | "large" | "medium";
  fullWidth?: boolean;
  variant?: "text" | "outlined" | "contained";
  color?:
    | "inherit"
    | "secondary"
    | "primary"
    | "success"
    | "error"
    | "info"
    | "warning";
  children?: ReactNode;
  sx?: SxProps<Theme>;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

function MuiLinkButton({ href, ...others }: Props) {
  return (
    <Link
      href={href}
      passHref
    >
      <Button
        component="a"
        {...others}
      />
    </Link>
  );
}

export default MuiLinkButton;
