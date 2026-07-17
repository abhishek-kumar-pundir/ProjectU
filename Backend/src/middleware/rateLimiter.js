import rateLimit from "express-rate-limit";

// 10 attempts per 15 minutes per IP on login/register — cheap protection
// against brute force and credential stuffing without needing a captcha.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});
