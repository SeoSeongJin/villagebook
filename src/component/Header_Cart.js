import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  Linking,
  Pressable,
  Share,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {_guestAlert} from '../config/utils/modules';
import {useCustomMutation} from '../hooks/useCustomMutation';
import colors from '../styles/colors';
import {customAlert} from './CustomAlert';
import TextBold from './text/TextBold';
import TextMedium from './text/TextMedium';

const Header = ({
                  title,
                  fadeTitle,
                  navigation,
                  style,
                  showLogo,
                  showCart,
                  showLike,
                  showNoti,
                  showHome,
                  showShare,
                  iconColor,
                  category,
                  categoryMain,
                  isOption,
                  isPayment,
                  isSummit,
                  isSearch,
                  storeInfo,
                }) => {
  const {currentCategory} = useSelector(state => state.categoryReducer);
  const {optionHeader} = useSelector(state => state.menuReducer);
  const {currentStoreCode, savedItem} = useSelector(state => state.cartReducer);
  const {userInfo} = useSelector(state => state.authReducer);

  const [like, setLike] = useState();
  const {isGuest} = useSelector(state => state.authReducer);
  const {resultCount} = useSelector(state => state.searchReducerSub);

  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (isOption) {
      if (optionHeader) fadeIn();
      if (!optionHeader) fadeOut();
    }
    // console.log('optionHeader', optionHeader);
  }, [optionHeader]);

  const _getCount = () => {
    switch (title) {
      case '맛집 검색':
        return resultCount.countFood ?? '';
      case '마켓 검색':
        return resultCount.countMarket ?? '';
      case '동네정보 검색':
        return resultCount.countLifestyle ?? '';
      default:
        return '';
    }
  };

  return (
    <>
      {fadeTitle && (
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            height: 57,
            backgroundColor: 'white',
            opacity: fadeAnim,
            zIndex: 100,
            justifyContent: 'center',
          }}>
          <TextBold style={{marginLeft: 70}}>{fadeTitle}</TextBold>
        </Animated.View>
      )}

      <View
        style={[
          {
            width: '100%',
            height: 57,
            backgroundColor: 'white',
            // paddingBottom: 10,
            backgroundColor: `rgba(255,255,255,0)`,
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 14,
          },
          style,
        ]}>
        <Pressable
          hitSlop={15}
          // style={{zIndex: 1000}}
          onPress={() => {
            console.log('pressed');
            if (isSummit) {
              navigation.navigate('MenuDetail2', {
                jumju_id: currentStoreCode.jumju_id,
                jumju_code: currentStoreCode.code,
              });
            } else {
              // if (!showLogo && navigation.canGoBack()) navigation.goBack();
              if (!showLogo) navigation.goBack();
              else
                navigation.navigate('CategoryView', {
                  selectedCategory: 'lifestyle',
                });
              // else navigation.navigate('Main');
            }
          }}>
          {showLogo ? (
            <Image
              source={require('~/assets/logo.png')}
              style={{height: 23, width: 94, tintColor: '#00C2FF'}}
              resizeMode={'contain'}
            />
          ) : (
            <Image
              source={
                isPayment
                  ? require('~/assets/pop_close.png')
                  : require('~/assets/top_ic_history.png')
              }
              style={{
                height: 30,
                width: 30,
                tintColor: iconColor ? iconColor : null,
              }}
              resizeMode={'contain'}
            />
          )}
        </Pressable>

        {/* 타이틀 */}
        {title ? (
          <View
            style={{
              flex: 1,
              marginLeft: 18,
              flexDirection: 'row',
            }}>
            <TextMedium
              style={{
                fontSize: 17,
                color: colors.fontColor2,
              }}>
              {title}{' '}
            </TextMedium>
            {title !== '검색' && (
              <TextMedium style={{fontSize: 17, color: colors.primary}}>
                {_getCount()}
              </TextMedium>
            )}
          </View>
        ) : null}
        {category && (
          <View
            style={{
              flex: 1,
              marginLeft: 18,
            }}>
            <TextMedium
              style={{
                fontSize: 17,
                color: colors.fontColor2,
              }}>
              {currentCategory}
            </TextMedium>
          </View>
        )}

        <View style={{flexDirection: 'row', marginLeft: 'auto'}}>
          {(showNoti || showLike) && (
            <Pressable
              hitSlop={10}
              onPress={() => {
                if (!isGuest && userInfo) {
                  if (showNoti) navigation.navigate('PushList');
                } else {
                  _guestAlert(navigation);
                }
              }}>
              <Image
                source={
                  showNoti ? require('~/assets/top_ball.png') : null
                  // : require('~/assets/top_heart.png')
                }
                style={{
                  height: 30,
                  width: 30,
                  marginRight: 10,
                  tintColor:
                    storeInfo && like === 'Y'
                      ? colors.primary
                      : iconColor
                        ? iconColor
                        : null,
                }}
                resizeMode={'contain'}
              />
            </Pressable>
          )}
          {showHome && (
            <>
              <Pressable
                hitSlop={10}
                onPress={() => {
                  navigation.navigate('Main');
                }}>
                <Image
                  source={require('~/assets/top_home.png')}
                  style={{
                    height: 30,
                    width: 30,
                    marginRight: 10,
                    tintColor:
                      storeInfo && like === 'Y'
                        ? colors.primary
                        : iconColor
                          ? iconColor
                          : null,
                  }}
                  resizeMode={'contain'}
                />
              </Pressable>
            </>
          )}
          {isSearch && (
            <>
              <Pressable
                hitSlop={10}
                onPress={() => {
                  navigation.navigate('CouponBookSearch');
                }}>
                <Image
                  source={require('~/assets/ico_search.png')}
                  style={{
                    height: 23,
                    width: 23,
                    marginRight: 10,
                    tintColor: colors.primary,
                  }}
                  resizeMode={'contain'}
                />
              </Pressable>
            </>
          )}
          {(showCart || showShare) && (
            <Pressable
              hitSlop={10}
              onPress={() => {
                if (!isGuest && userInfo) {
                  if (showCart) navigation.navigate('SummitOrder');
                } else {
                  _guestAlert(navigation);
                }

                // if (!showCart) _share();
              }}>
              {showCart && (
                <>
                  <View
                    style={{
                      position: 'absolute',
                      bottom: -1,
                      right: -3,
                      width: 16,
                      height: 16,
                      borderRadius: 16 / 2,
                      backgroundColor: colors.primary,
                      zIndex: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TextBold
                      style={{
                        color: 'white',
                        includeFontPadding: false,
                        fontSize: 11,
                      }}>
                      {savedItem.savedItems.length > 9
                        ? '9+'
                        : savedItem.savedItems.length}
                    </TextBold>
                  </View>
                </>
              )}
              <Image
                source={showCart ? require('~/assets/top_cart.png') : null}
                style={{
                  height: 30,
                  width: 30,
                  tintColor: iconColor ? iconColor : null,
                }}
                resizeMode={'contain'}
              />
            </Pressable>
          )}
        </View>
      </View>
    </>
  );
};

export default Header;
