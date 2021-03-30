import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { setCookie, parseCookies } from "nookies";

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

export const getLinks = async (authToken: string) => {
  try {
    const _res = await axios.get("http://localhost:3000/api/v1/links/get", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return _res.data.result;
  } catch (err) {
    errorHandler(err);
  }
};

export const postLink = async (authToken: string, values: object) => {
  try {
    const _res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/links/add",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: values,
    });
    successHandler("🎉 Link added successfully!");
    // TODO: get _id of the new added link and return it
    console.log(_res.data);
    return true;
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

export const deleteLink = async (authToken: string, _id: string) => {
  try {
    const endpoint = `http://localhost:3000/api/v1/links/delete?linkId=${_id}`;
    await axios({
      method: "DELETE",
      url: endpoint,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    successHandler("🗑️ Link deleted successfully!");
    return true;
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

// export const updateLink = async () => {
//   try {
//     axios.patch("http://localhost:3000/api/v1/links/update", {

//     })
//   }
//   catch (err) {
//     errorHandler(err);
//     // return false;
//   }
// }

const errorHandler = (error?: AxiosError | any) => {
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

const successHandler = (successMessage: string) => {
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