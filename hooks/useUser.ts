import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/state/user/userSlice";
import { useSession } from "next-auth/react";
import axios from "axios";
import { AppDispatch } from "@/state/store";
import { UserType } from "@/types/types";

const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.id) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`/api/users/${session.user.id}`);
          const userData: UserType = response.data;

          dispatch(setUser(userData));

          // Opcional: Guardar en localStorage
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUser();
    }
  }, [session, dispatch]);
};

export default useUser;
