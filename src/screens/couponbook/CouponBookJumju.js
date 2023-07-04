import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  ScrollView,
  Modal,
  ActivityIndicator, Alert,
} from "react-native";
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import TextRegular from '../../component/text/TextRegular';
import TextBold from '../../component/text/TextBold';
import colors from '../../styles/colors';
import FastImage from 'react-native-fast-image';
import {Slider} from '@miblanchard/react-native-slider';
import dayjs from 'dayjs';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import Loading from '../../component/Loading';
import {customAlert} from '../../component/CustomAlert';
import ImageZoom from '../../component/ImageZoom';
import ImageViewer from 'react-native-image-zoom-viewer';
import Divider from '../../component/Divider';
import DividerL from '../../component/DividerL';
import {useWindowDimensions} from 'react-native';
import {hasNotch} from 'react-native-device-info';
import TextNotoB from '../../component/text/TextNotoB';
import TextNotoM from '../../component/text/TextNotoM';
import {useIsFocused} from '@react-navigation/native';
import { Shadow } from "react-native-shadow-2";
import TextMedium from "../../component/text/TextMedium";
import TextLight from "../../component/text/TextLight";
import { useSelector } from "react-redux";
import {setIsLifeStyle} from '../../store/reducers/CategoryReducer';

const CouponBookJumju = ({storeInfo, isLifeStyle, navigation}) => {

  //console.log(storeInfo);
  const itemLimit = useRef(0);
  const {mutateGetCouponBookJumju, mttCpbSave, mttCpbMy} = useCustomMutation();
  const {mutateGetBarcodeBookJumju, mttBcbSave, mttBcbMy} = useCustomMutation();
  const [couponBookData, setCouponBookData] = useState([]);
  const [barcodeBookData, setBarcodeBookData] = useState([]);
  const {userInfo} = useSelector(state => state.authReducer);
  const {isDeepLink} = useSelector(state => state.deepLinkReducer);

  const _getCouponBookJumju = () => {
    //console.log('StoreInfo2', storeInfo);
    let data;

    if (isLifeStyle) {
      data = {
        jumju_id: storeInfo.mb_id,
        jumju_code: storeInfo.mb_jumju_code,
      };

      //console.log('######### data', data);
      // return;
      mutateGetCouponBookJumju.mutate(data, {
        onSuccess: res => {
          //console.log('## res', res.data);
          if (res.data?.arrItems?.length > 0) {
            setCouponBookData(res.data.arrItems);
          }
        },
      });
    }
  };

  const _getBarcodeBookJumju = () => {
    //console.log('StoreInfo2', storeInfo);
    let data;


    if (isLifeStyle) {
      data = {
        jumju_id: storeInfo.mb_id,
        jumju_code: storeInfo.mb_jumju_code,
      };

      //console.log('######### data', data);
      // return;
      mutateGetBarcodeBookJumju.mutate(data, {
        onSuccess: res => {
          //console.log('## res', res.data);
          if (res.data?.arrItems?.length > 0) {
            setBarcodeBookData(res.data.arrItems);
          }
        },
      });
    }
  };

  const CouponBookInfo = ({item}) => {
    //console.log('item111', item.cp_type);

    let CouponBookDetailScreen = "CouponBookDetail";
    if(item.cp_type === 1){
      CouponBookDetailScreen = "CouponBookDetail";
    }else{
      CouponBookDetailScreen = "CouponBookBarcodeDetail";
    }
    const element = item;

    return (
      <>
        <View>
          <Shadow
            distance={5}
            offset={[0, 2]}
            style={{width: '100%'}}
            containerStyle={{
              marginTop: 0,
              marginHorizontal: 0,
            }}>
            <Pressable
              onPress={() => {
                navigation.navigate('CouponBookDetail', {...element});
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
                  element.store_logo
                    ? {uri: element.store_logo}
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
                    {element.store_name}
                  </TextMedium>
                  <TextLight
                    style={{
                      color: colors.fontColorA,
                      fontSize: 11,
                      marginRight: 5,
                    }}>
                    {element.cp_end_txt}
                  </TextLight>
                </View>
                <TextBold
                  style={{fontSize: 15, color: colors.fontColor2}}
                  numberOfLines={2}>
                  {element.cp_subject}
                </TextBold>
                <TextMedium
                  style={{fontSize: 11, color: colors.fontColorA}}
                  numberOfLines={1}>
                  {element.cp_memo}
                </TextMedium>
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
              <Pressable
                onPress={() => {
                  (element.cp_type===1) ? _onPressSave(element) : _onPressSaveBarcode(element);
                }}
                style={{width: 50, justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  source={require('~/assets/down_coupon.png')}
                  style={{width: 40, height: 40}}
                  resizeMode="contain"
                />
                <TextLight style={{fontSize: 12}}>
                  {element.cp_coupon_download_txt}
                </TextLight>
              </Pressable>
            </Pressable>
          </Shadow>
        </View>
      </>
    );
  };

  const _onPressSave = element => {
    // console.log('element', element);
    const data = {
      jumju_id: element.cp_jumju_id,
      jumju_code: element.cp_jumju_code,
      mt_id: userInfo.mt_id,
      coupon_id: element.cp_id,
      coupon_cp_type: element.cp_type,
    };
    //console.log('data', data);

    if (!userInfo) {
      Alert.alert('쿠폰북', '로그인이 필요합니다.', [
        {
          text: '로그인 하러 가기',
          onPress: () =>
            navigation.reset({
              //routes: [{name: 'Login'}],
              routes: [{name: 'Login', params: {screenTo: 'LifeStyleStoreInfo', jumju_id:element.cp_jumju_id, jumju_code: element.cp_jumju_code}}],
            }),
        },
      ]);
      return;
    }


    mttCpbSave.mutate(data, {
      onSuccess: res => {
        if (res.data.resultItem.result === 'true') {
          Alert.alert('쿠폰북', '쿠폰북 다운로드 성공');
        } else {
          Alert.alert('쿠폰북', '중복 다운로드는 할 수 없습니다');
        }
        console.log('res', res.data.resultItem.result === 'true');
      },
    });
  };

  const _onPressSaveBarcode = element => {
    // console.log('element', element);
    const data = {
      jumju_id: element.cp_jumju_id,
      jumju_code: element.cp_jumju_code,
      mt_id: userInfo.mt_id,
      ca_id: element.ca_id,
      coupon_cp_type: element.cp_type,
    };
    //console.log('data', data);

    if (!userInfo) {
      Alert.alert('쿠폰북', '로그인이 필요합니다.', [
        {
          text: '로그인 하러 가기',
          onPress: () =>
            navigation.reset({
              //routes: [{name: 'Login'}],
              routes: [{name: 'Login', params: {screenTo: 'LifeStyleStoreInfo', jumju_id:element.cp_jumju_id, jumju_code: element.cp_jumju_code}}],
            }),
        },
      ]);
      return;
    }


    mttBcbSave.mutate(data, {
      onSuccess: res => {
        if (res.data.resultItem.result === 'true') {
          _getCouponBookJumju();
          _getBarcodeBookJumju();
          Alert.alert('쿠폰북', '쿠폰북 다운로드 성공');
        } else {
          Alert.alert('쿠폰북', '중복 다운로드는 할 수 없습니다');
        }
        console.log('res', res.data.resultItem.result === 'true');
      },
    });
  };

  useEffect(() => {
    _getCouponBookJumju();
    _getBarcodeBookJumju();
    return () => {};
  }, []);


  return (
    <>
    {(couponBookData.length > 0) || (isDeepLink === true && barcodeBookData.length > 0)  ? (
      <View>
        <View style={{paddingTop: 22, paddingBottom: 12, paddingLeft: 22, paddingRight: 22}}>
          <View style={{marginBottom: 0}}>
            <TextNotoM style={{fontSize: 18, color: colors.fontColor6}}>
              쿠폰
            </TextNotoM>
          </View>
        </View>
      </View>
    ) : null}

    {couponBookData.length > 0 ? (
        <View style={{
          borderWidth: 0,
          borderColor: colors.primary,
        }}>
          <View style={{paddingVertical: 0, paddingHorizontal: 12}}>
            <View style={{flex: 1}}>
              {couponBookData?.map((item, index) => (
                <CouponBookInfo item={item} key={index} />
              ))}
            </View>
          </View>
        </View>
      ) : null}

      {isDeepLink === true && barcodeBookData.length > 0 ? (
        <View>
          <View style={{paddingVertical: 0, paddingHorizontal: 12}}>
            <View style={{flex: 1}}>
              {barcodeBookData?.map((item, index) => (
                <CouponBookInfo item={item} key={index} />
              ))}
            </View>
          </View>
          <View style={{padding: 5}}></View>
        </View>
      ) : null}

      {(couponBookData.length > 0) || (barcodeBookData.length > 0)  ? (
        <View>
          <DividerL />
          <View style={{padding: 5}}></View>
        </View>
      ) : null}

    </>
  );
};

export function renderCouponBook(item, i){
  const element = item;

  return (
    <View key={i}>
      <Shadow
        distance={5}
        offset={[0, 2]}
        style={{width: '100%'}}
        containerStyle={{
          marginTop: 0,
          marginHorizontal: 0,
        }}>
        <Pressable
          onPress={() => {
            navigation.navigate('CouponBookDetail', {...element});
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
              element.store_logo
                ? {uri: element.store_logo}
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
                {element.store_name}
              </TextMedium>
              <TextLight
                style={{
                  color: colors.fontColorA,
                  fontSize: 11,
                  marginRight: 5,
                }}>
                {element.cp_end_txt}
              </TextLight>
            </View>
            <TextBold
              style={{fontSize: 15, color: colors.fontColor2}}
              numberOfLines={2}>
              {element.cp_subject}
            </TextBold>
            <TextMedium
              style={{fontSize: 11, color: colors.fontColorA}}
              numberOfLines={1}>
              {element.cp_memo}
            </TextMedium>
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
          <Pressable
            onPress={() => {
              _onPressSave(element);
            }}
            style={{width: 50, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('~/assets/down_coupon.png')}
              style={{width: 40, height: 40}}
              resizeMode="contain"
            />
            <TextLight style={{fontSize: 12}}>
              {element.cp_coupon_download_txt}
            </TextLight>
          </Pressable>
        </Pressable>
      </Shadow>
    </View>
  )
}

export default React.memo(CouponBookJumju);
