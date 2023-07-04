import {createSlice, current} from '@reduxjs/toolkit';

const btBarSlice = createSlice({
  name: 'btBar',
  initialState: {
    current: 0,
    stack: [],
  },
  reducers: {
    setCurrent: (state, action) => {
      //   console.log(action);
      state.current = action.payload;
    },
  },
});

const {actions, reducer} = btBarSlice;
export const {setCurrent} = actions;
export const btBarReducer = reducer;
