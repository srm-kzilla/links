import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import login from "../../api/login";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.get("hello", (req, res) => {
  res.send("Hello World");
});

export default handler;
