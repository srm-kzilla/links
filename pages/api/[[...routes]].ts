import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import authRoutes from "../../api/auth/auth.routes";
import linksRoutes from "../../api/links/links.routes";
import publicRoutes from "../../api/public/public.routes";
import profileRoutes from "../../api/profile/profile.routes";
import { validateUser } from "../../api/middlewares/verifyJWT.middleware";
import { onError, onNotFound } from "../../api/error/error.controller";
import { rateLimiter } from "../../api/middlewares/rateLimiter";
import { verifyRecaptcha } from "../../api/middlewares/verifyRecaptcha";
const indexRouter = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError,
});
indexRouter.use(rateLimiter);
indexRouter.use("/api/v1/auth", verifyRecaptcha, authRoutes);
indexRouter.use("/api/v1/links", verifyRecaptcha, validateUser, linksRoutes);
indexRouter.use("/api/v1/public/links", verifyRecaptcha, publicRoutes);
indexRouter.use("/api/v1/profile", verifyRecaptcha, profileRoutes);

export default indexRouter;
