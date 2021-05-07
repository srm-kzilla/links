import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { errors } from "../error/error.constant";
import axios from "axios";
import { RECAPTCHA_POST_URL } from "../constants/data.constants";
import { RecaptchaResponseToken } from "../auth/auth.schema";

export const verifyRecaptcha = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const responsetoken = req.headers["x-recaptcha-token"] as RecaptchaResponseToken;
    if (!responsetoken) {
      throw errors.BAD_REQUEST;
    }
    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) {
      throw errors.MISSING_ENV_VARIABLES;
    }
    const res = await axios.post(
      `${RECAPTCHA_POST_URL}?secret=${secret}&response=${responsetoken}`
    );
    if (!res.data.success || res.data.score <= 0.5) {
      throw errors.INVALID_RECAPTCHA;
    }
    next();
  } catch (err) {
    next({
      httpStatus: err.httpStatus || 403,
      message: `${err.name}: ${err.message}`,
    });
  }
};
