import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import authRoutes from "../../api/auth/auth.routes";
import { onNotFound } from "../../api/error/error.controllers";

const indexRouter = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
});

indexRouter.use("/api/v1/auth", authRoutes);

export default indexRouter;
