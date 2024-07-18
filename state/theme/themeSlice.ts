import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  theme: 'dark' | 'light' | 'system';
}

const getInitialTheme = (): 'dark' | 'light' | 'system' => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'system') {
      return savedTheme as 'dark' | 'light' | 'system';
    }
  }
  return 'system';
};

const initialState: ThemeState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'dark' | 'light' | 'system'>) {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
