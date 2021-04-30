import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import authRoutes from "../../api/auth/auth.routes";
import linksRoutes from "../../api/links/links.routes";
import publicRoutes from "../../api/public/public.routes";
import { validateUser } from "../../api/middlewares/verifyJWT.middleware";
import { onError, onNotFound } from "../../api/error/error.controller";
import { rateLimiter } from "../../api/middlewares/rateLimiter";

const indexRouter = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError,
});
indexRouter.use(rateLimiter);
indexRouter.use("/api/v1/auth", authRoutes);
indexRouter.use("/api/v1/links", validateUser, linksRoutes);
indexRouter.use("/api/v1/public/links", publicRoutes);

export default indexRouter;
