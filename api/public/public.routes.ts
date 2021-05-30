import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import { getLinkPublic, subscribe, unsubscribe } from "./public.controller";
import { subscribeSchema } from "./public.schema";
import { onError, onNotFound } from "../error/error.controller";
import { validateQuery } from "../middlewares/verifyQuery.middleware";
const publicHandler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError,
});

publicHandler.get("/get", getLinkPublic);
publicHandler.post(
  "/subscribe",
  validateQuery("body", subscribeSchema),
  subscribe
);
publicHandler.delete(
  "/unsubscribe",
  validateQuery("body", subscribeSchema),
  unsubscribe
);

export default publicHandler;
