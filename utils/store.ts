import { atom } from "recoil";

const resetPasswordToken = atom({
  key: "resetPasswordToken", 
  default: "", 
});

export { resetPasswordToken };