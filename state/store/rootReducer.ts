import { combineReducers, combineSlices } from "@reduxjs/toolkit";
import userReducer from "../user/userSlice";
import themeReducer from "../theme/themeSlice";
import modalReducer from "@/state/modal/modalSlice"
import toastReducer from '@/state/toast/toastSlice'

const rootReducer = combineSlices({
  user: userReducer,
  theme: themeReducer,
  modal: modalReducer,
  toast: toastReducer,
  // add others reducers
})

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;