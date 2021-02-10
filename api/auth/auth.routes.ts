import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { postLogin, postSignup } from "./auth.controller";

const authHandler = nc<NextApiRequest, NextApiResponse>();

authHandler.post("/login", postLogin).post("/signup", postSignup);

export default authHandler;
