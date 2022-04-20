import { dehydrate, QueryClient } from "react-query";

import { ENTRY_NUMBER_PER_PAGE } from "src/variants";
import {
  prefetchAppAmountQuery,
  prefetchAppBriefInfosQuery,
} from "src/apis/app";

import GamesPage from "./[pageId]";

export default GamesPage;

// https://nextjs.org/docs/api-reference/data-fetching/get-static-props
export async function getStaticProps() {
  const queryClient = new QueryClient();
  await prefetchAppAmountQuery(queryClient, {
    appType: "game",
  });
  await prefetchAppBriefInfosQuery(queryClient, {
    appType: "game",
    offset: 0,
    limit: ENTRY_NUMBER_PER_PAGE,
    sortBy: "id",
    tagIds: [],
    dependAppId: null,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      pageId: 1,
    },
    revalidate: 28800,
  };
}
