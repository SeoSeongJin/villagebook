import {createSlice} from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'menu',
  initialState: {
    keyword: '',
    resultCount: {},
  },
  reducers: {
    setKeywordSub: (state, action) => {
      console.log('payload', action.payload);
      state.keyword = action.payload.keyword;
    },
    setResultCountSub: (state, action) => {
      state.resultCount = action.payload;
    },
  },
});

const {actions, reducer} = searchSlice;
export const {setKeywordSub, setResultCountSub} = actions;
export const searchReducerSub = reducer;
