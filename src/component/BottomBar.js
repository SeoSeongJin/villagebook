import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  useWindowDimensions,
  Platform,
} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {setCurrent} from '../store/reducers/BottomBarReducer';
import {customAlert} from './CustomAlert';
import {_guestAlert} from '../config/utils/modules';
import {Shadow} from 'react-native-shadow-2';
import {setIsLifeStyle} from '../store/reducers/CategoryReducer';
import colors from '../styles/colors';

const BottomBar = ({navigation}) => {
  const {current} = useSelector(state => state.btBarReducer);
  const {isGuest, userInfo} = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  const layout = useWindowDimensions();
  const width = layout.width / 5;
  // console.warn('userINFOOOOO', userInfo);

  return (
    <View style={{...styles.bottomBar}}>
      <Pressable
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          if (!isGuest && userInfo) {
            dispatch(setCurrent(3));
            // navigation.navigate('DiscountMain');
            navigation.navigate('CouponBookMy');
          } else {
            _guestAlert(navigation);
          }
        }}>
        <Image
          source={
            current === 3
              ? require('~/assets/bottom_ic04_cb.png')
              : require('~/assets/bottom_ic04_cb.png')
          }
          style={{width, height: 60, tintColor: colors.primary}}
          resizeMode="contain"
        />
      </Pressable>

      <Pressable
        style={{flex: 1, alignItems: 'center'}}
        onPress={() => {
          // dispatch(setCurrent(2));
          if (!isGuest && userInfo) {
            navigation.navigate('CouponBookMap');
          } else {
            _guestAlert(navigation);
          }
        }}>
        <Image
          source={
            current === 2
              ? require('~/assets/bottom_ic07_on.png')
              : require('~/assets/bottom_ic07_on.png')
          }
          style={{width, height: 60, tintColor: colors.primary}}
          resizeMode="contain"
        />
      </Pressable>

      <Pressable
        style={{flex: 1, alignItems: 'center'}}
        hitSlop={10}
        onPress={() => {
          dispatch(setCurrent(0));
          navigation.navigate('CategoryView', {
            selectedCategory: 'lifestyle',
          });
          // navigation.navigate('Main');
        }}>
        <Image
          source={require('~/assets/bottom_ic06.png')}
          resizeMode="contain"
          style={{
            width: layout.width / 4,
            height: 62,
            top: -10,
            // tintColor: colors.primary,
            // borderWidth: 2,
          }}
        />
      </Pressable>

      <Pressable
        style={{
          flex: 1,
          alignItems: 'center',
        }}
        onPress={() => {
          if (!isGuest && userInfo) {
            // dispatch(setCurrent(1));
            dispatch(setIsLifeStyle(false));
            navigation.navigate('LikeMain');
          } else {
            _guestAlert(navigation);
          }
        }}>
        <Image
          source={
            current === 1
              ? require('~/assets/bottom_ic02_on.png')
              : require('~/assets/bottom_ic02_on.png')
          }
          style={{width, height: 60, tintColor: colors.primary}}
          resizeMode="contain"
        />
      </Pressable>


      <Pressable
        style={{flex: 1, alignItems: 'center'}}
        onPress={() => {
          if (!isGuest && userInfo) {
            dispatch(setCurrent(4));
            navigation.navigate('MyPage');
          } else {
            _guestAlert(navigation);
          }
        }}>
        <Image
          source={
            current === 4
              ? require('~/assets/bottom_ic05_on.png')
              : require('~/assets/bottom_ic05_on.png')
          }
          resizeMode="contain"
          style={{width, height: 60, tintColor: colors.primary}}
        />
      </Pressable>
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    ...Platform.select({
      ios: {},
      android: {
        position: 'absolute',
      },
    }),
    width: '100%',
    height: 60,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    ...Platform.select({
      android: {elevation: 8},
      ios: {
        shadowColor: '#00000029',
        shadowOpacity: 0.6,
        shadowRadius: 1,
        shadowOffset: {
          height: -2,
        },
      },
    }),
  },
});
