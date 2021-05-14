export const errors = {
  BAD_REQUEST: {
    httpStatus: 400,
    message: "🛑 Captcha not found",
  },
  INTERNAL_SERVER_ERROR: {
    httpStatus: 500,
    message: "🔧 Internal Server Error",
  },
  WRONG_PASSWORD: {
    httpStatus: 401,
    message: "🛂 Wrong Password",
  },
  NOT_FOUND: {
    httpStatus: 404,
    message: "🚧 Resource Not Found",
  },
  USER_NOT_FOUND: {
    httpStatus: 401,
    message: "⛔ User Not Registered. Please Register/Login",
  },
  MONGODB_CONNECT_ERROR: {
    httpStatus: 500,
    message: "🔧 Could Not Connect to MongoDB",
  },
  AWS_CONNECT_ERROR: {
    httpStatus: 500,
    message: "🔧Could Not Connect to AWS",
  },
  PRESIGNED_URL_ERROR: {
    httpStatus: 500,
    message: "🔧Could not create presigned url",
  },
  MONGODB_QUERY_ERROR: {
    httpStatus: 500,
    message: "🔧 Error Executing MongoDB Query",
  },
  JWT_ERROR: {
    httpStatus: 404,
    message: "👻 Unauthorized Access",
  },
  INVALID_RECAPTCHA: {
    httpStatus: 403,
    message: "🚫Invalid Recaptcha",
  },
  DUPLICATE_USER: {
    httpStatus: 400,
    message: "🤡 Email ID Already In Use",
  },
  DUPLICATE_USERNAME: {
    httpStatus: 400,
    message: "🤡 Username Already In Use",
  },
  INVALID_OTP: {
    httpStatus: 401,
    message: "🛂 Wrong OTP",
  },
  USER_NOT_AVAILABLE: {
    httpStatus: 404,
    message: "🚧 User not Found",
  },
  UNVERIFIED_ACCOUNT: {
    httpStatus: 403,
    message: "🙄 Please verify your email to proceed",
  },
  MISSING_ENV_VARIABLES: {
    httpStatus: 500,
    message: "🔧 Missing env variables",
  },
  EMAIL_NOT_FOUND: {
    httpStatus: 404,
    message: "⛔ No Account was found with this Email ID",
  },
};
