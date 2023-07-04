import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../component/Header';
import ImageSwipe from '../../component/menuDetail/ImageSwipe';
import MenuDesc from '../../component/menuDetail/MenuDesc';
import commonStyles from '../../styles/commonStyle';
import colors from '../../styles/colors';
import TextRegular from '../../component/text/TextRegular';
import Dot from '../../component/Dot';
import FastImage from 'react-native-fast-image';
import TextMedium from '../../component/text/TextMedium';
import TextBold from '../../component/text/TextBold';
import TextNotoM from '../../component/text/TextNotoM';
import TextNotoR from '../../component/text/TextNotoR';
import TextNotoB from '../../component/text/TextNotoB';
import DividerL from '../../component/DividerL';
import {Slider} from '@miblanchard/react-native-slider';
import Loading from '../../component/Loading';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {customAlert} from '../../component/CustomAlert';
import {replaceString} from '../../config/utils/Price';
import {useSelector} from 'react-redux';
import MenuReview from './MenuReview';
import MiniMap from '../map/MiniMap';
import Caution from '../../component/Caution';
import AuthStorageModuel from '../../store/localStorage/AuthStorageModuel';
import {Shadow} from 'react-native-shadow-2';
import {getDeviceId, hasNotch} from 'react-native-device-info';
import {setIsLifeStyle} from '../../store/reducers/CategoryReducer';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

const MenuDetail = ({navigation, route}) => {
  const {
    mutateTopMenu,
    mutateStoreInfo,
    mutateAllMunu,
    mutateServiceTime,
    mutateGetStoreService,
  } = useCustomMutation();
  const {savedItem} = useSelector(state => state.cartReducer);
  const cartStore = useSelector(state => state.cartReducer);
  const {userInfo} = useSelector(state => state.authReducer);
  const {isLifeStyle} = useSelector(state => state.categoryReducer);

  const routeData = route.params;
  console.warn('routeData', routeData);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [temp, setTemp] = useState();
  const [headerTrigger, setHeaderTrigger] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [selected, setSelected] = useState({idx: '', isScrolling: false});

  const scrollRef = useRef();
  const scrollRefSub = useRef();
  const focusTarget = useRef([]);
  const chipTarget = useRef([]);

  const dispatch = useDispatch();
  const _init = () => {
    // if (!userInfo) {
    //   Alert.alert('알림', '로그인이 필요합니다.', [
    //     {
    //       text: '로그인 하러 가기',
    //       onPress: () =>
    //         navigation.reset({
    //           routes: [{name: 'Login'}],
    //         }),
    //     },
    //   ]);
    //   return;
    // }

    console.log('_init data1', routeData);
    const data = {
      jumju_id: routeData.jumju_id,
      jumju_code: routeData.jumju_code,
      jumju_type: routeData.category,
      mt_id: userInfo.mt_id,
    };
    console.log('_init data', data);
    mutateStoreInfo.mutate(data);
  };

  const _getTopMenu = () => {
    const data = {
      jumju_id: routeData.jumju_id,
      jumju_code: routeData.jumju_code,
    };
    mutateTopMenu.mutate(data);
  };

  const _getAllMenu = () => {
    const data = {
      jumju_id: routeData.jumju_id,
      jumju_code: routeData.jumju_code,
    };
    mutateAllMunu.mutate(data);
  };

  const _getServiceTime = () => {
    const data = {
      jumju_id: routeData.jumju_id,
      jumju_code: routeData.jumju_code,
    };
    mutateServiceTime.mutate(data);
  };

  const _getStoreService = () => {
    const data = {
      jumju_id: routeData.jumju_id,
      jumju_code: routeData.jumju_code,
    };
    mutateGetStoreService.mutate(data, {
      onSuccess: e => {
        console.log('## service', e);
      },
    });
  };

  const _calcTotalPrice = () => {
    let temp = 0;
    savedItem.savedItems.map((item, index) => {
      temp += item.totalPrice;
    });
    return temp;
  };

  // if (route.params.link) {
  //   useFocusEffect(
  //     useCallback(() => {
  //       _init();
  //       _getTopMenu();
  //       _getAllMenu();
  //       _getServiceTime();
  //       _getStoreService();
  //     }, []),
  //   );
  // } else {
  //   useEffect(() => {
  //     _init();
  //     _getTopMenu();
  //     _getAllMenu();
  //     _getServiceTime();
  //     _getStoreService();
  //   }, [route.params]);
  // }

  useEffect(() => {
    dispatch(setIsLifeStyle(false));
    if (!isLifeStyle) {
      _init();
      _getTopMenu();
      _getAllMenu();
      _getServiceTime();
      _getStoreService();
    }
  }, [route.params, isLifeStyle]);

  useEffect(() => {
    if (chipTarget.current[selected.idx]) {
      chipTarget.current[selected.idx].measureLayout(
        scrollRefSub.current,
        (left, top, width, height) => {
          scrollRefSub.current.scrollTo({
            x: left - layout.width / 3 - 10,
            y: 0,
            animated: true,
          });
        },
      );
    }
  }, [selected]);

  const _cartStorage = async () => {
    let temp = savedItem;
    temp = {
      ...temp,
      logo: cartStore.storeLogoUrl,
      // totalPrice,
    };
    await AuthStorageModuel._setCartData(temp);
  };

  useEffect(() => {
    _cartStorage();
  }, [cartStore]);

  // console.log('store', savedItem);
  if (
    mutateStoreInfo.isLoading ||
    mutateTopMenu.isLoading ||
    mutateAllMunu.isLoading ||
    mutateGetStoreService.isLoading ||
    !mutateStoreInfo.data ||
    !mutateTopMenu.data ||
    !mutateAllMunu.data ||
    !mutateGetStoreService.data
  )
    return <Loading />;

  const StoreInfo = mutateStoreInfo.data.data.arrItems;
  const StoreAllMenu = mutateAllMunu.data.data.arrItems;
  const StoreTopMenu = mutateTopMenu.data.data.arrItems;
  const StoreServiceTime = mutateServiceTime?.data?.data?.arrItems;
  const StoreServiceTimes = StoreServiceTime?.serviceTime[0];
  const StoreBreakeTimes = StoreServiceTime?.serviceBreakTime[0];
  const StoreService = mutateGetStoreService.data.data.arrItems;

  // console.warn('StoreInfo', StoreInfo);
  // console.log('StoreTopMenu', StoreTopMenu);
  // console.log('StoreTopMenu', StoreAllMenu);

  const _pressMenu = item => {
    if (StoreInfo.isOpen === false)
      return customAlert('알림', '현재 가게는 오픈 준비중 입니다.');
    navigation.navigate('OptionSelect', {
      it_id: item.it_id,
      jumju_id: routeData.jumju_id,
      jumju_code: routeData.jumju_code,
      mb_company: routeData.mb_company,
      it_img1: item.it_img1,
      store_logo: StoreInfo.store_logo,
      category: routeData.category,
    });
  };

  const _getIphoneVersion = () => {
    return getDeviceId().split(',')[0].slice(6);
  };

  return (
    <>
      {/* <SafeAreaView style={{flex: -1, backgroundColor: 'white'}} edges={} /> */}
      <SafeAreaView
        style={{
          ...commonStyles.safeAreaStyle,
          backgroundColor: StoreInfo.isOpen
            ? colors.primary
            : colors.borderColor,
        }}
        edges={
          savedItem.savedItems.length > 0 || !StoreInfo.isOpen
            ? ['bottom', 'left', 'right']
            : [
                // 'bottom',
                'left',
                'right',
              ]
        }
      >
        <ScrollView
          ref={scrollRef}
          stickyHeaderIndices={[3]}
          style={{backgroundColor: 'white'}}
          showsVerticalScrollIndicator={false}
          bounces={false}
          alwaysBounceVertical={false}
          // contentOffset={{x: 0, y: 100}}
          // scrollEnabled={false}
          // contentContainerStyle={{paddingBottom: 60}}
          scrollEventThrottle={100}
          onScrollBeginDrag={e => {
            if (selected.isScrolling !== true) {
              setSelected({...selected, isScrolling: true});
            }
          }}
          onScroll={e => {
            const positionY = e.nativeEvent.contentOffset.y;
            if (positionY >= 300 && headerTrigger === false)
              setHeaderTrigger(true);
            if (positionY <= 300 && headerTrigger === true)
              setHeaderTrigger(false);

            if (positionY + 200 >= temp && trigger === false) setTrigger(true);
            if (positionY + 200 <= temp && trigger === true) setTrigger(false);
            if (selected.isScrolling && index === 0) {
              mutateAllMunu.data.data.arrItems?.map((item, index) => {
                focusTarget.current[index].measureLayout(
                  scrollRef.current,
                  (left, top, width, height) => {
                    if (
                      positionY > top - 100 &&
                      positionY < top + 30 &&
                      selected.idx !== index
                    ) {
                      setSelected({...selected, idx: index});
                    }
                  },
                );
              });
            }
          }}
        >
          <Header
            title={''}
            showLike={true}
            showShare={true}
            iconColor={'white'}
            storeInfo={StoreInfo}
            navigation={navigation}
            categoryMain={routeData.category}
            style={{
              backgroundColor: 'rgba(0,0,0,0)',
              position: 'absolute',
              marginTop: hasNotch() ? '9%' : null,
              zIndex: 100,
            }}
          />
          <ImageSwipe images={mutateStoreInfo.data.data.arrItems.store_image} />
          <MenuDesc
            categoryMain={routeData.category}
            info={mutateStoreInfo.data}
            navigation={navigation}
            routeData={routeData}
            likeCount={StoreInfo.mb_zzim_count}
          />

          <SafeAreaView
            style={{
              backgroundColor: trigger ? 'white' : 'rgba(0,0,0,0)',
              // paddingTop: 0,
              marginTop: hasNotch() ? -40 : 0,
            }}
            edges={['top']}
          >
            {/* <View> */}
            {/* 메뉴, 정보, 리뷰 탭 */}
            <View
              style={{
                flexDirection: 'row',
                // backgroundColor: 'white',
                // borderTopColor: colors.borderColor,
                height: 50,
                zIndex: 1000,
              }}
            >
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopWidth: index === 0 ? 2 : 1,
                  borderBottomWidth: index === 0 ? 0 : 1,
                  borderRightWidth: index === 0 ? 1 : 0,
                  borderRightColor: colors.borderColor,
                  borderTopColor:
                    index === 0 ? colors.borderColor22 : colors.borderColor,
                  borderBottomColor: colors.borderColor,
                  zIndex: 1000,
                }}
                onPress={() => {
                  setIndex(0);
                }}
              >
                <TextMedium style={{fontSize: 17}}>메뉴</TextMedium>
              </Pressable>
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopWidth: index === 1 ? 2 : 1,
                  borderBottomWidth: index === 1 ? 0 : 1,
                  borderRightWidth: index === 1 ? 1 : 0,
                  borderRightColor: colors.borderColor,
                  borderLeftWidth: index === 1 ? 1 : 0,
                  borderLeftColor: colors.borderColor,
                  borderTopColor:
                    index === 1 ? colors.borderColor22 : colors.borderColor,
                  borderBottomColor: colors.borderColor,
                }}
                onPress={() => {
                  setIndex(1);
                }}
              >
                <TextMedium style={{fontSize: 17}}>정보</TextMedium>
              </Pressable>
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopWidth: index === 2 ? 2 : 1,
                  borderBottomWidth: index === 2 ? 0 : 1,
                  borderLeftWidth: index === 2 ? 1 : 0,
                  borderLeftColor: colors.borderColor,
                  borderTopColor:
                    index === 2 ? colors.borderColor22 : colors.borderColor,
                  borderBottomColor: colors.borderColor,
                }}
                onPress={() => {
                  setIndex(2);
                }}
              >
                <TextMedium style={{fontSize: 17}}>리뷰</TextMedium>
              </Pressable>
            </View>

            <View
              style={{
                height: index === 0 ? 'auto' : 0,
                top: -1,
                // position: 'absolute',
                zIndex: 500,
                opacity: trigger && index === 0 ? 1 : 0,
                // zIndex: trigger && index === 0 ? 1000 : -1,
                backgroundColor: 'white',
                minWidth: layout.width,
                // paddingTop: 30,
              }}
            >
              <ScrollView
                horizontal
                ref={scrollRefSub}
                // contentContainerStyle={{backgroundColor: 'white'}}
                showsHorizontalScrollIndicator={false}
              >
                {mutateAllMunu.data.data.arrItems?.map((item, index) => (
                  <Pressable
                    disabled={!trigger && index === 0}
                    key={index}
                    ref={el => (chipTarget.current[index] = el)}
                    onPress={() => {
                      focusTarget.current[index].measureLayout(
                        scrollRef.current,
                        (left, top, width, height) => {
                          scrollRef.current.scrollTo({
                            y: top - 150,
                            animated: true,
                          });
                          console.log('position', left, top, width, height);
                        },
                      );

                      chipTarget.current[index].measureLayout(
                        scrollRefSub.current,
                        (left, top, width, height) => {
                          console.log('widht', width);
                          scrollRefSub.current.scrollTo({
                            x: left - layout.width / 3 - 10,
                            animated: true,
                          });
                        },
                      );
                      setSelected({idx: index, isScrolling: false});
                    }}
                    style={{
                      height: 34,
                      // width: chipWidth,
                      minWidth: 67,
                      backgroundColor:
                        selected.idx === index ? colors.primary : 'white',
                      borderWidth: 1,
                      borderColor:
                        selected.idx === index ? 'white' : colors.colorE3,
                      marginVertical: 10,
                      paddingHorizontal: 5,
                      marginHorizontal: 5,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TextMedium
                      style={{
                        fontSize: 14,
                        color:
                          selected.idx === index ? 'white' : colors.fontColor2,
                      }}
                    >
                      {item.ca_name}
                    </TextMedium>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            {/* </View> */}
          </SafeAreaView>
          {/* 메뉴 탭 */}
          {index === 0 && (
            <>
              <View
                style={{flex: 1}}
                onLayout={e => {
                  setTemp(e.nativeEvent.layout.y + 20);
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 22,
                    paddingBottom: 29,
                    top: -20,
                  }}
                >
                  <TextRegular style={{fontSize: 15}}>
                    {StoreInfo.store_service?.do_jumju_introduction}
                  </TextRegular>
                </View>
                <View
                  style={{
                    flex: 1,
                    paddingTop: 30,
                    paddingBottom: 20,
                    paddingHorizontal: 22,
                    backgroundColor: colors.couponBG,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 11,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Dot
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 8 / 2,
                        backgroundColor: colors.borderColor22,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: 'CoreGothicD-CoreGothicDBold',
                        color: colors.fontColor2,
                        fontSize: 22,
                        marginHorizontal: 14,
                      }}
                    >
                      대표메뉴
                    </Text>
                    <Dot
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 8 / 2,
                        backgroundColor: colors.borderColor22,
                      }}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    {/* 대표메뉴 */}
                    {/* OptionSelect route data 추후 수정 필요 */}
                    {StoreTopMenu?.map((item, index) => (
                      <Pressable
                        onPress={() => {
                          _pressMenu(item);
                        }}
                        key={index}
                        style={{
                          flex: 1,
                          padding: 22,
                          backgroundColor: 'white',
                          borderWidth: 1,
                          borderColor: colors.primary,
                          marginBottom: 10,
                          borderRadius: 12,
                        }}
                      >
                        <View style={{flexDirection: 'row'}}>
                          <Shadow distance={4} offset={[0, 2]}>
                            <View
                              style={{
                                width: 80,
                                height: 80,
                                borderWidth: 1,
                                borderRadius: 10,
                                marginRight: 15,
                                borderColor: colors.borderColor,
                                overflow: 'hidden',
                              }}
                            >
                              <FastImage
                                source={
                                  item.it_img1
                                    ? {uri: item.it_img1}
                                    : '~/assets/no_img.png'
                                }
                                resizeMode={FastImage.resizeMode.cover}
                                style={{flex: 1}}
                              />
                            </View>
                          </Shadow>
                          <View style={{flex: 1}}>
                            <TextMedium
                              style={{fontSize: 17, color: colors.fontColor2}}
                            >
                              {item.it_name}
                            </TextMedium>
                            <TextMedium
                              numberOfLines={2}
                              style={{fontSize: 12, color: colors.fontColor8}}
                            >
                              {item.it_basic}
                            </TextMedium>
                          </View>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                          <TextBold
                            style={{fontSize: 17, color: colors.fontColor2}}
                          >
                            {replaceString(item.it_price)}원
                          </TextBold>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {StoreAllMenu?.map((item, index) => (
                  <View key={index}>
                    <View
                      style={{
                        height: 50,
                        paddingVertical: 15,
                        paddingHorizontal: 22,
                        borderBottomWidth: 1,
                        borderColor: colors.borderColor,
                      }}
                    >
                      <Text style={{color: colors.fontColor2}}>
                        {item.ca_name}
                      </Text>
                    </View>
                    <View
                      key={index}
                      ref={el => (focusTarget.current[index] = el)}
                      style={{
                        flex: 1,
                        backgroundColor: 'white',
                      }}
                    >
                      {/* ALL */}
                      <View style={{flex: 1}}>
                        {item.menus.map((item, index) => (
                          <Pressable
                            onPress={() => {
                              _pressMenu(item);
                            }}
                            key={index}
                            style={{
                              flex: 1,
                              padding: 22,
                              backgroundColor: 'white',
                              borderBottomWidth: 1,
                              borderColor: colors.borderColor,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <Shadow distance={4} offset={[0, 2]}>
                                <View
                                  style={{
                                    width: 80,
                                    height: 80,
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    marginRight: 15,
                                    borderColor: colors.borderColor,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <FastImage
                                    source={
                                      item.it_img1
                                        ? {uri: item.it_img1}
                                        : require('~/assets/no_img.png')
                                    }
                                    resizeMode={FastImage.resizeMode.cover}
                                    style={{flex: 1}}
                                  />
                                </View>
                              </Shadow>
                              <View style={{flex: 1}}>
                                <TextMedium
                                  style={{
                                    fontSize: 17,
                                    color: colors.fontColor2,
                                  }}
                                >
                                  {item.it_name}
                                </TextMedium>
                                <TextMedium
                                  numberOfLines={2}
                                  style={{
                                    fontSize: 12,
                                    color: colors.fontColor8,
                                  }}
                                >
                                  {item.it_basic}
                                </TextMedium>
                                <TextBold
                                  style={{
                                    fontSize: 17,
                                    color: colors.fontColor2,
                                  }}
                                >
                                  {replaceString(item.it_price)}
                                </TextBold>
                              </View>
                            </View>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
          {/* 정보 탭 */}
          {index === 1 && (
            <View style={{flex: 1}}>
              <View
                style={{
                  paddingVertical: 32,
                  paddingHorizontal: 22,
                }}
              >
                <TextNotoM style={{fontSize: 17}}>매장정보</TextNotoM>
                <View
                  style={{
                    flex: 1,
                    paddingTop: 13,
                    flexDirection: 'row',
                  }}
                >
                  <View style={{}}>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                      <View style={{width: 100}}>
                        <TextRegular style={{color: colors.fontColor99}}>
                          상호
                        </TextRegular>
                      </View>
                      <TextRegular style={{...styles.subTitleTakeout}}>
                        {StoreInfo.mb_biz_name}
                      </TextRegular>
                    </View>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                      <View style={{width: 100}}>
                        <TextRegular style={{color: colors.fontColor99}}>
                          대표자명
                        </TextRegular>
                      </View>
                      <TextRegular style={{...styles.subTitleTakeout}}>
                        {StoreInfo.mb_name}
                      </TextRegular>
                    </View>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                      <View style={{width: 100}}>
                        <TextRegular style={{color: colors.fontColor99}}>
                          전화번호
                        </TextRegular>
                      </View>
                      <TextRegular style={{...styles.subTitleTakeout}}>
                        {StoreInfo.mb_tel}
                      </TextRegular>
                    </View>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                      <View style={{width: 100}}>
                        <TextRegular style={{color: colors.fontColor99}}>
                          사업자번호
                        </TextRegular>
                      </View>
                      <TextRegular style={{...styles.subTitleTakeout}}>
                        {StoreInfo.mb_biz_no}
                      </TextRegular>
                    </View>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                      <View style={{width: 100}}>
                        <TextRegular style={{color: colors.fontColor99}}>
                          주소
                        </TextRegular>
                      </View>
                      <TextRegular style={{...styles.subTitleTakeout}}>
                        {StoreInfo.mb_addr1 + ' ' + StoreInfo.mb_addr2}
                      </TextRegular>
                    </View>
                  </View>
                </View>
              </View>
              {/* <View style={{marginBottom: 20}}>
                <MiniMap lat={StoreInfo.mb_lat} lng={StoreInfo.mb_lng} />
              </View> */}
              <DividerL />
              <View
                style={{
                  paddingVertical: 32,
                  paddingHorizontal: 22,
                }}
              >
                <TextNotoM style={{fontSize: 17}}>영업시간</TextNotoM>
                <View
                  style={{
                    flex: 1,
                    paddingTop: 13,
                    flexDirection: 'row',
                  }}
                >
                  <View style={{}}>
                    <TextRegular
                      style={{color: colors.fontColor99, marginBottom: 11}}
                    >
                      영업일
                    </TextRegular>
                    <TextRegular
                      style={{color: colors.fontColor99, marginBottom: 11}}
                    >
                      영업시간
                    </TextRegular>
                    {/* <TextRegular
                      style={{color: colors.fontColor99, marginBottom: 11}}>
                      토요일
                    </TextRegular> */}
                    <TextRegular
                      style={{color: colors.fontColor99, marginBottom: 11}}
                    >
                      BREAK TIME
                    </TextRegular>
                    <TextRegular
                      style={{color: colors.fontColor99, marginBottom: 11}}
                    >
                      휴무일
                    </TextRegular>
                  </View>
                  {console.log(
                    '@@@@@@@@@@@@@@@@@ StoreServiceTime',
                    StoreServiceTime,
                  )}
                  <View style={{marginLeft: 22, flex: 1}}>
                    <TextRegular
                      style={{color: colors.fontColor3, marginBottom: 11}}
                    >
                      {StoreServiceTimes?.service_open ?? '-'}
                    </TextRegular>
                    <TextRegular
                      style={{color: colors.fontColor3, marginBottom: 11}}
                    >
                      {!StoreServiceTimes
                        ? '-'
                        : StoreServiceTimes?.service_stime +
                          ' ~ ' +
                          StoreServiceTimes?.service_etime}
                    </TextRegular>
                    <TextRegular
                      style={{color: colors.fontColor3, marginBottom: 11}}
                    >
                      {!StoreBreakeTimes?.service_breakstime &&
                      !StoreBreakeTimes?.service_breaketime
                        ? '-'
                        : StoreBreakeTimes?.service_breakstime +
                          ' ~ ' +
                          StoreBreakeTimes?.service_breaketime}
                    </TextRegular>
                    <TextRegular style={{color: colors.fontColor3}}>
                      {StoreServiceTime?.serviceHoilday ?? '-'}
                    </TextRegular>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* 리뷰 탭 */}
          {index === 2 && (
            <>
              <MenuReview storeInfo={StoreInfo} />
            </>
          )}

          {index !== 2 && (
            <View style={{paddingBottom: hasNotch() ? 50 : 0}}>
              <DividerL />
              <View
                style={{
                  paddingHorizontal: 22,
                  paddingVertical: 20,
                  backgroundColor: 'white',
                }}
              >
                <TextNotoM
                  style={{
                    fontSize: 17,
                    color: colors.fontColor2,
                    includeFontPadding: false,
                    marginBottom: 7,
                  }}
                >
                  원산지 표기
                </TextNotoM>
                <TextNotoR
                  style={{
                    fontSize: 13,
                    color: colors.fontColor8,
                    includeFontPadding: false,
                  }}
                >
                  {StoreInfo.store_service.do_jumju_origin}
                </TextNotoR>
              </View>
              <Caution />
            </View>
          )}
        </ScrollView>

        {/* 장바구니 아이템 존재시 카트 버튼 표시 */}
        {(savedItem.savedItems.length > 0 || !StoreInfo.isOpen) && (
          <View style={{flex: 1}}>
            <Pressable
              onPress={() => {
                StoreInfo.isOpen
                  ? navigation.navigate('SummitOrder', {data: StoreInfo})
                  : null;
              }}
              style={{
                position: 'absolute',
                // top: layout.height - 60,
                bottom: 0,
                height: 60,
                width: '100%',
                backgroundColor: StoreInfo.isOpen
                  ? colors.primary
                  : colors.borderColor,
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {StoreInfo.isOpen && (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: 'white',
                        width: 30,
                        height: 30,
                        borderRadius: 30 / 2,
                        marginLeft: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <TextBold
                        style={{
                          fontSize: 16,
                          color: colors.primary,
                          includeFontPadding: false,
                        }}
                      >
                        {savedItem.savedItems.length > 9
                          ? '9+'
                          : savedItem.savedItems.length}
                      </TextBold>
                    </View>
                  </View>
                )}

                <View style={{flex: 1, alignItems: 'center'}}>
                  <TextBold
                    style={{
                      fontSize: 18,
                      color: StoreInfo.isOpen ? 'white' : 'gray',
                    }}
                  >
                    {StoreInfo.isOpen
                      ? '카트 확인하기'
                      : '동네사람들을 만날 준비 중이에요!'}
                  </TextBold>
                </View>

                {StoreInfo.isOpen && (
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <TextBold style={{fontSize: 16, color: 'white'}}>
                      {replaceString(_calcTotalPrice())}원
                    </TextBold>
                  </View>
                )}
              </View>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default MenuDetail;

const styles = StyleSheet.create({
  titleTakout: {
    color: colors.fontColor99,
    marginVertical: 11,
  },
  subTitleTakeout: {
    color: colors.fontColor3,
  },
});
