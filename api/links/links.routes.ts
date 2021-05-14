import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import { addLink, deleteLink, getLink, updateLink } from "./links.controller";
import { validateQuery } from "../middlewares/verifyQuery.middleware";
import {
  linkDeleteSchema,
  linkAddSchema,
  linkUpdateSchema,
} from "./link.schema";
import { onError, onNotFound } from "../error/error.controller";
import { verifyRecaptcha } from "../middlewares/verifyRecaptcha";

const linksHandler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError,
});

linksHandler.post(
  "/add",
  verifyRecaptcha,
  validateQuery("body", linkAddSchema),
  addLink
);
linksHandler.get("/get", getLink);
linksHandler.delete(
  "/delete",
  verifyRecaptcha,
  validateQuery("query", linkDeleteSchema),
  deleteLink
);
linksHandler.patch(
  "/update",
  verifyRecaptcha,
  validateQuery("body", linkUpdateSchema),
  updateLink
);

export default linksHandler;
