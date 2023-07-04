import {createSlice} from '@reduxjs/toolkit';

const deliverySlice = createSlice({
  name: 'menu',
  initialState: {
    deliveryInfo: [],
    deliveryType: 0, // 0 : 배달, 1 : 포장, 2 : 먹고가기
  },
  reducers: {
    setDeliveryInfo: (state, action) => {
      state.deliveryInfo = action.payload;
    },
    // setIsDelivery: (state, action) => {
    //   state.isDelivery = action.payload;
    // },
    // setIsForHere: (state, action) => {
    //   state.isForHere = action.payload;
    // },
    setDeliveryType: (state, action) => {
      state.deliveryType = action.payload;
    },
  },
});

const {actions, reducer} = deliverySlice;
export const {setDeliveryInfo, setIsDelivery, setIsForHere, setDeliveryType} =
  actions;
export const deliveryReducer = reducer;
