import {
  ReactNode,
  CSSProperties,
  HTMLAttributeAnchorTarget,
  MouseEventHandler,
} from "react";
import { Link as MuiNormalLink, SxProps, Theme } from "@mui/material";
import Link from "next/link";

type Props = {
  href: string;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "button"
    | "overline"
    | "inherit";
  color?:
    | "inherit"
    | "secondary"
    | "primary"
    | "success"
    | "error"
    | "info"
    | "warning";
  underline?: "none" | "hover" | "always";
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
  children?: ReactNode;
  sx?: SxProps<Theme>;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

function MuiLink({ href, underline = "hover", ...others }: Props) {
  return (
    <Link
      href={href}
      passHref
    >
      <MuiNormalLink
        underline={underline}
        {...others}
      />
    </Link>
  );
}

export default MuiLink;
