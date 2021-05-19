import { atom } from "recoil";

const resetPasswordToken = atom<string>({
  key: "resetPasswordToken", 
  default: "", 
});

export { resetPasswordToken };