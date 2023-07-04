import {createSlice} from '@reduxjs/toolkit';

const deepLinkSlice = createSlice({
  name: 'menu',
  initialState: {isDeepLink: false,},
  reducers: {
    setIsDeepLink: (state, action) => {
      // console.log('## payload', action.payload);
      state.isDeepLink = action.payload;
    },
  },
});

const {actions, reducer} = deepLinkSlice;
export const {setIsDeepLink} = actions;
export const deepLinkReducer = reducer;
