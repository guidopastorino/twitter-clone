import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "@/types/types";

// Estado inicial usando el tipo simplificado UserType
const initialState: UserType = {
  fullname: '',
  username: '',
  email: 'defaultemail@example.com',
  password: '',
  links: [],
  privacy: {
    privateAccount: false,
    isSuspended: false,
    isVerified: false,
    isEnterprise: false,
    privateLikes: false,
    hasPremium: false,
  },
  activity: {
    likes: [],
    comments: []
  },
  followers: [],
  highlights: [],
  following: [],
  blocked: [],
  likes: [],
  posts: [],
  reels: [],
  pinnedPost: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserType>) {
      return { ...state, ...action.payload };
    },
    clearUser(state) {
      return initialState;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
