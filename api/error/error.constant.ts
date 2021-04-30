export const errors = {
  BAD_REQUEST: {
    httpStatus: 400,
    message: "Bad Request.",
  },
  INTERNAL_SERVER_ERROR: {
    httpStatus: 500,
    message: "Internal Server Error.",
  },
  WRONG_PASSWORD: {
    httpStatus: 401,
    message: "Wrong Password",
  },
  NOT_FOUND: {
    httpStatus: 404,
    message: "Resource Not Found.",
  },
  USER_NOT_FOUND: {
    httpStatus: 401,
    message:
      "User not registered. Please register/login with correct credentials",
  },
  MONGODB_CONNECT_ERROR: {
    httpStatus: 500,
    message: "Could Not Connect to MongoDB.",
  },
  AWS_CONNECT_ERROR: {
    httpStatus: 500,
    message: "Could Not Connect to AWS",
  },
  PRESIGNED_URL_ERROR: {
    httpStatus: 500,
    message: "Could not create presigned url",
  },
  MONGODB_QUERY_ERROR: {
    httpStatus: 500,
    message: "Error Executing MongoDB Query",
  },
  JWT_ERROR: {
    httpStatus: 403,
    message: "JWT Token Not Found.",
  },
  DUPLICATE_USER: {
    httpStatus: 400,
    message: "Email ID Already Registered. Please Login.",
  },
  DUPLICATE_USERNAME: {
    httpStatus: 400,
    message:
      "This username is not available. Please choose some other username.",
  },
  OTP_EXPIRED: {
    httpStatus: 401,
    message: "OTP expired",
  },
  INVALID_OTP: {
    httpStatus: 401,
    message: "Wrong OTP",
  },
  USER_NOT_AVAILABLE: {
    httpStatus: 404,
    message: "User not Found",
  },
  MISSING_ENV_VARIABLES: {
    httpStatus: 500,
    message: "Missing env variables",
  },
};
