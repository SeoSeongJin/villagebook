import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  SectionList,
  StatusBar,
  View,
} from 'react-native';
import {Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BottomBar from '../../component/BottomBar';
import Divider from '../../component/Divider';
import Header from '../../component/Header';
import MainBanner from '../../component/MainBanner';
import SearchBox from '../../component/mainScreen/SearchBox';
import TextBold from '../../component/text/TextBold';
import TextEBold from '../../component/text/TextEBold';
import TextJua from '../../component/text/TextJua';
import TextRegular from '../../component/text/TextRegular';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyle';
import {useDispatch, useSelector} from 'react-redux';
import policyConfig from '../signIn/policyConfig';
import {_guestAlert, _showAddr} from '../../config/utils/modules';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import BannerList from '../../config/BannerList';
import dayjs from 'dayjs';
import {resetSavedItem} from '../../store/reducers/CartReducer';
import TextSBold from '../../component/text/TextSBold';
import {Shadow} from 'react-native-shadow-2';
import {setCurrentAdd, setPostData} from '../../store/reducers/AddressReducer';
import {hasNotch} from 'react-native-device-info';

const Main = ({navigation}) => {
  const dispatch = useDispatch();
  const {userInfo, isGuest} = useSelector(state => state.authReducer);
  // const {postData} = useSelector(state => state.addressReducer);
  const {savedItem} = useSelector(state => state.cartReducer);
  const {mutateGetAddress, mutateGetCompanyInfo} = useCustomMutation();
  const [companyInfo, setCompanyInfo] = useState();
  const [toggleInfo, setToggleInfo] = useState(false);
  const [addr, setAddr] = useState();
  const isFocused = useIsFocused();

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
          dispatch(setCurrentAdd(e.data.arrItems[0]));
          setAddr(tempAddr);
        } else setAddr('주소설정');
        console.log('mutateGetAddress', e);
      },
    });
  };

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
    console.log('savedItem', savedItem);
    console.log('DIFF :::::', diff, limit);
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

  // useEffect(() => {
  //   if (isFocused) _getAddr();
  // }, [isFocused]);

  return (
    <SafeAreaView
      style={{
        ...commonStyles.safeAreaStyle,
        // backgroundColor: colors.borderColor,
      }}>
      {/* <StatusBar backgroundColor={'white'} /> */}
      <Header
        title={''}
        navigation={navigation}
        showLogo={true}
        showNoti={true}
        showCart={true}
      />
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          // paddingHorizontal: 14,
          // paddingBottom: 50,
          backgroundColor: '#F2F4F6',
          // backgroundColor: colors.borderColor,
        }}>
        <View
          style={{
            paddingHorizontal: 14,
            paddingBottom: 14,
            borderBottomStartRadius: 20,
            borderBottomEndRadius: 20,
            backgroundColor: 'white',
          }}>
          <Pressable
            onPress={() => {
              if (!isGuest && userInfo) {
                navigation.navigate('AddressMain');
              } else {
                _guestAlert(navigation);
              }
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: 'white',
              marginBottom: 10,
            }}>
            <Image
              source={require('~/assets/ico_location.png')}
              style={{width: 19, height: 19, tintColor: colors.primary}}
            />
            <View style={{marginLeft: 10, marginRight: 3}}>
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
            navigation={navigation}
            // onPress={() => navigation.navigate('SearchView')}
            isMain={true}
            style={{}}
          />
        </View>
        {/* 동네편의 */}
        <View style={{backgroundColor: '#F2F4F6', paddingHorizontal: 14}}>
          <View
            style={{
              flex: 1,
              height: 141,
              marginBottom: 14,
              marginTop: 17,
            }}>
            <Pressable
              onPress={() => {
                navigation.navigate('CategoryView', {
                  selectedCategory: 'lifestyle',
                });
              }}
              style={{
                flex: 1,
                flexDirection: 'row',
                // borderWidth: 1,
                backgroundColor: 'white',
                borderColor: colors.mainBG3Border,
                borderRadius: 10,
                overflow: 'hidden',
              }}>
              <View style={{paddingLeft: 20, zIndex: 100, marginTop: 20}}>
                <Image
                  source={require('~/assets/lifestyle.png')}
                  style={{
                    width: 77,
                    height: 23,
                  }}
                />
                {/* <TextJua style={{fontSize: 23, color: colors.fontMain1}}>
                동네맛집
              </TextJua> */}
                <View style={{marginTop: 8}}>
                  <TextRegular style={{fontSize: 15}}>
                    우리동네의 모든 매장 정보를{'\n'}다 알 수 있어요!
                  </TextRegular>
                </View>
              </View>

              <Image
                source={require('~/assets/lifestyle_back.png')}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                }}
              />
            </Pressable>
          </View>
          {/* 동네맛집 */}
          {/* 동네마켓 */}
          <View
            style={{
              height: 220,
              marginBottom: 14,
              flexDirection: 'row',
            }}>
            <Pressable
              onPress={() => {
                navigation.navigate('CategoryView', {selectedCategory: 'food'});
              }}
              style={{
                flex: 1,
                borderRadius: 10,
                marginRight: 14,
                overflow: 'hidden',
              }}>
              <View style={{paddingLeft: 20, zIndex: 100, marginTop: 20}}>
                <Image
                  source={require('~/assets/food.png')}
                  style={{
                    width: 77,
                    height: 23,
                  }}
                />
                {/* <TextJua style={{fontSize: 23, color: colors.fontMain1}}>
                동네맛집
              </TextJua> */}
                <View style={{marginTop: 8}}>
                  <TextRegular style={{fontSize: 15}}>
                    우리동네 맛집 {'\n'}다있다!
                  </TextRegular>
                </View>
              </View>
              <Image
                source={require('~/assets/food_back.png')}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}
              />
            </Pressable>

            {/* 동네마켓 */}
            <Pressable
              onPress={() => {
                navigation.navigate('CategoryView', {
                  selectedCategory: 'market',
                });
              }}
              style={{
                flex: 1,
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: 'white',
              }}>
              <View style={{paddingLeft: 20, zIndex: 100, marginTop: 20}}>
                <Image
                  source={require('~/assets/market.png')}
                  style={{
                    width: 120,
                    height: 23,
                  }}
                />
                {/* <TextJua style={{fontSize: 23, color: colors.fontMain1}}>
                동네맛집
              </TextJua> */}
                <View style={{marginTop: 8}}>
                  <TextRegular style={{fontSize: 15}}>
                    필요한 물건은{'\n'}문앞까지 순간이동!
                  </TextRegular>
                </View>
              </View>
              <Image
                source={require('~/assets/market_back.png')}
                style={{
                  position: 'absolute',
                  // bottom: '-4%',
                  width: '100%',
                  height: '100%',
                }}
              />
            </Pressable>
          </View>
        </View>

        {/* 메인배너 */}
        <View
          style={{paddingHorizontal: 14, backgroundColor: colors.borderColor}}>
          <MainBanner
            navigation={navigation}
            style={{marginBottom: 14}}
            position={BannerList.main}
          />
        </View>

        {/* 약관 */}
        <View
          style={{
            paddingHorizontal: 14,
            backgroundColor: 'white',
            paddingBottom: toggleInfo ? 20 : hasNotch() ? 40 : 80,
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
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              marginBottom: toggleInfo ? 10 : 70,
            }}>
            <TextRegular style={{color: colors.fontColor8, fontSize: 11}}>
              (주)어스닉은 통신판매중개자이며, 따라서 (주)어스닉은 상품,
              거래정보 및 거래에 대하여 책임을 지지 않습니다.
            </TextRegular>
          </View> */}
          {toggleInfo && (
            <>
              <View
                style={{
                  marginBottom: hasNotch() ? 30 : 70,
                  // alignItems: 'center',
                }}>
                <View style={{marginBottom: 10}}>
                  <TextRegular style={{color: colors.fontColor8, fontSize: 11}}>
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
      </ScrollView>
      <BottomBar navigation={navigation} />
      {/* <BottomNavigator /> */}
    </SafeAreaView>
  );
};

export default Main;
