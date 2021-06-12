import { atom } from "recoil";

const resetPasswordToken = atom<string>({
  key: "resetPasswordToken", 
  default: "", 
});

const searchDashboardLink = atom<string>({
  key: "searchDashboardLink", 
  default: "", 
});

const resendOtpEmail = atom<string>({
  key: "resendOtpEmail", 
  default: "", 
});

export { resetPasswordToken, searchDashboardLink, resendOtpEmail };