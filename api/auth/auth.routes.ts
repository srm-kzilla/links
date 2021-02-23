import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { postLogin, postSignup } from "./auth.controller";
import {onError, onNotFound} from "../error/error.controller"

const authHandler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError
});

authHandler
  .post("/login", postLogin)
  .post("/signup", postSignup);

export default authHandler;