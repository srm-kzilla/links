import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { setCookie } from "nookies";

export const postLogin = async (values) => {
  try {
    const _res = await axios.post(
      "http://localhost:3000/api/v1/auth/login",
      values
    );
    setCookie(null, "authToken", _res.data.authToken);
    return true;
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

export const postSignup = async (values) => {
  try {
    const _res = await axios.post(
      "http://localhost:3000/api/v1/auth/signup",
      values
    );
    setCookie(null, "authToken", _res.data.authToken);
    return true;
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

const errorHandler = (error?: AxiosError | any) => {
  let errMessage: string="Oops! Something went wrong!";
  if (error)
  switch (error.response?.status) {
    case 401:
      errMessage = "❌ Uh oh! Invalid credentials, please try again!";
      break;
    case 400:
      errMessage = "❌ User already exists, try logging in!";
      break;
    default:
      errMessage = "Oops! Something went wrong!";
      break;
  }
  toast.error(errMessage, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  });
};
