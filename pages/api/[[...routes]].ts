import { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
import nc, { NextHandler } from "next-connect";
dotenv.config({ path: "../../.env" });
import authRoutes from "../../api/auth/auth.routes";
import linksRoutes from "../../api/links/links.routes";
import { validateUser } from "../../api/middlewares/verifyJWT.middleware";
import { onError, onNotFound } from "../../api/error/error.controller";

const indexRouter = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError,
});

indexRouter.use("/api/v1/auth", authRoutes);
indexRouter.use("/api/v1/links", validateUser, linksRoutes);

export default indexRouter;
