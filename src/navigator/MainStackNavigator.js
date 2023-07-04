import React, {useEffect, useRef, useState} from 'react';
import notifee, {
  EventType,
  AndroidBadgeIconType,
  AndroidImportance,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import {
  getStateFromPath,
  Link,
  NavigationContainer,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Main from '../screens/home/Main';
import MenuDetail from '../screens/menu/MenuDetail';
import Map from '../screens/map/Map';
import Test from '../Test';
import AddressSearch from '../screens/map/AddressSearch';
import Login from '../screens/login/login';
import LikeMain from '../screens/likeStore/LikeMain';
import OrderList from '../screens/orderList/OrderList';
import DiscountMain from '../screens/discount/DiscountMain';
import MyPage from '../screens/mypage/MyPage';
import CategoryView from '../screens/home/CategoryView';
import StoreList from '../screens/home/CategoryStore/StoreList';
import EditInfo from '../screens/mypage/edit/EditInfo';
import Notice from '../screens/mypage/Notice';
import FAQ from '../screens/mypage/FAQ';
import PointCoupon from '../screens/mypage/PointCoupon';
import Review from '../screens/mypage/Review';
import PushSetting from '../screens/mypage/PushSetting';
import NoticeDetail from '../screens/mypage/NoticeDetail';
import FAQWrite from '../screens/mypage/FAQWrite';
import FAQDetail from '../screens/mypage/FAQDetail';
import EventBoard from '../screens/mypage/EventBoard';
import EventDetail from '../screens/mypage/EventDetail';
import OptionSelect from '../screens/menu/OptionSelect';
import SummitOrder from '../screens/menu/cart/SummitOrder';
import WriteOrderForm from '../screens/menu/orderDetail/WriteOrderForm';
import PaymentMethod from '../screens/menu/orderDetail/PaymentMethod';
import OrderSumary from '../screens/menu/orderDetail/OrderSumary';
import OrderFinish from '../screens/menu/orderDetail/OrderFinish';
import WriteReview from '../screens/orderList/WriteReview';
import Cart from '../screens/menu/cart/Cart';
import EditSummit from '../screens/mypage/edit/EditSummit';
import PushList from '../screens/home/PushList';
import CheckTerms from '../screens/signIn/CheckTerms';
import SignForm from '../screens/signIn/SignForm';
import Policy from '../screens/signIn/Policy';
import FindUserAccount from '../screens/login/FindUserAccount';
import ResetAccount from '../screens/login/ResetAccount';
import AuthStorage from '../store/localStorage/AuthStorageModuel';
import localStorageConfig from '../store/localStorage/localStorageConfig';
import Loading from '../component/Loading';
import {useMutation} from 'react-query';
import authAPI from '../api/modules/authAPI';
import {useDispatch} from 'react-redux';
import {setFcmToken, setUserInfo} from '../store/reducers/AuthReducer';
import PaymentMain from '../screens/payment/PaymentMain';
import {Errorhandler} from '../config/ErrorHandler';
import UseInfo from '../screens/policy/UseInfo';
import {useCustomMutation} from '../hooks/useCustomMutation';
import LifeStyleStoreInfo from '../screens/lifeStyle/LifeStyleStoreInfo';
import AddressMain from '../screens/home/AddressMain';
import AddressSetDetail from '../screens/home/AddressSetDetail';
import {useGeoLocation} from '../hooks/useGeoLocation';
import DeliveryTipInfo from '../screens/menu/DeliveryTipInfo';
import CouponSelect from '../screens/menu/orderDetail/CouponSelect';
import SearchView from '../screens/home/SearchView';
import {AppState, Linking, Platform} from 'react-native';
import AuthStorageModuel from '../store/localStorage/AuthStorageModuel';
import {setSaveItem, setStoreLogo} from '../store/reducers/CartReducer';
import SearchResult from '../screens/home/SearchResult';

import dynamicLinks from '@react-native-firebase/dynamic-links';
import MenuDetail2 from '../screens/menu/MenuDetail2';
import IamCertification from '../screens/IamCertification';
import MenuDetail3 from '../screens/menu/MenuDetail3';
import CouponBookMain from '../screens/couponbook/CouponBookMain';
import MarketScreen from '../screens/home/MarketScreen';
import FoodScreen from '../screens/home/FoodScreen';
// import CouponBookMain from '../screens/couponbook/CouponBookMain2';
import CouponBookSearch from '../screens/couponbook/CouponBookSearch';
import CouponBookDetail from '../screens/couponbook/CouponBookDetail';
import CouponBookMy from '../screens/couponbook/CouponBookMy';
import CouponBookMap from '../screens/couponbook/CouponBookMap';
import CouponBookReview from '../screens/couponbook/CouponBookReview';
import CommunityMain from '../screens/community/CommunityMain';
const Stack = createNativeStackNavigator();
const naviRef = React.createRef();
export {naviRef};
const MainStackNavigator = () => {
  const [initRoute, setInitRoute] = useState();
  const dispatch = useDispatch();
  const {mutateSNSlogin} = useCustomMutation();
  // const cartStore = useSelector(state => state.cartReducer);
  const {_getCurrentLocation, _requestPermissions} = useGeoLocation();
  // const naviRef = useRef();

  const onMessageReceived = async message => {
    console.log('message onForeground', message);
    const channelId2 = await notifee.createChannel({
      id: 'onForeground',
      name: 'Default Channel onForeground',
      importance: AndroidImportance.HIGH,
    });
    // Display a notification

    notifee.onForegroundEvent(e => {
      console.log('onForegroundEvent', e);
      if (e.type === 1) {
        if (message.data.od_id) return naviRef.current?.navigate('OrderList');
        else {
          return naviRef.current?.navigate('MenuDetail2', {
            jumju_id: message.data.jumju_id,
            jumju_code: message.data.jumju_code,
            // mb_company: message.data.mb_company,
            category: message.data.jumju_type,
          });
        }
      }
    });

    notifee.onBackgroundEvent(e => {
      console.log('onBackgroundEvent', e);
    });

    await notifee.displayNotification({
      title: message.notification.title,
      body: message.notification.body,
      android: {
        channelId: channelId2,
        importance: AndroidImportance.HIGH,
      },
      ios: {},
    });
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onMessageReceived(remoteMessage);
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  const _getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      console.log('fcm', fcmToken);
      if (fcmToken) {
        dispatch(setFcmToken(fcmToken));
        return fcmToken;
      }
    } catch (err) {
      Errorhandler(err);
    }
  };

  const mutateAutoLogin = useMutation(authAPI._autoLogin, {
    onSuccess: e => {
      const userInfo = e.data.arrItems;
      if (userInfo) {
        dispatch(setUserInfo(userInfo));
        //setInitRoute('Main');
        setInitRoute('CategoryView');
      } else setInitRoute('Login');
    },
  });

  const _autoLogin = async (token, id, type, loginTypeNum) => {
    let data;
    if (type !== localStorageConfig.loginType.sns) {
      data = {
        mt_id: id,
        mt_app_token: token,
      };
    } else {
      data = {
        mt_id: id,
        mt_app_token: token,
        mt_login_type: loginTypeNum,
      };
      console.log('## autoLogin data', data);
    }

    if (type === localStorageConfig.loginType.sns) {
      mutateSNSlogin.mutate(data, {
        onSuccess: e => {
          const userInfo = e.data.arrItems;
          console.log('mutateSNSlogin result :::', e);
          if (userInfo) {
            dispatch(setUserInfo(userInfo));
            setInitRoute('CategoryView');
          } else setInitRoute('Login');
        },
      });
    } else mutateAutoLogin.mutate(data);
  };

  const _initRoute = async () => {
    try {
      const fcmToken = await _getFcmToken();
      const auto = await AuthStorage._getItemAutoLogin();
      const token = await AuthStorage._getItemUserToken();
      const userId = await AuthStorage._getItemUserId();
      const loginType = await AuthStorage._getItemLoginType();
      const loginTypeNum = await AuthStorage._getItemLoginTypeNum();

      console.log('userId, loginType', userId, loginType, loginTypeNum);
      if (auto === localStorageConfig.state.true && token && userId)
        _autoLogin(token, userId, loginType, loginTypeNum);
      else setInitRoute('Login');
    } catch (err) {
      Errorhandler(err);
    }
  };

  const _decodeUri = url => {
    if (url) {
      let temp = url.split('=');
      let decodedUrl = decodeURIComponent(temp[1]);
      if (decodedUrl == undefined) return url;

      decodedUrl = decodedUrl.substring(0, decodedUrl.length - 3);
      return decodedUrl;
    }
  };

  const config = {
    initialRouteName: 'CategoryView',
    screens: {
      Login: 'login',
      // Main: 'main',
      MenuDetail2: {
        path: '/main/:category/:jumju_id/:jumju_code/:link',
      },
      LifeStyleStoreInfo: {
        path: '/mainlife/lifestyle/:jumju_id/:jumju_code/:link',
      },
    },
  };

  const linking = {
    prefixes: [
      'https://www.dongnaebook.com',
      'http://www.dongnaebook.com',
      'dongnaebook://',
      'applinks://',
      'applinks:',
      'kakao://3b2d0193b43c447113dbdf6e68dfdc2b',
    ],
    async getInitialURL() {
      if (Platform.OS === 'android') {
        const url = await Linking.getInitialURL();
        // console.log(1);
        if (url != null) {
          console.log('path:::', url);
          return url;
        }
        return;
      }

      if (Platform.OS === 'ios') {
        //링크가 다이나믹 링크일 때(카카오에서 링크 타는 거 제외)
        const link2 = await dynamicLinks()
          .getInitialLink()
          .then(link2 => {
            if (link2) {
              console.warn('dynamic ', link2);
              return link2?.url;
            }
          });
        if (link2) return link2;

        //ios 앱 켜져있거나 백그라운드 일때
        dynamicLinks().onLink(link => {
          console.warn('link', link);
          if (link) return link.url;
        });

        //앱이 종료된 상태에서 가동될 때
        const link = await Linking.getInitialURL().then(link => {
          console.warn('exit link', link);
          const decodedUrl = _decodeUri(link);
          console.warn('decoded', decodedUrl);
          return decodedUrl;
          // Linking.openURL(decodedUrl);
          // return link;
        });
        if (link) return link;
        else return;
      }
    },
    subscribe(listener) {
      let onReceiveURL;
      if (Platform.OS === 'ios') {
        onReceiveURL = async event => {
          console.warn('origin evetn', event);
          if (event?.url) {
            const decodedUrl = _decodeUri(event.url);
            if (decodedUrl) {
            }
            console.warn('ios event', decodedUrl);
            return listener(decodedUrl);
          }
        };
      } else {
        onReceiveURL = event => {
          const {url} = event;
          console.log('link has url path66', url, event);
          return listener(url);
        };
      }

      Linking.addEventListener('url', onReceiveURL);
      return () => {
        Linking.removeAllListeners('url');
      };
    },
    config,
  };

  const _getLocalData = async () => {
    const cartData = await AuthStorageModuel._getCartData();
    // console.log('::::::::::: MAIN DATA', JSON.parse(cartData));
    if (cartData) {
      const copyData = JSON.parse(cartData);
      delete cartData.logo;
      if (cartData) {
        dispatch(setSaveItem(JSON.parse(cartData)));
        dispatch(setStoreLogo(copyData.logo));
      }
    }
  };

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    console.log(' ::::::::::::: appState', appState);
    _getLocalData();
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        const cartData = await AuthStorageModuel._getCartData();
        console.log('::::::::::: MAIN DATA', JSON.parse(cartData));
        if (cartData) {
          const copyData = JSON.parse(cartData);
          if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
          ) {
            delete cartData.logo;
            if (cartData) {
              dispatch(setSaveItem(JSON.parse(cartData)));
              dispatch(setStoreLogo(copyData.logo));
            }
            // console.log('App has come to the foreground!');
          }
          appState.current = nextAppState;
          // setAppStateVisible(appState.current);
        }
      },
    );
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    _initRoute();
  }, []);

  const _routeBackGround = () => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.data,
          );
          if (remoteMessage.data.od_id)
            return naviRef.current?.navigate('OrderList');
          else {
            return naviRef.current?.navigate('MenuDetail2', {
              jumju_id: remoteMessage.data.jumju_id,
              jumju_code: remoteMessage.data.jumju_code,
              // mb_company: remoteMessage.data.mb_company,
              category: remoteMessage.data.jumju_type,
            });
          }
        }
      });
  };

  if (!initRoute) return <Loading />;

  return (
    <NavigationContainer
      ref={naviRef}
      linking={linking}
      onReady={_routeBackGround}>
      <Stack.Navigator
        initialRouteName={initRoute}
        // initialRouteName={'Test'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CheckTerms" component={CheckTerms} />
        <Stack.Screen
          name="Policy"
          component={Policy}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen name="SignForm" component={SignForm} />
        <Stack.Screen name="FindUserAccount" component={FindUserAccount} />
        <Stack.Screen name="ResetAccount" component={ResetAccount} />

        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="SearchView" component={SearchView} />
        <Stack.Screen
          name="SearchResult"
          component={SearchResult}
          options={{animation: 'slide_from_right'}}
        />

        <Stack.Screen name="AddressMain" component={AddressMain} />
        <Stack.Screen name="AddressSetDetail" component={AddressSetDetail} />

        <Stack.Screen
          name="CategoryView"
          component={CategoryView}
          initialParams={{selectedCategory: 'lifestyle'}}
        />
        <Stack.Screen name="StoreList" component={StoreList} />
        <Stack.Screen name="LikeMain" component={LikeMain} />
        <Stack.Screen name="OrderList" component={OrderList} />
        <Stack.Screen name="WriteReview" component={WriteReview} />
        <Stack.Screen name="DiscountMain" component={DiscountMain} />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="MenuDetail" component={MenuDetail} />
        <Stack.Screen name="MenuDetail2" component={MenuDetail2} />
        <Stack.Screen name="MenuDetail3" component={MenuDetail3} />

        <Stack.Screen
          name="DeliveryTipInfo"
          component={DeliveryTipInfo}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="LifeStyleStoreInfo"
          component={LifeStyleStoreInfo}
        />
        <Stack.Screen name="OptionSelect" component={OptionSelect} />
        <Stack.Screen name="SummitOrder" component={SummitOrder} />
        <Stack.Screen name="WriteOrderForm" component={WriteOrderForm} />
        <Stack.Screen
          name="PaymentMethod"
          component={PaymentMethod}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen name="PaymentMain" component={PaymentMain} />
        <Stack.Screen
          name="CouponSelect"
          component={CouponSelect}
          options={{animation: 'slide_from_bottom'}}
        />

        <Stack.Screen name="OrderSumary" component={OrderSumary} />
        <Stack.Screen name="OrderFinish" component={OrderFinish} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="PushList" component={PushList} />

        <Stack.Screen
          name="UseInfo"
          component={UseInfo}
          options={{animation: 'slide_from_bottom'}}
        />

        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="AddressSearch" component={AddressSearch} />
        <Stack.Screen name="EditInfo" component={EditInfo} />
        <Stack.Screen name="EditSummit" component={EditSummit} />

        <Stack.Screen name="Notice" component={Notice} />
        <Stack.Screen name="NoticeDetail" component={NoticeDetail} />
        <Stack.Screen name="FAQ" component={FAQ} />
        <Stack.Screen name="FAQDetail" component={FAQDetail} />
        <Stack.Screen name="FAQWrite" component={FAQWrite} />
        <Stack.Screen name="PointCoupon" component={PointCoupon} />
        <Stack.Screen name="EventBoard" component={EventBoard} />
        <Stack.Screen name="EventDetail" component={EventDetail} />
        <Stack.Screen name="Review" component={Review} />
        <Stack.Screen name="PushSetting" component={PushSetting} />

        <Stack.Screen name="IamCertification" component={IamCertification} />

        {/*
         쿠폰북 추가 22.11.22
         푸드, 마켓 스크린 별도로 분리하여 추가
        */}
        {/* <Stack.Screen name="CouponBookMain" component={CouponBookMain} /> */}
        <Stack.Screen name="CouponBookMain" component={CouponBookMain} />
        <Stack.Screen name="FoodScreen" component={FoodScreen} />
        <Stack.Screen name="MarketScreen" component={MarketScreen} />
        <Stack.Screen name="CouponBookSearch" component={CouponBookSearch} />
        <Stack.Screen name="CouponBookDetail" component={CouponBookDetail} />
        <Stack.Screen name="CouponBookMy" component={CouponBookMy} />
        <Stack.Screen
          name="CouponBookMap"
          component={CouponBookMap}
          options={{animation: 'slide_from_right'}}
        />
        <Stack.Screen name="CouponBookReview" component={CouponBookReview} />

        {/*
         커뮤니티 추가 22.12.23
         */}
        <Stack.Screen name="CommunityMain" component={CommunityMain} />

        <Stack.Screen name="Test" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStackNavigator;
