import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import authRoutes from "../../api/auth/auth.routes";
import linksRoutes from "../../api/links/links.routes";
import { onError, onNotFound } from "../../api/error/error.controller";

const indexRouter = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError
});

indexRouter.use("/api/v1/auth", authRoutes);
indexRouter.use("/api/v1/links", linksRoutes);

export default indexRouter;