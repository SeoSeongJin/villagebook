import {createSlice} from '@reduxjs/toolkit';

const couponSlice = createSlice({
  name: 'menu',
  initialState: {
    storeCoupon: '',
    systemCoupon: '',
    couponbookData: '',
    couponBoolFilterIndex: '1',
  },
  reducers: {
    setStoreCoupon: (state, action) => {
      state.storeCoupon = action.payload;
    },
    setSystemCoupon: (state, action) => {
      state.systemCoupon = action.payload;
    },
    resetCoupon: (state, action) => {
      state.storeCoupon = '';
      state.systemCoupon = '';
    },
    setCouponBookMenus: (state, action) => {
      state.couponbookData = action.payload;
    },
    setCouponBookFilterIndex: (state, action) => {
      state.couponBoolFilterIndex = action.payload;
    },
  },
});

const {actions, reducer} = couponSlice;
export const {
  setStoreCoupon,
  setSystemCoupon,
  resetCoupon,
  setCouponBookMenus,
  setCouponBookFilterIndex,
} = actions;
export const couponReducer = reducer;
