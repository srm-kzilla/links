export const errors = {
  BAD_REQUEST: {
    httpStatus: 400,
    message: "🛑 Captcha not found",
  },
  NO_NEW_CHANGE: {
    httpStatus: 400,
    message: "🤡 All changes already saved!",
  },
  INTERNAL_SERVER_ERROR: {
    httpStatus: 500,
    message: "🔧 Internal Server Error",
  },
  WRONG_PASSWORD: {
    httpStatus: 400,
    message: "🛂 Invalid Password",
  },
  NOT_FOUND: {
    httpStatus: 404,
    message: "🚧 Resource not found",
  },
  USER_NOT_FOUND: {
    httpStatus: 401,
    message: "⛔ User not registered. Please sign up",
  },
  MONGODB_CONNECT_ERROR: {
    httpStatus: 500,
    message: "🔧 Could not connect to MongoDB",
  },
  AWS_CONNECT_ERROR: {
    httpStatus: 500,
    message: "🔧 Could not connect to AWS",
  },
  PRESIGNED_URL_ERROR: {
    httpStatus: 500,
    message: "🔧 Could not create presigned url",
  },
  MONGODB_QUERY_ERROR: {
    httpStatus: 500,
    message: "🔧 Error executing MongoDB Query",
  },
  JWT_ERROR: {
    httpStatus: 401,
    message: "👻 Unauthorized Access",
  },
  INVALID_RECAPTCHA: {
    httpStatus: 403,
    message: "🚫 Invalid Recaptcha",
  },
  DUPLICATE_USER: {
    httpStatus: 400,
    message: "🤡 Email ID already in use",
  },
  DUPLICATE_USERNAME: {
    httpStatus: 400,
    message: "🤡 Username already in use",
  },
  INVALID_OTP: {
    httpStatus: 400,
    message: "🛂 Invalid OTP",
  },
  USER_NOT_AVAILABLE: {
    httpStatus: 404,
    message: "🚧 User not found",
  },
  UNVERIFIED_ACCOUNT: {
    httpStatus: 403,
    message: "📧 Please verify your email to proceed",
  },
  MISSING_ENV_VARIABLES: {
    httpStatus: 500,
    message: "🔧 Missing env variables",
  },
  EMAIL_NOT_FOUND: {
    httpStatus: 404,
    message: "⛔ No account was found with this email ID",
  },
  SUBSCRIBER_EXIST: {
    httpStatus: 409,
    message: "🤡 You are already subscribed !",
  },
  SUBSCRIBER_NOT_FOUND: {
    httpStatus: 404,
    message: "🧐 Subscriber not found !",
  },
  LINK_NOT_FOUND: {
    httpStatus: 404,
    message: "🚧 Link not found !",
  },
  SOMETHING_WENT_WRONG: {
    httpStatus: 500,
    message: "🔧 Something went wrong !",
  },
};
