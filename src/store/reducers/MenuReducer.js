import {createSlice} from '@reduxjs/toolkit';

const menuSlice = createSlice({
  name: 'menu',
  initialState: {optionHeader: false},
  reducers: {
    setOptionHeader: (state, action) => {
      state.optionHeader = action.payload;
    },
  },
});

const {actions, reducer} = menuSlice;
export const {setOptionHeader} = actions;
export const menuReducer = reducer;
