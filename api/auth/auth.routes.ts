import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { postLogin, postSignup } from "./auth.controller";
import { onError, onNotFound } from "../error/error.controller";
import { validateQuery } from "../middlewares/verifyQuery.middleware";
import { userLoginSchema, userSignupSchema } from "./auth.schema";

const authHandler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError,
});

authHandler
  .post("/login", validateQuery("body", userLoginSchema), postLogin)
  .post("/signup", validateQuery("body", userSignupSchema), postSignup);

export default authHandler;
