import {createSlice} from '@reduxjs/toolkit';

const CategorySlice = createSlice({
  name: 'category',
  initialState: {
    currentCategory: '',
    isLifeStyle: false,
    currentFilter: 0,
  },
  reducers: {
    setcurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    setcurrentFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
    setIsLifeStyle: (state, action) => {
      state.isLifeStyle = action.payload;
    },
  },
});

const {actions, reducer} = CategorySlice;
export const {setcurrentCategory, setcurrentFilter, setIsLifeStyle} = actions;
export const categoryReducer = reducer;
