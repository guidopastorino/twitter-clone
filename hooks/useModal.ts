import { useDispatch } from 'react-redux';
import { openModal, closeModal } from '@/state/modal/modalSlice';

export const useModal = () => {
  const dispatch = useDispatch();

  const openRouteModal = (content: React.ReactNode, url: string) => {
    dispatch(openModal(content));
    if (typeof window !== "undefined") {
      window.history.pushState(null, '', url);
    }
  }

  const closeRouteModal = () => {
    dispatch(closeModal());
    window.history.back();
  }

  return {
    openRouteModal,
    closeRouteModal
  }
}
