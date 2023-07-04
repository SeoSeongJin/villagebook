import {createSlice} from '@reduxjs/toolkit';

const pushSlice = createSlice({
  name: 'push',
  initialState: {
    NotiAll: false,
    NotiEvent: false,
    NotiReqReview: false,
    NotiReply: false,
    NotiCouponPoint: false,
    NotiTime: {},
  },
  reducers: {
    setNotiAll: (state, action) => {
      state.NotiAll = action.payload;
      state.NotiEvent = action.payload;
      state.NotiReqReview = action.payload;
      state.NotiCouponPoint = action.payload;
      state.NotiReply = action.payload;
    },
    setNotiEvent: (state, action) => {
      state.NotiEvent = action.payload;
    },
    setNotiReqReview: (state, action) => {
      state.NotiReqReview = action.payload;
    },
    setNotiReply: (state, action) => {
      state.NotiReply = action.payload;
    },
    setNotiCouponPoint: (state, action) => {
      state.NotiCouponPoint = action.payload;
    },
    setNotiTime: (state, action) => {
      state.NotiTime = action.payload;
    },
  },
});

const {actions, reducer} = pushSlice;
export const {
  setNotiAll,
  setNotiCouponPoint,
  setNotiEvent,
  setNotiReply,
  setNotiReqReview,
  setNotiTime,
} = actions;
export const pushReducer = reducer;
