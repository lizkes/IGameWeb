import { ReactElement, ReactNode, useState, useEffect } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";

import "@fontsource/noto-sans-sc/chinese-simplified-300.css";
import "@fontsource/noto-sans-sc/chinese-simplified-400.css";
import "@fontsource/noto-sans-sc/chinese-simplified-500.css";
import "@fontsource/noto-sans-sc/chinese-simplified-700.css";

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
  // 获取query客户端
  const [queryClient] = useState(() => new QueryClient());
  const userId = useStore((store) => store.userId);
  const setUserId = useStore((store) => store.setUserId);
  // 将localstorage的token转换成用户状态
  useEffect(() => {
    if (userId === undefined) {
      const userIdFromToken = getUserIdFromToken() ?? undefined;
      if (userIdFromToken !== userId) {
        setUserId(userIdFromToken);
      }
    }
  }, [userId, setUserId]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
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
