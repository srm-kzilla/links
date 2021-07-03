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

const userProfileName = atom<string>({
  key: "userProfileName", 
  default: "", 
});

export { resetPasswordToken, searchDashboardLink, resendOtpEmail, userProfileName };