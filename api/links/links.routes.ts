import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import { addLink, deleteLink, getLink, updateLink } from "./links.controller";
import { validateQuery } from "../middlewares/verifyQuery.middleware";
import { linkDeleteSchema, linkSchema, linkUpdateSchema } from "./link.schema";
import { onError, onNotFound } from "../error/error.controller";

const linksHandler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError,
});

linksHandler.post("/add", validateQuery("body", linkSchema), addLink);
linksHandler.get("/get", getLink);
linksHandler.delete(
  "/delete",
  validateQuery("query", linkDeleteSchema),
  deleteLink
);
linksHandler.patch(
  "/update",
  validateQuery("body", linkUpdateSchema),
  updateLink
);

export default linksHandler;
