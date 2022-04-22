import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import BigHeader from "./BigHeader";
import SmallHeader from "./SmallHeader";

function Header() {
  const theme = useTheme();
  const gtSm = useMediaQuery(theme.breakpoints.up("sm"));

  if (gtSm) {
    return <BigHeader />;
  } else {
    return <SmallHeader />;
  }
}

export default Header;
