import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import authRoutes from "../../api/auth/auth.routes";
import linksRoutes from "../../api/links/links.routes";
import publicRoutes from "../../api/public/public.routes";
import profileRoutes from "../../api/profile/profile.routes";
import { validateUser } from "../../api/middlewares/verifyJWT.middleware";
import { onError, onNotFound } from "../../api/error/error.controller";

const indexRouter = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError,
});

indexRouter.use("/api/v1/auth", authRoutes);
indexRouter.use("/api/v1/links", validateUser, linksRoutes);
indexRouter.use("/api/v1/public/links", publicRoutes);
indexRouter.use("/api/v1/profile", profileRoutes);

export default indexRouter;
