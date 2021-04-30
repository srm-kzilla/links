import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 45,
  message: "You have reached maximum number of requests",
  headers: true,
});
