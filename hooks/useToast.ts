import { useDispatch } from "react-redux"
import { setToast } from "@/state/toast/toastSlice"

export default function useToast() {

  const dispatch = useDispatch()

  const showToast = (message: string) => {
    dispatch(setToast(message));
  }

  return { showToast };
}