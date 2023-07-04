import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  Alert,
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
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
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
import {FlatList} from 'react-native';
import {hasNotch} from 'react-native-device-info';
import MenuHeader from './MenuHeader';
import {setIsLifeStyle} from '../../store/reducers/CategoryReducer';
import {useDispatch} from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';

const MenuDetail2 = ({navigation, route}) => {
  const [index, setIndex] = useState(0);
  const [showHeader, setShowHeader] = useState(false);
  const [tabPosition, setTabPosition] = useState();
  const [showFilter, setShowFilter] = useState(false);
  const [res, setRes] = useState();
  const [temp, setTemp] = useState();
  const [selected, setSelected] = useState({idx: '', isScrolling: false});
  const inset = useSafeAreaInsets();

  const dispatch = useDispatch();
  const layout = useWindowDimensions();

  const routeData = route.params;

  const {userInfo} = useSelector(state => state.authReducer);
  const {savedItem} = useSelector(state => state.cartReducer);
  const cartStore = useSelector(state => state.cartReducer);
  const {isLifeStyle} = useSelector(state => state.categoryReducer);
  const {deliveryType} = useSelector(state => state.deliveryReducer);

  const focusTarget = useRef([]);
  const chipTarget = useRef([]);
  const scrollRefSub = useRef();
  const scrollRef = useRef();
  const containerRef = useRef();

  const {
    mutateStoreInfo,
    mutateAllMunu,
    mutateTopMenu,
    mutateServiceTime,
    mutateGetStoreService,
  } = useCustomMutation();

  const _init = async () => {
    const data = {
      jumju_id: routeData.jumju_id,
      jumju_code: routeData.jumju_code,
      jumju_type: routeData.category,
      bn_id: routeData.bn_id ? routeData.bn_id : '',
      mt_id: userInfo.mt_id,
    };
    const StoreInfo = mutateStoreInfo.mutateAsync(data);

    const data2 = {
      jumju_id: routeData.jumju_id,
      jumju_code: routeData.jumju_code,
    };
    const StoreAllMenu = mutateAllMunu.mutateAsync(data2);
    const StoreTopMenu = mutateTopMenu.mutateAsync(data2);
    const StoreServiceTime = mutateServiceTime.mutateAsync(data2);
    const StoreService = mutateGetStoreService.mutateAsync(data2);

    const res = await Promise.all([
      StoreInfo,
      StoreAllMenu,
      StoreTopMenu,
      StoreServiceTime,
      StoreService,
    ]);

    const temp = [
      {
        StoreInfo: res[0].data.arrItems,
        StoreAllMenu: res[1].data.arrItems,
        StoreTopMenu: res[2].data.arrItems,
        StoreServiceTime: res[3].data.arrItems,
        StoreService: res[4].data.arrItems,
        StoreServiceTimes: res[3].data.arrItems.serviceTime[0],
        StoreBreakeTimes: res[3].data.arrItems.serviceBreakTime[0],
      },
    ];

    console.log('temp', temp);

    if (res) setRes(temp);
  };

  const _calcTotalPrice = () => {
    let temp = 0;
    savedItem.savedItems.map((item, index) => {
      temp += item.totalPrice;
    });
    return temp;
  };

  const _checkLogin = () => {
    if (!userInfo) {
      return Alert.alert('알림', '로그인이 필요합니다.', [
        {
          text: '로그인 하러 가기',
          onPress: () =>
            navigation.reset({
              routes: [{name: 'Login'}],
            }),
        },
      ]);
    }
  };

  const _pressMenu = item => {
    if (!userInfo) {
      return Alert.alert('알림', '로그인이 필요합니다.', [
        {
          text: '로그인 하러 가기',
          onPress: () =>
            navigation.reset({
              routes: [{name: 'Login'}],
            }),
        },
      ]);
    }
    if (res[0].StoreInfo.isOpen === false)
      return customAlert('알림', '현재 가게는 오픈 준비중 입니다.');
    navigation.navigate('OptionSelect', {
      it_id: item.it_id,
      jumju_id: routeData.jumju_id,
      jumju_code: routeData.jumju_code,
      mb_company: routeData.mb_company,
      it_img1: item.it_img1,
      store_logo: res[0].StoreInfo.store_logo,
      category: routeData.category,
    });
  };

  const _scrollToTarget = () => {
    scrollRef.current.scrollToOffset({
      animated: true,
      offset: tabPosition - (inset.top + 60),
    });
  };

  const _copyAdd = async () => {
    if (res) {
      Clipboard.setString(
        res[0].StoreInfo.mb_addr1 + ' ' + res[0].StoreInfo.mb_addr2,
      );
      customAlert('알림', '주소가 복사되었습니다.');
    }

    // ToastAndroid.show('주소가 복사되었습니다.', ToastAndroid.SHORT);
  };

  const renderItem = item => {
    return (
      <SafeAreaView
        edges={['left', 'right']}
        // style={{backgroundColor: 'teal'}}
        style={{marginTop: hasNotch() ? 101 : 57}}>
        <View>
          <View
            //aos
            collapsable={false}
            ref={tempRef2 =>
              tempRef2?.measure((fx, fy, width, height, px, py) => {
                if (!tabPosition) setTabPosition(py);
              })
            }
            style={{
              flexDirection: 'row',
              height: 55,
            }}>
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
                zIndex: 300,
              }}
              onPress={() => {
                _scrollToTarget();
                setIndex(0);
              }}>
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
                zIndex: 300,
              }}
              onPress={() => {
                _scrollToTarget();
                setIndex(1);
              }}>
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
                zIndex: 300,
              }}
              onPress={() => {
                _scrollToTarget();
                setIndex(2);
              }}>
              <TextMedium style={{fontSize: 17}}>리뷰</TextMedium>
            </Pressable>
          </View>
          {index == 0 && (
            <ScrollView
              style={{
                opacity: showFilter ? 1 : 0,
                backgroundColor: 'white',
                top: Platform.OS === 'android' ? -0.1 : null,
              }}
              showsHorizontalScrollIndicator={false}
              horizontal
              ref={scrollRefSub}>
              {item.item?.StoreAllMenu?.map((item, index) => (
                <Pressable
                  disabled={showFilter ? false : true}
                  key={index}
                  ref={el => (chipTarget.current[index] = el)}
                  onPress={() => {
                    focusTarget.current[index].measureLayout(
                      containerRef.current,
                      (z, x, c, v) => {
                        scrollRef.current.scrollToOffset({
                          animated: true,
                          offset: x - (inset.top + 57 + 34 + 55 + 20),
                          //safearea insset, 헤더, 메뉴탭 높이, 가로 스크롤 높이
                        });
                      },
                    );

                    chipTarget.current[index].measureLayout(
                      scrollRefSub.current,
                      (left, top, width, height) => {
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
                  }}>
                  <TextMedium
                    style={{
                      fontSize: 14,
                      color:
                        selected.idx === index ? 'white' : colors.fontColor2,
                    }}>
                    {item.ca_name}
                  </TextMedium>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    );
  };
  useEffect(() => {
    dispatch(setIsLifeStyle(false));
    scrollRef.current?.scrollToOffset({animated: true, offset: 0});
    _init();
  }, [routeData, isLifeStyle]);

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

  if (!res) return <Loading />;

  return (
    <SafeAreaView
      edges={
        savedItem.savedItems.length > 0 || (res && !res[0].StoreInfo.isOpen)
          ? ['bottom', 'left', 'right']
          : [
              // 'bottom',
              'left',
              'right',
            ]
      }
      style={{
        ...commonStyles.safeAreaStyle,
        backgroundColor:
          res && res[0].StoreInfo.isOpen ? colors.primary : colors.borderColor,
      }}>
      <View style={{...commonStyles.safeAreaStyle}} ref={containerRef}>
        <SafeAreaView
          style={{
            zIndex: 100,
            backgroundColor: showHeader ? 'white' : 'rgba(0,0,0,0)',
          }}
          edges={['top']}>
          <View style={{flex: 1}}>
            <Header
              title={res && showHeader && res[0].StoreInfo.mb_company}
              navigation={navigation}
              style={{
                backgroundColor: showHeader ? 'white' : 'rgba(0,0,0,0)',
                position: 'absolute',
                zIndex: 100,
              }}
            />
          </View>
        </SafeAreaView>
        <FlatList
          ref={scrollRef}
          data={res}
          decelerationRate={Platform.OS === 'ios' ? 0.996 : 0.97}
          keyExtractor={(item, index) => index}
          renderItem={item => renderItem(item)}
          overScrollMode="never"
          bounces={false}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
          onScrollBeginDrag={e => {
            if (selected.isScrolling !== true) {
              setSelected({...selected, isScrolling: true});
            }
          }}
          onScroll={e => {
            const offset = e.nativeEvent.contentOffset;
            const positionY = e.nativeEvent.contentOffset.y;

            if (offset.y < tabPosition * 0.25 && showHeader === true)
              setShowHeader(false);
            if (offset.y > tabPosition * 0.35 && showHeader === false)
              setShowHeader(true);

            if (offset.y > tabPosition - 400) setShowFilter(true);
            if (offset.y < tabPosition) setShowFilter(false);

            if (selected.isScrolling && index == 0 && res) {
              res[0].StoreAllMenu?.map((item, index) => {
                focusTarget.current[index].measureLayout(
                  containerRef.current,
                  (left, top, width, height) => {
                    // offset: x - inset.top + 57 + 34 + 55 + 20,
                    //safearea insset, 헤더, 메뉴탭 높이, 가로 스크롤 높이

                    // console.log(index, '//', positionY, top);

                    if (item.menus.length === 0) {
                      if (
                        positionY > top - (inset.top + 140) &&
                        positionY < top - (inset.top + 100) &&
                        selected.idx !== index
                      ) {
                        console.warn('hihi');
                        setSelected({...selected, idx: index});
                      }
                    } else if (item.menus.length < 2) {
                      if (
                        positionY > top - (inset.top + 57 + 55) &&
                        positionY < top &&
                        selected.idx !== index
                      ) {
                        setSelected({...selected, idx: index});
                      }
                    } else if (item.menus.length > 2) {
                      if (
                        positionY > top - (inset.top + 57 + 34 + 55 + 20) &&
                        positionY < top &&
                        selected.idx !== index
                      ) {
                        setSelected({...selected, idx: index});
                      }
                    }
                  },
                );
              });
            }
          }}
          ListEmptyComponent={<Loading />}
          ListHeaderComponentStyle={{zIndex: 3000}}
          ListHeaderComponent={
            // res && (
            //   <MenuHeader
            //     item={res}
            //     routeData={routeData}
            //     navigation={navigation}
            //   />
            // )
            res && (
              <>
                <View
                  style={{
                    zIndex: 3000,
                    paddingBottom: deliveryType === 0 ? 0 : 120,
                    marginBottom: hasNotch() ? -50 : 0,
                  }}>
                  <MenuHeader
                    item={res}
                    routeData={routeData}
                    navigation={navigation}
                  />
                  {(deliveryType === 1 || deliveryType === 2) && (
                    <>
                      <View
                        style={{
                          position: 'absolute',
                          flex: 1,
                          // top: 50,
                          bottom: -30,
                          right: 0,
                          zIndex: 3000,
                          alignSelf: 'flex-end',
                          marginRight: 22,
                          borderWidth: 1,
                          borderRadius: 10,
                          borderColor: colors.borderColor,
                          overflow: 'hidden',
                        }}>
                        <MiniMap
                          lat={res[0].StoreInfo?.mb_lat}
                          lng={res[0].StoreInfo?.mb_lng}
                          isStore
                          width={layout.width - 144}
                          height={130}
                        />

                        <View
                          style={{
                            flexDirection: 'row',
                            height: 40,
                            zIndex: 3000,

                            // width: layout.width - 144,
                          }}>
                          <Pressable
                            // hitSlop={100}
                            onPress={() => {
                              // console.warn('hello');
                              _copyAdd();
                            }}
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRightWidth: 1,
                              borderColor: colors.borderColor,
                            }}>
                            <TextRegular style={{color: colors.fontColor2}}>
                              주소복사
                            </TextRegular>
                          </Pressable>

                          <Pressable
                            onPress={() =>
                              navigation.navigate('Map', {
                                isStore: true,
                                lat: res[0].StoreInfo?.mb_lat,
                                lng: res[0].StoreInfo?.mb_lng,
                              })
                            }
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <TextRegular style={{color: colors.fontColor2}}>
                              지도보기
                            </TextRegular>
                          </Pressable>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              </>
            )
          }
          stickyHeaderIndices={[1]}
          // ListHeaderComponentStyle={{paddingBottom: hasNotch() ? -101 : -57}}
          // ListFooterComponentStyle={{marginTop: -20}}
          ListFooterComponent={
            res && (
              <View>
                {index === 0 && (
                  <>
                    <View
                      style={{flex: 1, marginTop: -20}}
                      onLayout={e => {
                        setTemp(e.nativeEvent.layout.y + 20);
                      }}>
                      <View
                        style={{
                          paddingHorizontal: 22,
                          paddingBottom: 29,
                          // top: -20,
                        }}>
                        <TextRegular style={{fontSize: 15}}>
                          {
                            res[0].StoreInfo.store_service
                              ?.do_jumju_introduction
                          }
                        </TextRegular>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          paddingTop: 30,
                          paddingBottom: 20,
                          paddingHorizontal: 22,
                          backgroundColor: colors.couponBG,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginBottom: 11,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
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
                            }}>
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
                          {res[0].StoreTopMenu?.map((item, index) => (
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
                              }}>
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
                                    }}>
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
                                    style={{
                                      fontSize: 17,
                                      color: colors.fontColor2,
                                    }}>
                                    {item.it_name}
                                  </TextMedium>
                                  <TextMedium
                                    numberOfLines={2}
                                    style={{
                                      fontSize: 12,
                                      color: colors.fontColor8,
                                    }}>
                                    {item.it_basic}
                                  </TextMedium>
                                </View>
                              </View>
                              <View style={{alignItems: 'flex-end'}}>
                                <TextBold
                                  style={{
                                    fontSize: 17,
                                    color: colors.fontColor2,
                                  }}>
                                  {replaceString(item.it_price)}원
                                </TextBold>
                              </View>
                            </Pressable>
                          ))}
                        </View>
                      </View>

                      {res[0].StoreAllMenu?.map((item, index) => (
                        <View
                          key={index}
                          ref={el => {
                            if (el) {
                              focusTarget.current[index] = el;
                            }
                          }}>
                          {/* {console.warn('dafdsfasdf', item)} */}
                          <View
                            style={{
                              height: 50,
                              paddingVertical: 15,
                              paddingHorizontal: 22,
                              borderBottomWidth: 1,
                              borderColor: colors.borderColor,
                            }}>
                            <Text style={{color: colors.fontColor2}}>
                              {item.ca_name}
                            </Text>
                          </View>
                          <View
                            key={index}
                            style={{
                              flex: 1,
                              backgroundColor: 'white',
                            }}>
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
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
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
                                        }}>
                                        <FastImage
                                          source={
                                            item.it_img1
                                              ? {uri: item.it_img1}
                                              : require('~/assets/no_img.png')
                                          }
                                          resizeMode={
                                            FastImage.resizeMode.cover
                                          }
                                          style={{flex: 1}}
                                        />
                                      </View>
                                    </Shadow>
                                    <View style={{flex: 1}}>
                                      <TextMedium
                                        style={{
                                          fontSize: 17,
                                          color: colors.fontColor2,
                                        }}>
                                        {item.it_name}
                                      </TextMedium>
                                      <TextMedium
                                        numberOfLines={2}
                                        style={{
                                          fontSize: 12,
                                          color: colors.fontColor8,
                                        }}>
                                        {item.it_basic}
                                      </TextMedium>
                                      <TextBold
                                        style={{
                                          fontSize: 17,
                                          color: colors.fontColor2,
                                        }}>
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
                      }}>
                      <TextNotoM style={{fontSize: 17}}>매장정보</TextNotoM>
                      <View
                        style={{
                          flex: 1,
                          paddingTop: 13,
                          flexDirection: 'row',
                        }}>
                        <View style={{}}>
                          <View
                            style={{flexDirection: 'row', marginBottom: 10}}>
                            <View style={{width: 100}}>
                              <TextRegular style={{color: colors.fontColor99}}>
                                상호
                              </TextRegular>
                            </View>
                            <TextRegular style={{...styles.subTitleTakeout}}>
                              {res[0].StoreInfo.mb_biz_name}
                            </TextRegular>
                          </View>
                          <View
                            style={{flexDirection: 'row', marginBottom: 10}}>
                            <View style={{width: 100}}>
                              <TextRegular style={{color: colors.fontColor99}}>
                                대표자명
                              </TextRegular>
                            </View>
                            <TextRegular style={{...styles.subTitleTakeout}}>
                              {res[0].StoreInfo.mb_name}
                            </TextRegular>
                          </View>
                          <View
                            style={{flexDirection: 'row', marginBottom: 10}}>
                            <View style={{width: 100}}>
                              <TextRegular style={{color: colors.fontColor99}}>
                                전화번호
                              </TextRegular>
                            </View>
                            <TextRegular style={{...styles.subTitleTakeout}}>
                              {res[0].StoreInfo.mb_tel}
                            </TextRegular>
                          </View>
                          <View
                            style={{flexDirection: 'row', marginBottom: 10}}>
                            <View style={{width: 100}}>
                              <TextRegular style={{color: colors.fontColor99}}>
                                사업자번호
                              </TextRegular>
                            </View>
                            <TextRegular style={{...styles.subTitleTakeout}}>
                              {res[0].StoreInfo.mb_biz_no}
                            </TextRegular>
                          </View>
                          <View
                            style={{flexDirection: 'row', marginBottom: 10}}>
                            <View style={{width: 100}}>
                              <TextRegular style={{color: colors.fontColor99}}>
                                주소
                              </TextRegular>
                            </View>
                            <TextRegular style={{...styles.subTitleTakeout}}>
                              {res[0].StoreInfo.mb_addr1 +
                                ' ' +
                                res[0].StoreInfo.mb_addr2}
                            </TextRegular>
                          </View>
                        </View>
                      </View>
                    </View>

                    <DividerL />
                    <View
                      style={{
                        paddingVertical: 32,
                        paddingHorizontal: 22,
                      }}>
                      <TextNotoM style={{fontSize: 17}}>영업시간</TextNotoM>
                      <View
                        style={{
                          flex: 1,
                          paddingTop: 13,
                          flexDirection: 'row',
                        }}>
                        <View style={{}}>
                          <TextRegular
                            style={{
                              color: colors.fontColor99,
                              marginBottom: 11,
                            }}>
                            영업일
                          </TextRegular>
                          <TextRegular
                            style={{
                              color: colors.fontColor99,
                              marginBottom: 11,
                            }}>
                            영업시간
                          </TextRegular>
                          <TextRegular
                            style={{
                              color: colors.fontColor99,
                              marginBottom: 11,
                            }}>
                            BREAK TIME
                          </TextRegular>
                          <TextRegular
                            style={{
                              color: colors.fontColor99,
                              marginBottom: 11,
                            }}>
                            휴무일
                          </TextRegular>
                        </View>

                        <View style={{marginLeft: 22, flex: 1}}>
                          <TextRegular
                            style={{
                              color: colors.fontColor3,
                              marginBottom: 11,
                            }}>
                            {res[0].StoreServiceTimes?.service_open ?? '-'}
                          </TextRegular>
                          <TextRegular
                            style={{
                              color: colors.fontColor3,
                              marginBottom: 11,
                            }}>
                            {!res[0].StoreServiceTimes
                              ? '-'
                              : res[0].StoreServiceTimes?.service_stime +
                                ' ~ ' +
                                res[0].StoreServiceTimes?.service_etime}
                          </TextRegular>
                          <TextRegular
                            style={{
                              color: colors.fontColor3,
                              marginBottom: 11,
                            }}>
                            {!res[0].StoreBreakeTimes?.service_breakstime &&
                            !res[0].StoreBreakeTimes?.service_breaketime
                              ? '-'
                              : res[0].StoreBreakeTimes?.service_breakstime +
                                ' ~ ' +
                                res[0].StoreBreakeTimes?.service_breaketime}
                          </TextRegular>
                          <TextRegular style={{color: colors.fontColor3}}>
                            {res[0].StoreServiceTime?.serviceHoilday ?? '-'}
                          </TextRegular>
                        </View>
                      </View>
                    </View>
                  </View>
                )}

                {/* 리뷰 탭 */}
                {index === 2 && (
                  <View style={{marginBottom: 55}}>
                    <MenuReview storeInfo={res[0].StoreInfo} />
                  </View>
                )}
                {index !== 2 && (
                  <View style={{paddingBottom: hasNotch() ? 50 : 0}}>
                    <DividerL />
                    <View
                      style={{
                        paddingHorizontal: 22,
                        paddingVertical: 20,
                        backgroundColor: 'white',
                      }}>
                      <TextNotoM
                        style={{
                          fontSize: 17,
                          color: colors.fontColor2,
                          includeFontPadding: false,
                          marginBottom: 7,
                        }}>
                        원산지 표기
                      </TextNotoM>
                      <TextNotoR
                        style={{
                          fontSize: 13,
                          color: colors.fontColor8,
                          includeFontPadding: false,
                        }}>
                        {res && res[0].StoreInfo.store_service.do_jumju_origin}
                      </TextNotoR>
                    </View>
                    <Caution />
                  </View>
                )}
              </View>
            )
          }
        />
      </View>
      {/* 장바구니 아이템 존재시 카트 버튼 표시 */}
      {res && (
        <>
          {(savedItem.savedItems.length > 0 || !res[0].StoreInfo.isOpen) && (
            <View style={{}}>
              <Pressable
                onPress={() => {
                  _checkLogin();
                  res[0].StoreInfo.isOpen
                    ? navigation.navigate('SummitOrder', {
                        data: res[0].StoreInfo,
                      })
                    : null;
                }}
                style={{
                  position: 'absolute',
                  // top: layout.height - 60,
                  bottom: 0,
                  height: 60,
                  width: '100%',
                  backgroundColor: res[0].StoreInfo.isOpen
                    ? colors.primary
                    : colors.borderColor,
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  {res[0].StoreInfo.isOpen && (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          backgroundColor: 'white',
                          width: 30,
                          height: 30,
                          borderRadius: 30 / 2,
                          marginLeft: 30,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TextBold
                          style={{
                            fontSize: 16,
                            color: colors.primary,
                            includeFontPadding: false,
                          }}>
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
                        color: res[0].StoreInfo.isOpen ? 'white' : 'gray',
                      }}>
                      {res[0].StoreInfo.isOpen
                        ? '카트 확인하기'
                        : '동네사람들을 만날 준비 중이에요!'}
                    </TextBold>
                  </View>

                  {res[0].StoreInfo.isOpen && (
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
        </>
      )}
    </SafeAreaView>
  );
};

export default MenuDetail2;

const styles = StyleSheet.create({
  titleTakout: {
    color: colors.fontColor99,
    marginVertical: 11,
  },
  subTitleTakeout: {
    color: colors.fontColor3,
  },
});
