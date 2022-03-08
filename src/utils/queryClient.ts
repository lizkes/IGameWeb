import { QueryClient } from "react-query";
import { AxiosError } from "axios";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: (count, error) => {
        const axiosError = error as AxiosError;
        if (
          axiosError.response?.status === 500 ||
          axiosError.response?.status === 503
        ) {
          // 如果访问频率过快或者服务器错误，则不重试
          return false;
        } else {
          // 否则重试三次
          if (count === 3) {
            return true;
          }
          return false;
        }
      },
      // 废弃时间五分钟
      staleTime: 5 * 60 * 1000,
      // 过期时间一小时
      cacheTime: 60 * 60 * 1000,
    },
    mutations: {
      retry: (count, error) => {
        const axiosError = error as AxiosError;
        // 服务器错误不重试，否则重试三次
        if (
          axiosError.response?.status === 500 ||
          axiosError.response?.status === 503
        ) {
          // 如果访问频率过快或者服务器错误，则不重试
          return false;
        } else {
          // 否则重试三次
          if (count === 3) {
            return true;
          }
          return false;
        }
      },
    },
  },
});

export default queryClient;
