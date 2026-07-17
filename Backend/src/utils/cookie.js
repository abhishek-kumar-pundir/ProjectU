const isProd = process.env.NODE_ENV === "production";

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days — matches JWT expiry

// httpOnly means client-side JS (and therefore any XSS payload) can never
// read this cookie — a real improvement over the old localStorage token,
// which any injected script could just read and steal.
export const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd, // HTTPS only once NODE_ENV=production
    sameSite: isProd ? "none" : "lax", // "none" is needed if frontend/backend end up on different domains in prod
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
};
