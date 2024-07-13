import { atom } from "recoil";

export const converstionArray = atom({
  key: "converstion",
  default: [],
});

export const selectConverstion = atom({
  key: "selectConverstion",
  default: JSON.parse(localStorage.getItem("selectConverstion")),
});
