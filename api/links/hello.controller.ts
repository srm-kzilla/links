import next, { NextApiRequest, NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import { jwtPayload } from "../auth/user.middleware";

export const postHello = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const user = JSON.parse(req.env.user) as jwtPayload;
    res.json({ msg: "Hello World" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
