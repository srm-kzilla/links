import { NextApiRequest, NextApiResponse } from "next";

export const onNotFound = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.url}`,
  });
};
