import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import BigHeader from "./BigHeader";
import SmallHeader from "./SmallHeader";

export default function Header() {
  const theme = useTheme();
  const gtSm = useMediaQuery(theme.breakpoints.up("sm"));

  if (gtSm) {
    return <BigHeader />;
  } else {
    return <SmallHeader />;
  }
}
