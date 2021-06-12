import { atom } from "recoil";

const resetPasswordToken = atom<string>({
  key: "resetPasswordToken", 
  default: "", 
});

const searchDashboardLink = atom<string>({
  key: "searchDashboardLink", 
  default: "", 
});

export { resetPasswordToken, searchDashboardLink };