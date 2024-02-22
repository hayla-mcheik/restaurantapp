// authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    userData: null,
    auth_token: null,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userData = action.payload;
      state.auth_token = action.payload.token;
      AsyncStorage.setItem('auth_token', action.payload.token);
    },
    
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
      state.auth_token = null;
      AsyncStorage.removeItem('auth_token');
    },
  },
});

export const selectAuthToken = (state) => state.auth.auth_token;

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
