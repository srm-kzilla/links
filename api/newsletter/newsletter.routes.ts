import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { subscribe, unsubscribe } from "./newsletter.controller";
import { subscribeSchema } from "./newsletter.schema";
import { onError, onNotFound } from "../error/error.controller";
import { validateQuery } from "../middlewares/verifyQuery.middleware";
const subscribeHandler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError,
});

subscribeHandler.post(
  "/add",
  validateQuery("body", subscribeSchema),
  subscribe
);
subscribeHandler.patch(
  "/remove",
  validateQuery("body", subscribeSchema),
  unsubscribe
);

export default subscribeHandler;
