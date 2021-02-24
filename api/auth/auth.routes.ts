import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { postLogin, postSignup } from "./auth.controller";
import {onError, onNotFound} from "../error/error.controller"
import { validateQuery } from "./verifyQuery.middleware"
import { userSchema } from "../../models/user-schema"

const authHandler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError
});

authHandler
  .post("/login", validateQuery( "body",userSchema ), postLogin)
  .post("/signup", validateQuery( "body",userSchema ), postSignup);

export default authHandler;