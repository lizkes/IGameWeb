import { AxiosError } from "axios";

import { toDate, dateFormat } from "src/utils/time";

type BackendError = {
  code: number;
  cause: string;
  content: string;
};

type ErrorInfo = {
  code: number;
  cause: string;
  content: string;
  isClientErorr: boolean;
};

const handleAxiosError = (error?: AxiosError | null): ErrorInfo => {
  let info: ErrorInfo = {
    code: -1,
    cause: "",
    content: "未预期的错误",
    isClientErorr: false,
  };
  if (error === null || error === undefined) {
    return info;
  }

  if (error.response) {
    if (error.response.status === 400) {
      const backendError = error.response.data as BackendError;
      info = {
        code: backendError.code,
        cause: backendError.cause,
        content: backendError.content,
        isClientErorr: true,
      };
    } else if (error.response.status === 500) {
      const backendError = error.response.data as BackendError;
      info = {
        code: backendError.code,
        cause: backendError.cause,
        content:
          backendError.code === 500
            ? `服务器维护中, 预计${dateFormat(
                toDate(backendError.content)
              )}完成`
            : backendError.content,
        isClientErorr: false,
      };
    } else if (error.response.status === 503) {
      info.content = "访问频率过快，请稍后再试";
    } else {
      info.content = error.response.data;
    }
  } else if (error.request) {
    info.content = "服务器未响应";
  } else {
    info.content = `未预期的错误：${error.message}`;
  }

  return info;
};

export { handleAxiosError };
