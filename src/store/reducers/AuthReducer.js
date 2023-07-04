import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'menu',
  initialState: {userInfo: '', autoLogin: false, fcmToken: '', isGuest: false},
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    setAutoLogin: (state, action) => {
      state.autoLogin = action.payload;
    },
    setIsGuest: (state, action) => {
      state.isGuest = action.payload;
    },
  },
});

const {actions, reducer} = authSlice;
export const {setUserInfo, setFcmToken, setAutoLogin, setIsGuest} = actions;
export const authReducer = reducer;
