import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { validateUser } from "../middlewares/verifyJWT.middleware";
import { onError, onNotFound } from "../error/error.controller";
import {
  patchPassword,
  postPicture,
  getProfile,
  patchProfile,
} from "./profile.controller";
import { validateQuery } from "../middlewares/verifyQuery.middleware";
import { userProfileSchema, changePasswordSchema } from "./profile.schema";
import { verifyRecaptcha } from "../middlewares/verifyRecaptcha";

const profileHandler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError,
});

profileHandler
  .get("/", validateUser, getProfile)
  .patch(
    "/editprofile",
    verifyRecaptcha,
    validateQuery("body", userProfileSchema),
    validateUser,
    patchProfile
  )
  .patch("/uploadpicture", verifyRecaptcha, validateUser, postPicture)
  .patch(
    "/changepassword",
    verifyRecaptcha,
    validateQuery("body", changePasswordSchema),
    validateUser,
    patchPassword
  );

export default profileHandler;
