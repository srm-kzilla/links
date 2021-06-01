import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import { getLinkPublic } from "./public.controller";
import { onError, onNotFound } from "../error/error.controller";
import { validateQuery } from "../middlewares/verifyQuery.middleware";
const publicHandler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError,
});

publicHandler.get("/get", getLinkPublic);

export default publicHandler;
