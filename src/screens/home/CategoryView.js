import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {FlatList, Image, Text, View} from 'react-native';
import {StyleSheet} from 'react-native';
import {Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Shadow} from 'react-native-shadow-2';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import mainAPI from '../../api/modules/mainAPI';
import BottomBar from '../../component/BottomBar';
import Header from '../../component/Header';
import Loading from '../../component/Loading';
import MainBanner from '../../component/MainBanner';
import SearchBox from '../../component/mainScreen/SearchBox';
import TextEBold from '../../component/text/TextEBold';
import TextMedium from '../../component/text/TextMedium';
import BannerList from '../../config/BannerList';
import {Errorhandler} from '../../config/ErrorHandler';
import {_guestAlert} from '../../config/utils/modules';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {setIsLifeStyle} from '../../store/reducers/CategoryReducer';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyle';
import AutoHeightImage from 'react-native-auto-height-image';
import {resetSavedItem} from '../../store/reducers/CartReducer';
import dayjs from 'dayjs';
import TextSBold from '../../component/text/TextSBold';
import {hasNotch} from 'react-native-device-info';
import TextRegular from '../../component/text/TextRegular';
import TextBold from '../../component/text/TextBold';
import Divider from '../../component/Divider';
import policyConfig from '../signIn/policyConfig';
import {setCurrentLocation} from '../../store/reducers/LocationRecuder';
import {setCouponBookMenus} from '../../store/reducers/CouponReducer';

const CategoryView = ({navigation, route}) => {
  const selectedCategory = route.params?.selectedCategory;
  const [categoryData, setCategoryData] = useState();
  const [foodData, setFoodData] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [cateRoute, setCateRoute] = useState();
  const [couponBannerData, setCouponBannerdData] = useState();

  const {mutateGetAddress, mutateGetCompanyInfo} = useCustomMutation();
  const {mutateGetCouponBanner} = useCustomMutation();
  const {userInfo, isGuest} = useSelector(state => state.authReducer);
  const [addr, setAddr] = useState();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const layout = useWindowDimensions();

  const [companyInfo, setCompanyInfo] = useState();
  const {savedItem} = useSelector(state => state.cartReducer);
  const [toggleInfo, setToggleInfo] = useState(false);
  const _getCompanyInfo = () => {
    const data = {};
    mutateGetCompanyInfo.mutate(data, {
      onSuccess: e => {
        if (e.result === 'true') setCompanyInfo(e.data.arrItems);
      },
    });
  };

  const _checkTime = () => {
    const date = new Date();
    const diff = dayjs(date).diff(savedItem.savedTime, 'minutes');
    //minute of a day
    const limit = 60 * Number(companyInfo.de_local_time);
    // console.log('savedItem', savedItem);
    // console.log('DIFF :::::', diff, limit);
    if (diff >= limit) {
      dispatch(resetSavedItem());
    }
    // if (diff >= 1440) console.log('copyData', copyData);
  };

  useEffect(() => {
    _getCompanyInfo();
    console.log('::: USER INFO', userInfo);
  }, []);

  useEffect(() => {
    if (companyInfo) {
      _checkTime();
    }
  }, [companyInfo]);

  const mutateCategory = useMutation(mainAPI._getCategory, {
    onSuccess: e => {
      if (e.result === 'true') {
        let temp = e.data.arrItems;

        /* 현재는 숨김 처리 차후에 배달 서비스 오픈
        temp.push({
          ca_name: '동네북 오더',
          ca_img: require('~/assets/food_icon.png'),
        });
        temp.push({
          ca_name: '순간이동 마켓',
          ca_img: require('~/assets/market_icon.png'),
        });

         */
        // console.log('temppp', temp);
        setCategoryData(temp);
        let temp2 = [];
        temp2.push({ca_id: '111', ca_name: '전체'});
        temp2.push(...temp);
        temp2.pop();
        temp2.pop();
        dispatch(setCouponBookMenus(temp2));
      } else setCategoryData([]);
    },
  });

  const _getAddr = () => {
    const data = {
      mt_id: userInfo.mt_id,
    };

    mutateGetAddress.mutate(data, {
      onSuccess: e => {
        if (e.result === 'true') {
          let tempAddr =
            e.data.arrItems[0].ad_addr1 +
            ' ' +
            e.data.arrItems[0].ad_addr2 +
            e.data.arrItems[0].ad_addr3;
          setAddr(tempAddr);
          if (e.data?.arrItems[0]?.ad_lat) {
            dispatch(
              setCurrentLocation({
                lat: e.data.arrItems[0].ad_lat,
                lon: e.data.arrItems[0].ad_lng,
              }),
            );
          }
        } else setAddr('주소설정');
      },
    });
  };

  const _getCouponBookBanner = () => {
    const data = {
      bn_position: '내주변쿠폰북',
    };

    mutateGetCouponBanner.mutate(data, {
      onSettled: e => {
        setCouponBannerdData(e.data.arrItems.bn_img);
      },
    });
  };

  const _init = () => {
    const data = {
      ca_type: selectedCategory,
    };
    mutateCategory.mutate(data);
  };
  const _onPressBook = () => {
    let temp = [];
    temp.push({ca_id: '111', ca_name: '전체'});
    temp.push(...categoryData);
    temp.pop();
    temp.pop();
    navigation.navigate('CouponBookMain', {data: temp});
  };
  useEffect(() => {
    _init();
    _getCouponBookBanner();
  }, [cateRoute]);

  useEffect(() => {
    if (isFocused) _getAddr();
  }, [isFocused]);

  const renderItem = item => {
    const caName = item.item.ca_name;
    return (
      <>
        <Pressable
          onPress={() => {
            if (item.item) {
              if (selectedCategory === 'lifestyle')
                dispatch(setIsLifeStyle(true));
              else dispatch(setIsLifeStyle(false));
              if (caName === '동네북 오더') {
                return navigation.navigate('FoodScreen', {
                  selectedCategory: 'food',
                });
              }
              if (caName === '순간이동 마켓')
                return navigation.navigate('MarketScreen', {
                  selectedCategory: 'market',
                });

              navigation.navigate('StoreList', {
                routeIdx: item.item.ca_name,
                category: selectedCategory,
                categoryData: categoryData,
              });
            }
          }}
          style={{
            flex: 1,
            // justifyContent: 'space-between',
            alignItems: 'center',
            // marginHorizontal: 10,
          }}>
          <View style={{width: 80, alignItems: 'center'}}>
            <Image
              source={
                caName === '동네북 오더'
                  ? require('~/assets/food_icon.png')
                  : caName === '순간이동 마켓'
                  ? require('~/assets/market_icon.png')
                  : {uri: item.item.ca_img}
              }
              style={{width: 50, height: 50}}
              resizeMode="contain"
            />
            <TextMedium
              style={{
                textAlign: 'center',
                fontSize: 13,
              }}>
              {caName}
            </TextMedium>
          </View>
        </Pressable>
        {item.index === categoryData?.length - 1 &&
          categoryData?.length % 4 !== 0 && (
            <View style={{flex: 4 - (categoryData?.length % 4)}}></View>
          )}
      </>
    );
  };

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header
        title={''}
        navigation={navigation}
        showLogo={true}
        showNoti={true}
        showCart={true}
      />
      <View style={{paddingHorizontal: 14, marginBottom: 14}}>
        <Pressable
          onPress={() => {
            if (!isGuest && userInfo) {
              navigation.navigate('AddressMain');
            } else {
              _guestAlert(navigation);
            }
          }}
          style={{
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: 'white',
            marginBottom: 10,
          }}>
          <Image
            source={require('~/assets/ico_location.png')}
            style={{
              width: 19,
              height: 19,
              marginRight: 8,
              tintColor: colors.primary,
            }}
          />
          <View style={{marginLeft: 0, marginRight: 3}}>
            <TextEBold
              numberOfLines={1}
              style={{
                fontSize: 15,
                color: colors.fontColor2,
              }}>
              {addr}
            </TextEBold>
          </View>
          <Image
            source={require('~/assets/arrow.png')}
            style={{
              tintColor: colors.primary,
              width: 17,
              height: 17,
              // transform: [{rotate: '90deg'}],
            }}
            resizeMode={'contain'}
          />
        </Pressable>

        <SearchBox
          isSub={true}
          navigation={navigation}
          category={selectedCategory}
          // onPress={() =>
          //   navigation.navigate('SearchView', {
          //     isSub: true,
          //     category: selectedCategory,
          //   })
          // }
        />
        {/* 메인배너 */}
      </View>

      <FlatList
        data={categoryData}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => <Loading />}
        ListHeaderComponent={
          <View style={{}}>
            <MainBanner
              navigation={navigation}
              style={{
                marginBottom: 14,
              }}
              position={BannerList[`${selectedCategory}`]}
            />
            {/* <Shadow> */}
            <Pressable
              onPress={() => {
                _onPressBook();
              }}
              style={{
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Shadow distance={5} offset={[0, 1]} style={{borderRadius: 10}}>
                {/* <View style={{height: 100}}> */}
                <AutoHeightImage
                  source={
                    couponBannerData
                        ? {uri: couponBannerData}
                        : require('~/assets/coupon.png')
                  }
                  width={layout.width - 28}
                />
                {/* </View> */}
              </Shadow>
            </Pressable>
            {/* </Shadow> */}
          </View>
        }
        renderItem={item => renderItem(item)}
        numColumns={4}
        contentContainerStyle={{
          paddingBottom: 70,
        }}
        columnWrapperStyle={{
          alignSelf: 'center',
          marginBottom: 8,
          paddingHorizontal: 14,
        }}
        keyExtractor={(item, index) => index}
        ListFooterComponent={
          <View
            style={{
              marginTop: 20,
              paddingHorizontal: 14,
              backgroundColor: 'white',
              paddingBottom: toggleInfo ? 20 : hasNotch() ? 40 : 40,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 14,
                marginBottom: 10,
              }}>
              <Pressable
                onPress={() => {
                  navigation.navigate('Policy', {
                    target: policyConfig.target.location,
                  });
                }}>
                <TextRegular style={{color: colors.fontColor8, fontSize: 11}}>
                  위치기반 서비스 이용약관
                </TextRegular>
              </Pressable>
              <Divider style={{marginHorizontal: 5}} />
              <Pressable
                onPress={() => {
                  navigation.navigate('Policy', {
                    target: policyConfig.target.personal,
                  });
                }}>
                <TextBold style={{color: colors.fontColor8, fontSize: 11}}>
                  개인정보 처리방침
                </TextBold>
              </Pressable>
              <Divider style={{marginHorizontal: 5}} />
              <Pressable
                onPress={() => {
                  navigation.navigate('Policy', {
                    target: policyConfig.target.use,
                  });
                }}>
                <TextRegular style={{color: colors.fontColor8, fontSize: 11}}>
                  이용약관
                </TextRegular>
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                setToggleInfo(!toggleInfo);
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextSBold>(주)어스닉</TextSBold>
              <Image
                source={require('~/assets/btn_top_left.png')}
                style={{
                  transform: [{rotate: toggleInfo ? '90deg' : '-90deg'}],
                  width: 20,
                  height: 20,
                  marginLeft: 4,
                }}
                resizeMode={'contain'}
              />
            </Pressable>
            {toggleInfo && (
              <>
                <View
                  style={{
                    marginBottom: hasNotch() ? 30 : 10,
                    // alignItems: 'center',
                  }}>
                  <View style={{marginBottom: 10}}>
                    <TextRegular
                      style={{color: colors.fontColor8, fontSize: 11}}>
                      {companyInfo?.de_admin_company_memo}
                    </TextRegular>
                  </View>
                  <TextRegular style={{color: colors.fontColor8, fontSize: 11}}>
                    {companyInfo?.de_admin_company_addr} 대표이사 :{' '}
                    {companyInfo?.de_admin_company_owner} | 사업자등록번호 :
                    {companyInfo?.de_admin_company_saupja_no} 통신판매업신고 :{' '}
                    {companyInfo?.de_admin_tongsin_no}
                  </TextRegular>
                </View>
              </>
            )}
          </View>
        }
      />

      <BottomBar navigation={navigation} />
    </SafeAreaView>
  );
};

export default CategoryView;

const styles = StyleSheet.create({
  bookStyle: {
    flex: 1,
  },
});
