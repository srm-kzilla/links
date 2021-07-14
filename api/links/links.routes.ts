import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import {
  addLink,
  deleteLink,
  getLink,
  updateLink,
  getLinkStats,
} from "./links.controller";
import { validateQuery } from "../middlewares/verifyQuery.middleware";
import {
  linkDeleteSchema,
  linkAddSchema,
  linkUpdateSchema,
} from "./link.schema";
import { onError, onNotFound } from "../error/error.controller";
import { verifyRecaptcha } from "../middlewares/verifyRecaptcha";
import { validateUser } from "../middlewares/verifyJWT.middleware";

const linksHandler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError,
});

linksHandler.post(
  "/add",
  verifyRecaptcha,
  validateUser,
  validateQuery("body", linkAddSchema),
  addLink
);
linksHandler.get("/get", validateUser, getLink);
linksHandler.delete(
  "/delete",
  verifyRecaptcha,
  validateUser,
  validateQuery("query", linkDeleteSchema),
  deleteLink
);
linksHandler.patch(
  "/update",
  verifyRecaptcha,
  validateUser,
  validateQuery("body", linkUpdateSchema),
  updateLink
);
linksHandler.get("/stats", validateUser, getLinkStats);

export default linksHandler;
