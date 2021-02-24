import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

export interface ApiError extends Error {
  message: string;
  httpStatus: number;
}

export const onNotFound = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.url}`,
  });
};

export const onError = (
  err: ApiError,
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  if (err.httpStatus) {
    console.error(err);
    res.status(err.httpStatus).json({
      success: false,
      message: err.message,
    });
  } else {
    console.log(err)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
