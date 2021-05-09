import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { setCookie } from "nookies";
import { load } from 'recaptcha-v3'

import { baseUrl, kzillaxyzclicks } from "../utils/constants";

async function getRecaptchaToken() {
  const recaptcha = await load(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)
  const token = await recaptcha.execute();  
  return token;
}

export const postLogin = async (values) => {
  try {
    const recaptchaToken = await getRecaptchaToken();
    const _res = await axios({
      method: "POST",
      url: `${baseUrl}api/v1/auth/login`,
      headers: {
        "X-Recaptcha-Token": recaptchaToken,
      },
      data: values,
    });
    setCookie(null, "authToken", _res.data.authToken);
    return true;
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

export const postSignup = async (values) => {
  try {
    const recaptchaToken = await getRecaptchaToken();
    const _res = await axios({
      method: "POST",
      url: `${baseUrl}api/v1/auth/signup`,
      headers: {
        "X-Recaptcha-Token": recaptchaToken,
      },
      data: values,
    });
    setCookie(null, "authToken", _res.data.authToken);
    return true;
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

export const getLinks = async (authToken: string) => {
  try {
    const _res = await axios.get(`${baseUrl}api/v1/links/get`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return _res.data;

  } catch (err) {
    errorHandler(err);
  }
};

export const postLink = async (authToken: string, values: object) => {
  try {
    const recaptchaToken = await getRecaptchaToken();
    const _res = await axios({
      method: "POST",
      url: `${baseUrl}api/v1/links/add`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "X-Recaptcha-Token": recaptchaToken,
      },
      data: values,
    });
    successHandler("🎉 Link added successfully!");
    return _res;
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

export const deleteLink = async (authToken: string, _id: string) => {
  try {
    const recaptchaToken = await getRecaptchaToken();
    const endpoint = `${baseUrl}api/v1/links/delete?linkId=${_id}`;
    await axios({
      method: "DELETE",
      url: endpoint,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "X-Recaptcha-Token": recaptchaToken,
      },
    });
    successHandler("🗑️ Link deleted successfully!");
    return true;
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

export const updateLink = async (
  authToken: string,
  _id: string,
  values: object
  ) => {
    try {
    const recaptchaToken = await getRecaptchaToken();
    const endpoint = `${baseUrl}api/v1/links/update?linkId=${_id}`;
    await axios({
      method: "PATCH",
      url: endpoint,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "X-Recaptcha-Token": recaptchaToken,
      },
      data: values,
    });
    return true;
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

export const getPublicLinks = async (username: string) => {
  try {
    const _res = await axios.get(
      `${baseUrl}api/v1/public/links/get?user=${username}`
    );
    return _res.data;
  } catch (err) {
    errorHandler(err);
  }
};

export const getLinkClicks = async (analyticsCode: string) => {
  try {
    const _res = await axios.get(
      `${kzillaxyzclicks}${analyticsCode}`
    );
    return _res.data.clicks;
  }
  catch (err) {
    errorHandler(err);
  }
};

export const patchProfilePicture = async (authToken: string) => {
  try {
    const recaptchaToken = await getRecaptchaToken();
    const _res = await axios({
      method: "PATCH",
      url: `${baseUrl}api/v1/profile/uploadpicture`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "X-Recaptcha-Token": recaptchaToken,
      },
    });
    return _res;
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

export const postProfilePicture = async (url: string, formdata: any) => {
  try {
    const _res = await axios({
      method: "POST",
      url: url,
      data: formdata,
    });
    successHandler("🎉 Your profile image is updated successfully!");
    return _res;
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

export const getUserProfile = async (authToken: string) => {
  try {
    if(authToken) {
      const _res = await axios.get(`${baseUrl}api/v1/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return _res.data;
    }
  }
  catch (err) {
    errorHandler(err); 
    return false;
  }
};

export const patchUserProfile = async (authToken: string, userData: Object) => {
  try {
    const recaptchaToken = await getRecaptchaToken();
    const _res = await axios({
      method: "PATCH",
      url: `${baseUrl}api/v1/profile/editprofile`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "X-Recaptcha-Token": recaptchaToken,
      },
      data: userData
    });
    return _res;
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

export const patchNewPassword = async (authToken: string, values: Object) => {
  try {
    const recaptchaToken = await getRecaptchaToken();
    const _res = await axios({
      method: "PATCH",
      url: `${baseUrl}api/v1/profile/changepassword`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "X-Recaptcha-Token": recaptchaToken,
      },
      data: values
    });
    successHandler("🔐 Password changed successfully!");
    return _res;
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

export const errorHandler = (error?: AxiosError | any) => {
  let errMessage: string = "Oops! Something went wrong!";
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

export const successHandler = (successMessage: string) => {
  toast.success(successMessage, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  });
};
