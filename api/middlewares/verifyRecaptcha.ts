import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { errors } from "../error/error.constant";
import axios from "axios";
import { RECAPTCHA_POST } from "../constants/data.constants";
import { RecaptchaResponseToken } from "../auth/auth.schema";

export const verifyRecaptcha = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const { responsetoken } = req.headers as RecaptchaResponseToken;
    if (!responsetoken) {
      throw errors.BAD_REQUEST;
    }
    const response = responsetoken.split(" ")[1];
    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) {
      throw errors.MISSING_ENV_VARIABLES;
    }
    const res = await axios.post(
      `${RECAPTCHA_POST}?secret=${secret}&response=${response}`
    );
    if (!res.data.success || res.data.score <= 0.5) {
      throw errors.INVALID_RECAPTCHA;
    }
    next();
  } catch (err) {
    next({
      httpStatus: `${err.httpStatus ? err.httpStatus : 403}`,
      message: `${err.name}: ${err.message}`,
    });
  }
};
