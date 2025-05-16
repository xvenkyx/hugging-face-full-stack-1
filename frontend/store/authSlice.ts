import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface AuthState {
  token: string | null;
}


const initialState: AuthState = {
  token: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
    loadToken: (state) => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        state.token = storedToken;
      }
    },
  },
});




export const { setToken, clearToken, loadToken } = authSlice.actions;
export default authSlice.reducer;