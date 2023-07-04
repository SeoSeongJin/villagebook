import {createSlice} from '@reduxjs/toolkit';

const locationSlice = createSlice({
  name: 'menu',
  initialState: {currentLocation: {lat: '', lon: ''}},
  reducers: {
    setCurrentLocation: (state, action) => {
      // console.log('## payload', action.payload);
      state.currentLocation = action.payload;
    },
  },
});

const {actions, reducer} = locationSlice;
export const {setCurrentLocation} = actions;
export const locationReducer = reducer;
