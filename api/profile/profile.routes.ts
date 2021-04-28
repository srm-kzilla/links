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

const profileHandler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: onNotFound,
  onError: onError,
});

profileHandler
  .get("/", validateUser, getProfile)
  .patch(
    "/editprofile",
    validateQuery("body", userProfileSchema),
    validateUser,
    patchProfile
  )
  .post("/uploadpicture", validateUser, postPicture)
  .patch(
    "/changepassword",
    validateQuery("body", changePasswordSchema),
    validateUser,
    patchPassword
  );

export default profileHandler;
