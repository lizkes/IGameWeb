import { isValidToken } from "src/utils/token";

// token start
function getAccessToken(): string | undefined {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken && isValidToken(accessToken)) {
    return accessToken;
  }
  return undefined;
}
function getRefreshToken(): string | undefined {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken && isValidToken(refreshToken)) {
    return refreshToken;
  }
  return undefined;
}
function setAccessToken(token?: string) {
  if (token === undefined) {
    localStorage.removeItem("accessToken");
  } else {
    localStorage.setItem("accessToken", token);
  }
}
function setRefreshToken(token?: string) {
  if (token === undefined) {
    localStorage.removeItem("refreshToken");
  } else {
    localStorage.setItem("refreshToken", token);
  }
}
// token end

// readedLocalNoticeIds start
const getReadedLocalNoticeIds = (): Array<number> => {
  const item = localStorage.getItem("readedLocalNoticeIds");
  if (item) {
    return JSON.parse(item) as Array<number>;
  }
  return [];
};
const setReadedLocalNoticeIds = (value: Array<number>): void => {
  localStorage.setItem("readedLocalNoticeIds", JSON.stringify(value));
};
// readedLocalNoticeIds end

export {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  getReadedLocalNoticeIds,
  setReadedLocalNoticeIds,
};
