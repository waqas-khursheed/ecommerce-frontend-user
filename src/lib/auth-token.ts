import Cookies from "js-cookie";

export const AUTH_COOKIE_NAME = "user_token";

// js-cookie touches `document`, which doesn't exist during server-side
// rendering (e.g. an ISR page's server-side fetch) — guard so those callers
// just see "no token" instead of crashing.
export const getAuthToken = (): string | undefined => {
  if (typeof document === "undefined") return undefined;
  return Cookies.get(AUTH_COOKIE_NAME);
};

export const setAuthToken = (token: string): void => {
  Cookies.set(AUTH_COOKIE_NAME, token, {
    expires: 30,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export const clearAuthToken = (): void => {
  Cookies.remove(AUTH_COOKIE_NAME);
};
