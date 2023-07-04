import {createSlice} from '@reduxjs/toolkit';

//다른 가게 담으면 사라짐

const cartSlice = createSlice({
  name: 'category',
  initialState: {
    currentStoreCode: '', //현재 가게의 고유코드
    mainCount: {count: 1, mainItemCode: '', menuName: '', mainPrice: 0}, // 본품 기본 수량 : 1
    // selectedMainOption: {},
    selectedMainOption: [],
    subItems: [],
    requiredCount: 0,
    totalPrice: 0,
    //최종금액은 그냥 배열에서 가격 골라서 합산해서 표시
    storeLogoUrl: '',
    savedItem: {savedStoreCode: '', savedItems: []}, // 담기 버튼을 눌렀을때 아이템이 담길 배열
  },
  reducers: {
    initOption: (state, action) => {
      state.mainCount.count = action.payload.count;
      state.mainCount.mainItemCode = action.payload.mainItemCode;
      state.mainCount.menuName = action.payload.manuName;
      state.mainCount.mainPrice = action.payload.mainPrice;
      state.totalPrice = action.payload.price;
      state.selectedMainOption = [];
      state.subItems = [];
    },
    setMainCount: (state, action) => {
      state.mainCount.count = action.payload.count;
      state.mainCount.mainItemCode = action.payload.mainItemCode;
      state.totalPrice = action.payload.price;
    },
    setSubMenu: (state, action) => {
      state.subItems.push(action.payload);
      state.totalPrice += action.payload.itemPrice * state.mainCount.count;
    },
    removeSubMenu: (state, action) => {
      state.subItems.pop();
      state.totalPrice -= action.payload.itemPrice * state.mainCount.count;
    },
    removeSavedItem: (state, action) => {
      state.savedItem.filter(() => {});
    },
    setCurrentStoreCode: (state, action) => {
      console.log('code action', action);
      state.currentStoreCode = action.payload;
    },
    setMainRequired: (state, action) => {
      if (state.selectedMainOption[action.payload.index]?.idx) {
        state.totalPrice -=
          state.selectedMainOption[action.payload.index]?.price *
          state.mainCount.count;
        state.totalPrice += action.payload.data.price * state.mainCount.count;
      } else state.totalPrice += action.payload.data.price;
      state.selectedMainOption[action.payload.index] = action.payload.data;
    },
    setRequiredCount: (state, action) => {
      state.requiredCount = action.payload;
    },
    setStoreLogo: (state, action) => {
      state.storeLogoUrl = action.payload;
    },
    setMainCountFromCart: (state, action) => {
      state.savedItem.savedItems[action.payload.index].count =
        action.payload.count;
      state.savedItem.savedItems[action.payload.index].main.count =
        action.payload.count;
      state.savedItem.savedItems[action.payload.index].totalPrice =
        action.payload.price;
    },
    setSaveItem: (state, action) => {
      state.savedItem = action.payload;
    },
    saveItem: (state, action) => {
      console.log('action saved', action.payload);
      state.savedItem.savedStoreCode = action.payload.storeCode;
      state.savedItem.savedItems.push(action.payload.items);
    },
    updateItem: (state, action) => {
      state.savedItem.savedItems[action.payload.idx].count +=
        action.payload.count;
      state.savedItem.savedItems[action.payload.idx].main.count +=
        action.payload.count;
      state.savedItem.savedItems[action.payload.idx].totalPrice +=
        action.payload.price;
    },
    removeItem: (state, action) => {
      console.log('removeItem', action.payload);
      let temp = state.savedItem.savedItems.filter(
        (item, index) => index !== action.payload.index,
      );
      state.savedItem.savedItems = temp;
    },
    resetSavedItem: (state, action) => {
      console.log('resetSavedItem', action);
      state.savedItem = {savedStoreCode: {}, savedItems: []};
      state.currentStoreCode = '';
    },

    setCountUp: (state, action) => {
      state.totalPrice = action.payload.price;
      state.mainCount.count += 1;
    },
    setCountDown: (state, action) => {
      state.totalPrice = action.payload.price;
      state.mainCount.count -= 1;
    },
  },
});

const {actions, reducer} = cartSlice;

export const {
  initOption,
  setMainCount,
  setSubMenu,
  setStoreLogo,
  removeSubMenu,
  removeSavedItem,
  saveItem,
  setCurrentStoreCode,
  setRequiredCount,
  setMainRequired,
  setMainCountFromCart,
  removeItem,
  resetSavedItem,
  updateItem,
  setSaveItem,
  setCountUp,
  setCountDown,
} = actions;
export const cartReducer = reducer;
