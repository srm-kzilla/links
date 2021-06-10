import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { subscribe, unsubscribe } from "./newsletter.controller";
import { subscribeSchema } from "./newsletter.schema";
import { onError, onNotFound } from "../error/error.controller";
import { validateQuery } from "../middlewares/verifyQuery.middleware";
import { verifyRecaptcha } from "../middlewares/verifyRecaptcha";
const subscribeHandler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError,
});

subscribeHandler.post(
  "/add",
  verifyRecaptcha,
  validateQuery("body", subscribeSchema),
  subscribe
);
subscribeHandler.patch(
  "/remove",
  verifyRecaptcha,
  validateQuery("body", subscribeSchema),
  unsubscribe
);

export default subscribeHandler;
