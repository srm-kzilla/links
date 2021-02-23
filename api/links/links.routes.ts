import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import { postHello } from "./hello.controller";
import { validateUser } from "../auth/user.middleware";
import {onError, onNotFound} from "../error/error.controller"

const linksHandler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError
});

linksHandler.post("/hello", validateUser, postHello);

export default linksHandler;
