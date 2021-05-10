import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import {
  postLogin,
  postSignup,
  getOTP,
  verifyOTP,
  resetPassword,
} from "./auth.controller";
import { onError, onNotFound } from "../error/error.controller";
import { validateQuery } from "../middlewares/verifyQuery.middleware";
import { validateUser } from "../middlewares/verifyJWT.middleware";
import {
  resetPasswordSchema,
  userEmailSchema,
  userLoginSchema,
  userOTPRequestSchema,
  userSignupSchema,
} from "./auth.schema";
import { verifyRecaptcha } from "../middlewares/verifyRecaptcha";
import { validateToken } from "../middlewares/verifyResetPasswordToken.middleware";

const authHandler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError,
});

authHandler
  .post(
    "/login",
    verifyRecaptcha,
    validateQuery("body", userLoginSchema),
    postLogin
  )
  .post(
    "/signup",
    verifyRecaptcha,
    validateQuery("body", userSignupSchema),
    postSignup
  )
  .get("/getotp", validateQuery("body", userEmailSchema), getOTP)
  .post(
    "/postotp",
    verifyRecaptcha,
    validateQuery("body", userOTPRequestSchema),
    validateToken,
    verifyOTP
  )
  .patch(
    "/resetpassword",
    verifyRecaptcha,
    validateQuery("body", resetPasswordSchema),
    validateToken,
    resetPassword
  );

export default authHandler;
