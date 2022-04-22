import { AppBar, Box, Container, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Search as SearchIcon } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

import { HOME_URL } from "src/variants";
import { HideOnScroll } from "src/components";

import AccountButton from "./AccountButton";

export default function BigHeader() {
  const theme = useTheme();

  return (
    <>
      <HideOnScroll>
        <AppBar
          sx={{
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            height: "64px",
            padding: "0px 24px",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                width: "120px",
              }}
            >
              <Link href={HOME_URL}>
                <a>
                  <Image
                    src="/igame.png"
                    alt="Logo"
                    width="326px"
                    height="100px"
                    layout="responsive"
                  />
                </a>
              </Link>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="primary"
            variant="outlined"
            sx={{
              textTransform: "none",
              width: "220px",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              paddingLeft: "16px",
              mr: 2,
              fontSize: "0.95rem",
              borderWidth: "2px",
              filter: "brightness(1.2)",
              "&:hover": {
                borderWidth: "2px",
                filter: "brightness(1.2)",
              },
            }}
          >
            <SearchIcon sx={{ mr: 1 }} />
            搜索 IGame
          </Button>
          <AccountButton />
        </AppBar>
      </HideOnScroll>
      <Box
        sx={{
          height: "64px",
        }}
      />
    </>
  );
}

// export default function BigHeader() {
//   const theme = useTheme();

//   return (
//     <>
//       <HideOnScroll>
//         <AppBar
//           sx={{
//             backgroundColor: theme.palette.background.paper,
//             boxShadow: "0",
//           }}
//         >
//           <Container
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               flexDirection: "row",
//               height: "64px",
//             }}
//           >
//             <Box sx={{ display: "flex" }}>
//               <Box
//                 sx={{
//                   width: "120px",
//                 }}
//               >
//                 <Link href="/">
//                   <a>
//                     <Image
//                       src="/igame.png"
//                       alt="Logo"
//                       width="326px"
//                       height="100px"
//                       layout="responsive"
//                     />
//                   </a>
//                 </Link>
//               </Box>
//             </Box>
//             <Box sx={{ flexGrow: 1 }} />
//             <Button
//               variant="outlined"
//               sx={{
//                 width: "220px",
//                 display: "flex",
//                 justifyContent: "start",
//                 alignItems: "center",
//                 paddingLeft: "16px",
//                 mr: 2,
//               }}
//             >
//               <SearchIcon sx={{ mr: 1 }} />
//               搜索 IGame
//             </Button>
//             <Link href="/login" passHref>
//               <Button component="a" variant="outlined" sx={{ mr: 1 }}>
//                 登陆
//               </Button>
//             </Link>
//             <Link href="/register" passHref>
//               <Button component="a" variant="contained">
//                 注册
//               </Button>
//             </Link>
//           </Container>
//         </AppBar>
//       </HideOnScroll>
//       <Box
//         sx={{
//           height: "64px",
//         }}
//       />
//     </>
//   );
// }
