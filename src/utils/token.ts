import { getRefreshToken } from "src/utils/localStorage";

type RefreshTokenData = {
  user_id: number;
  password: string;
  iat: number;
  exp: number;
};

function parseJwt(token: string): RefreshTokenData {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function isValidToken(token: string): boolean {
  const data = parseJwt(token);
  if (data.exp < Math.round(Date.now() / 1000) + 60) {
    return false;
  }
  return true;
}

function getUserIdFromToken(): number | null {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    return parseJwt(refreshToken).user_id;
  }
  return null;
}

export { parseJwt, isValidToken, getUserIdFromToken };
