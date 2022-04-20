import { ReactElement, ReactNode, useState, useEffect } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";

import { darkTheme } from "src/themes";
import createEmotionCache from "src/utils/createEmotionCache";
import { getUserIdFromToken } from "src/utils/token";
import { useStore } from "src/hooks";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type MyAppProps = AppProps & {
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
};

const clientSideEmotionCache = createEmotionCache();

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const [queryClient] = useState(() => new QueryClient());

  // set user state if localstorage has token
  const userId = useStore((store) => store.userId);
  const userLogin = useStore((store) => store.userLogin);
  useEffect(() => {
    if (userId === null) {
      const userIdFromToken = getUserIdFromToken();
      if (userIdFromToken !== null) {
        userLogin(userIdFromToken);
      }
    }
  }, [userId, userLogin]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline enableColorScheme />
        <SnackbarProvider
          preventDuplicate
          maxSnack={3}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              {getLayout(<Component {...pageProps} />)}
            </Hydrate>
          </QueryClientProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
