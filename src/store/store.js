import {configureStore} from '@reduxjs/toolkit';
import {addressReducer} from './reducers/AddressReducer';
import {authReducer} from './reducers/AuthReducer';
import {btBarReducer} from './reducers/BottomBarReducer';
import {cartReducer} from './reducers/CartReducer';
import {categoryReducer} from './reducers/CategoryReducer';
import {couponReducer} from './reducers/CouponReducer';
import {deliveryReducer} from './reducers/DeliveryInfoReducer';
import {locationReducer} from './reducers/LocationRecuder';
import {menuReducer} from './reducers/MenuReducer';
import {paymentReducer} from './reducers/PaymentReducer';
import {pushReducer} from './reducers/PushReducer';
import {searchReducer} from './reducers/SearchReducer';
import {searchReducerSub} from './reducers/SearchReducerSub';
import {deepLinkReducer} from './reducers/DeepLinkReducer';

export default configureStore({
  reducer: {
    authReducer,
    menuReducer,
    btBarReducer,
    pushReducer,
    categoryReducer,
    cartReducer,
    paymentReducer,
    addressReducer,
    locationReducer,
    couponReducer,
    searchReducer,
    searchReducerSub,
    deliveryReducer,
    deepLinkReducer,
  },
});
