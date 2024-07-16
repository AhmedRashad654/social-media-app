import { atom } from "recoil";

export const checkComing = atom({
  key: "checkComing",
  default: false,
});
export const pagenationCheck = atom({
  key: "pagenationCheck",
  default: false,
});
export const pagenationPage = atom({
  key: "pagenationPage",
  default: 1,
});
