import {View, Text, Modal, useWindowDimensions, Platform, ActivityIndicator} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import Header from '../../component/Header';
import colors from '../../styles/colors';
import CouponList from './CouponList';
import DividerL from '../../component/DividerL';
import TextBold from '../../component/text/TextBold';
import {Image} from 'react-native';
import TextMedium from '../../component/text/TextMedium';
import {ScrollView} from 'react-native';
import TextLight from '../../component/text/TextLight';
import {Shadow} from 'react-native-shadow-2';
import {Pressable} from 'react-native';
import MiniMap from '../map/MiniMap';
import TextRegular from '../../component/text/TextRegular';
import {useDispatch} from 'react-redux';
import {setIsLifeStyle} from '../../store/reducers/CategoryReducer';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {useEffect} from 'react';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {Alert} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import FastImage from 'react-native-fast-image';
import TextNotoR from '../../component/text/TextNotoR';
import Input from '../../component/loginScreen/Input';
import AutoLogin from '../../component/loginScreen/AutoLogin';
import loginConfig from '../login/loginConfig';

const CouponBookDetail = ({navigation, route}) => {
  const params = route?.params;
  //console.log('params', params);
  const dispatch = useDispatch();
  const {mttCpnBookDtl, mttCpbUse, mttCpbSave, mttCpnBookMyBoxDtl} =
    useCustomMutation();
  const {mttBcnBookDtl, mttBcbUse, mttBcbSave, mttBcnBookMyBoxDtl} =
    useCustomMutation();
  const {mttBcnBookCatetory, mttBcbCategoryUse, mttBcbCategorySave, mttBcnBookMyCatetory} =
    useCustomMutation();
  const [cpnDetail, setCpnDetail] = useState();
  const [bcnDetail, setBcnDetail] = useState();
  const {userInfo} = useSelector(state => state.authReducer);
  const [isSaved, setIsSaved] = useState(false);
  const layout = useWindowDimensions();

  const [modal, setModal] = useState(false);

  const _onPressInfo = () => {
    dispatch(setIsLifeStyle(true));
    navigation.navigate('LifeStyleStoreInfo', {
      jumju_id: cpnDetail?.cp_jumju_id
        ? cpnDetail?.cp_jumju_id
        : params?.cp_jumju_id,
      jumju_code: cpnDetail?.cp_jumju_code
        ? cpnDetail?.cp_jumju_code
        : params?.cp_jumju_code,
      mb_company: cpnDetail?.store_name
        ? cpnDetail?.store_name
        : params?.store_name,
      category: 'lifestyle',
      likeCount: '0',
    });
  };

  useEffect(() => {
    if (params.isMyBox) {
      if (params.ca_id){
        //이벤트 쿠폰일 경우
        _getBarcodeBoxDtl();
      }else {
        //쿠폰북 일경우
        _getBoxDtl();
      }
    } else {
      _getDtl();
    }

    console.log('route ::', route.params);
  }, [isSaved]);


  const _getDtl = () => {
    const data = {
      jumju_id: params.cp_jumju_id,
      jumju_code: params.cp_jumju_code,
      cp_no: params.cp_no,
      cp_id: params.cp_id,
      ca_id: params.ca_id,
      cp_type: params.cp_type,
      mt_id: userInfo.mt_id,
    };
    //console.log('data', data);
    if(params.cp_type===1) {
      mttCpnBookDtl.mutate(data, {
        onSuccess: res => {
          //console.log('res _getDtl1 ::', res.data.arrItems);
          setCpnDetail(res.data.arrItems);
          if (res.data.arrItems?.cp_exist === 'Y') setIsSaved(true);
        },
      });

    }else{

      console.log("바코드");
      mttBcnBookCatetory.mutate(data, {
        onSuccess: res => {
          //console.log('res _getDtl2 ::', res.data.arrItems);
          setCpnDetail(res.data.arrItems);
          if (res.data.arrItems?.cp_exist === 'Y') setIsSaved(true);
        },
      });
    }
  };

  const _getBoxDtl = () => {
    console.log("바코드");
    const data = {
      jumju_id: params.cp_jumju_id,
      jumju_code: params.cp_jumju_code,
      cp_no: params.cp_no,
      cp_id: params.cp_id,
      mt_id: userInfo.mt_id,
    };
    mttCpnBookMyBoxDtl.mutate(data, {
      onSuccess: res => {
        //console.log('res _getDtl1 ::', res.data.arrItems);
        setCpnDetail(res.data.arrItems);
        if (res.data.arrItems?.cp_exist === 'Y') setIsSaved(true);
      },
    });
  };

  const _getBarcodeBoxDtl = () => {
    console.log("바코드");
    console.log(params?.ca_id);
    const data = {
      jumju_id: params.cp_jumju_id,
      jumju_code: params.cp_jumju_code,
      cp_no: params.cp_no,
      ca_id: params.ca_id,
      mt_id: userInfo.mt_id,
    };
    mttBcnBookCatetory.mutate(data, {
      onSuccess: res => {
        //console.log('res _getDtl1 ::', res.data.arrItems);
        setCpnDetail(res.data.arrItems);
        if (res.data.arrItems?.cp_exist === 'Y') setIsSaved(true);
      },
    });
  };


  const _onPressUse = () => {
    const data = {
      jumju_id: params.cp_jumju_id,
      jumju_code: params.cp_jumju_code,
      mt_id: userInfo.mt_id,
      coupon_id: params.cp_id,
    };

    if (!userInfo) {
      Alert.alert('쿠폰북', '로그인이 필요합니다.', [
        {
          text: '로그인 하러 가기',
          onPress: () =>
            navigation.reset({
              //routes: [{name: 'Login'}],
              routes: [{name: 'Login', params: {screenTo: 'LifeStyleStoreInfo', jumju_id:params.cp_jumju_id, jumju_code: params.cp_jumju_code}}],
            }),
        },
      ]);
      return;
    }


    mttCpbUse.mutate(data, {
      onSuccess: res => {
        console.log('userInfo ::', userInfo);
        if (res.data.resultItem.result === 'true') {
          Alert.alert('쿠폰북', '쿠폰북 사용 성공');
          _getDtl();
        } else {
          Alert.alert('쿠폰북', '중복 사용은 불가능합니다');
        }
      },
    });
    console.log('## PRESS ::', data);
  };
  // 쿠폰 받고 이미지 변경

  const _onPressBarcodeUse = () => {
    const data = {
      jumju_id: params.cp_jumju_id,
      jumju_code: params.cp_jumju_code,
      mt_id: userInfo.mt_id,
      coupon_id: cpnDetail.cp_id,
    };

    if (!userInfo) {
      Alert.alert('쿠폰북', '로그인이 필요합니다.', [
        {
          text: '로그인 하러 가기',
          onPress: () =>
            navigation.reset({
              //routes: [{name: 'Login'}],
              routes: [{name: 'Login', params: {screenTo: 'LifeStyleStoreInfo', jumju_id:params.cp_jumju_id, jumju_code: params.cp_jumju_code}}],
            }),
        },
      ]);
      return;
    }
    mttCpbUse.mutate(data, {
      onSuccess: res => {
        console.log('userInfo ::', userInfo);
        if (res.data.resultItem.result === 'true') {
          Alert.alert('쿠폰북', '쿠폰북 사용 성공');
          _getDtl();
        } else {
          Alert.alert('쿠폰북', '중복 사용은 불가능합니다');
        }
      },
    });

    //setModal(!modal);
    console.log('## PRESS ::', data);
  };
  // 쿠폰 받고 이미지 변경

  const _onPressSave = () => {
    //console.log('element', params);
    const data = {
      jumju_id: params.cp_jumju_id,
      jumju_code: params.cp_jumju_code,
      mt_id: userInfo.mt_id,
      coupon_id: params.cp_id,
      coupon_cp_type: params.cp_type,
    };
    console.log('data', data);

    if (!userInfo) {
      Alert.alert('쿠폰북', '로그인이 필요합니다.', [
        {
          text: '로그인 하러 가기',
          onPress: () =>
            navigation.reset({
              // routes: [{name: 'Login'}],
              routes: [{name: 'Login', params: {screenTo: 'LifeStyleStoreInfo', jumju_id:params.cp_jumju_id, jumju_code: params.cp_jumju_code}}],
            }),
        },
      ]);
      return;
    }

    mttCpbSave.mutate(data, {
      onSuccess: res => {
        if (res.data.resultItem.result === 'true') {
          Alert.alert('쿠폰북', '쿠폰북 다운로드 성공');
          _getDtl();
          setIsSaved(true);
        } else Alert.alert('쿠폰북', '중복 다운로드는 할 수 없습니다');
      },
    });
  };



  //이벤트 쿠폰 다운로드
  const _onPressSaveBarcode = () => {
    console.log('element', params);
    const data = {
      jumju_id: params.cp_jumju_id,
      jumju_code: params.cp_jumju_code,
      mt_id: userInfo.mt_id,
      ca_id: params.ca_id,
      coupon_cp_type: params.cp_type,
    };
    console.log('data', data);


    if (!userInfo) {
      Alert.alert('쿠폰북', '로그인이 필요합니다.', [
        {
          text: '로그인 하러 가기',
          onPress: () =>
            navigation.reset({
              //routes: [{name: 'Login'}],
              routes: [{name: 'Login', params: {screenTo: 'LifeStyleStoreInfo', jumju_id:params.cp_jumju_id, jumju_code: params.cp_jumju_code}}],
            }),
        },
      ]);
      return;
    }


    mttBcbSave.mutate(data, {
      onSuccess: res => {
        if (res.data.resultItem.result === 'true') {
          Alert.alert('쿠폰북', '쿠폰북 다운로드 성공');
          _getDtl();
          setIsSaved(true);
        } else Alert.alert('쿠폰북', '중복 다운로드는 할 수 없습니다');
      },
    });

  };

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        <Header
          navigation={navigation}
          title={'쿠폰 상세보기'}
          style={{
            borderBottomWidth: 1,
            borderColor: colors.borderColor,
            marginBottom: 15,
          }}
        />

        {/* 상단 쿠폰 */}
        {cpnDetail && (
          <View style={{marginHorizontal: 14}}>
            <Shadow distance={5} offset={[0, 2]} style={{width: '100%'}}>
              <Pressable
                onPress={() => {
                  // navigation.navigate('CouponBookDetail');
                }}
                style={{
                  borderWidth: 1,
                  borderColor: colors.primary,
                  borderRadius: 10,
                  height: 100,
                  marginBottom: 15,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  flexDirection: 'row',
                  backgroundColor: 'white',
                }}>
                <Image
                  source={
                    cpnDetail?.store_logo
                      ? {uri: cpnDetail.store_logo}
                      : require('~/assets/no_img.png')
                  }
                  style={{height: 75, width: 75}}
                  resizeMode="cover"
                />
                <View
                  style={{
                    flex: 1,
                    marginLeft: 7,
                    marginRight: 7,
                    marginBottom: 3,
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextMedium
                      style={{color: colors.fontColor3, flex: 1}}
                      numberOfLines={1}>
                      {cpnDetail?.store_name}
                    </TextMedium>
                    <TextLight
                      style={{
                        color: colors.fontColorA,
                        fontSize: 11,
                        marginRight: 5,
                      }}>
                      {(cpnDetail?.cp_exist === 'Y') ? cpnDetail?.cp_use_end_txt : cpnDetail?.cp_end_txt}
                    </TextLight>
                  </View>
                  <TextBold
                    style={{fontSize: 15, color: colors.fontColor2}}
                    numberOfLines={1}>
                    {cpnDetail?.cp_subject}
                  </TextBold>
                  <TextBold
                    style={{fontSize: 11, color: colors.fontColorA2}}
                    numberOfLines={2}>
                    {cpnDetail?.cp_memo}
                  </TextBold>
                </View>
                <View
                  style={{
                    width: 1,
                    height: 60,
                    backgroundColor: colors.primary,
                    alignSelf: 'center',
                    marginRight: 5,
                  }}
                />
                {console.log('::::::::: ', cpnDetail.cp_exist, isSaved)}
                {cpnDetail.cp_exist === 'N' || !isSaved ? (
                  <Pressable
                    onPress={() => {
                      (cpnDetail.cp_type===1) ? _onPressSave() : _onPressSaveBarcode();
                    }}
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                      source={require('~/assets/down_coupon.png')}
                      style={{width: 40, height: 40}}
                      resizeMode="contain"
                    />
                    <TextLight style={{fontSize: 12}}>
                      {cpnDetail?.cp_coupon_download_txt}
                    </TextLight>
                  </Pressable>
                ) : (
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                      source={require('~/assets/down_complet.png')}
                      style={{width: 45, height: 45}}
                      resizeMode="contain"
                    />
                    <TextLight style={{fontSize: 12, color: colors.fontColor6}}>
                      {'받기완료'}
                    </TextLight>
                  </View>
                )}
              </Pressable>
            </Shadow>
          </View>
        )}
        <View
          style={{
            width: '100%',
            height: 10,
            backgroundColor: colors.borderColor,
          }}
        />

        <View style={{padding: 14}}>
          <TextBold>{cpnDetail?.store_lat ? "쿠폰 사용 가능 장소" : "오시는길"}</TextBold>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              marginBottom: 10,
              marginRight: 25,
            }}>
            <Image
              source={require('~/assets/ico_map_book.png')}
              style={{
                width: 20,
                height: 20,
                marginRight: 5,
                tintColor: colors.primary,
              }}
              resizeMode="contain"
            />
            <TextMedium>{cpnDetail?.store_address}</TextMedium>
          </View>
          {/* 지도 */}
          <View
            style={{
              borderRadius: 10,
              overflow: 'hidden',
            }}>
            <MiniMap
              canUseZoom={true}
              height={240}
              isStore
              lat={cpnDetail?.store_lat ? cpnDetail?.store_lat : params?.store_lat}
              lng={cpnDetail?.store_lng ? cpnDetail?.store_lng : params?.store_lng}
              // width={200}
            />
          </View>
        </View>

        {/* 안내사항  */}
        <View
          style={{
            padding: 14,
            marginTop: 10,
            borderTopWidth: 1,
            // borderBottomWidth: 1,
            borderColor: colors.borderColor,
          }}>
          <TextBold style={{marginBottom: 10}}>쿠폰 안내사항</TextBold>
          <TextRegular>{cpnDetail?.cp_memo}</TextRegular>

          {/*
          <TextBold style={{marginBottom: 10}}>안내사항</TextBold>
          <TextRegular>{cpnDetail?.store_memo}</TextRegular>
          */}
          <Pressable
            onPress={() => {
              _onPressInfo();
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
              width: '100%',
              backgroundColor: colors.borderColor,
              borderRadius: 10,
              marginTop: 30,
            }}>
            <TextBold style={{color: colors.fontColor6, fontSize: 16}}>
              매장 정보 더보기
            </TextBold>
          </Pressable>
        </View>
      </ScrollView>

      {cpnDetail?.cp_exist === 'Y' && (
        <View
          style={{
            width: '100%',
            position: 'absolute',
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderColor: colors.borderColor,
            bottom: 0,
            paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          }}>
          <View style={{marginHorizontal: 14}}>

            {cpnDetail.ca_id ? (
              <View>
                <View style={{marginVertical: 10}}>
                  <TextRegular style={{color: colors.fontColor3}}>
                    바코드 스캔후에는 더 이상 사용 불가능합니다.
                  </TextRegular>
                </View>
                <Pressable
                  onPress={() => {
                    setModal(!modal);
                  }}
                  style={{
                    height: 50,
                    backgroundColor:
                      cpnDetail?.cp_use === 'N' ? colors.primary : '#E3E3E3',
                    borderRadius: 22,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TextBold style={{color: 'white', fontSize: 18}}>
                    {/* {cpnDetail?.cp_use === 'N' ? :'사용완료'} */}
                    바코드 확인
                  </TextBold>
                </Pressable>
              </View>
            ) : (
              <View>
                <View style={{marginVertical: 10}}>
                  <TextRegular style={{color: colors.fontColor3}}>
                    쿠폰을 사용한 후{'<사용완료>'}버튼을 꼭 눌러주세요.
                  </TextRegular>
                </View>
                <Pressable
                  onPress={() =>
                    cpnDetail?.cp_use === 'N'
                      ? _onPressUse()
                      : Alert.alert('쿠폰북', '이미 사용완료된 쿠폰입니다')
                  }
                  style={{
                    height: 50,
                    backgroundColor:
                      cpnDetail?.cp_use === 'N' ? colors.primary : '#E3E3E3',
                    borderRadius: 22,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TextBold style={{color: 'white', fontSize: 18}}>
                    {/* {cpnDetail?.cp_use === 'N' ? :'사용완료'} */}
                    사용완료
                  </TextBold>
                </Pressable>
              </View>
            )}


          </View>
        </View>
      )}

      <Modal
        transparent
        visible={modal}
        onRequestClose={() => {
          setModal(!modal);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            paddingHorizontal: 10,
            flexDirection: 'column',
          }}>

          <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Pressable
              hitSlop={20}
              onPress={() => {
                setModal(!modal);
              }}
              style={{
                alignSelf: 'flex-end',
                justifyContent: 'center',
                zIndex: 300,
              }}>
              <Image
                source={require('~/assets/pop_close.png')}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: 'white',
                }}
              />
            </Pressable>
            <View
              style={{
                width: '100%',
                height: 300,
                borderRadius: 10,
                paddingTop:30,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                ...Platform.select({
                  ios: {
                    shadowColor: '#00000029',
                    shadowOpacity: 0.6,
                    shadowRadius: 50 / 2,
                    shadowOffset: {
                      height: 12,
                      width: 0,
                    },
                  },
                  android: {
                    elevation: 5,
                  },
                }),
              }}>

              <View style={{flexDirection: 'row', marginHorizontal:10,}}>
                <TextBold style={{marginVertical: 10, fontSize: 18}}>{cpnDetail?.cp_subject}</TextBold>
              </View>

              <View style={{flexDirection: 'row', marginHorizontal:10,}}>
                <Image
                  source={{uri: cpnDetail?.barcode_img}}
                  style={{height: 120, width: '100%'}}
                  resizeMode="cover"
                />
              </View>

              <View style={{marginVertical: 10, paddingTop:30, width: '100%'}}>
                <Pressable
                  onPress={() =>
                    cpnDetail?.cp_use === 'N'
                      ? _onPressBarcodeUse()
                      : Alert.alert('쿠폰북', '이미 사용완료된 쿠폰입니다')
                  }
                  style={{
                    marginHorizontal:100,
                    height: 50,
                    backgroundColor: cpnDetail?.cp_use === 'N' ? colors.primary : '#E3E3E3',
                    borderRadius: 22,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TextBold style={{color: 'white', fontSize: 18}}>
                    사용완료
                  </TextBold>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  );

};

export default CouponBookDetail;
