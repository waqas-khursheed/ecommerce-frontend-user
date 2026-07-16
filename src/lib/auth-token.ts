import Cookies from "js-cookie";

export const AUTH_COOKIE_NAME = "user_token";

export const getAuthToken = (): string | undefined => Cookies.get(AUTH_COOKIE_NAME);

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
