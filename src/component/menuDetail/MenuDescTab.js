import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Platform,
  useWindowDimensions,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../styles/colors';
import TextRegular from '../text/TextRegular';
import TextNotoM from '../text/TextNotoM';
import {replaceString} from '../../config/utils/Price';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {customAlert} from '../CustomAlert';
import TextSBold from '../text/TextSBold';
import DividerL from '../DividerL';
import TextBold from '../text/TextBold';
import {useDispatch} from 'react-redux';
import {
  setDeliveryInfo,
  setDeliveryType,
} from '../../store/reducers/DeliveryInfoReducer';
import MiniMap from '../../screens/map/MiniMap';
import Clipboard from '@react-native-clipboard/clipboard';
import {setIsDeliveryStore} from '../../store/reducers/PaymentReducer';

const MenuDescTab = ({info, navigation, routeData}) => {
  const dispatch = useDispatch();
  const [tabIdx, setTabIdx] = useState(0);
  const {mutateGetDeliveryFeeInfo} = useCustomMutation();
  const layout = useWindowDimensions();
  console.log('DETAIL ROUTE::::::::::::::::::', routeData);
  const _copyAdd = async () => {
    Clipboard.setString(info.mb_addr1 + ' ' + info.mb_addr2);
    customAlert('알림', '주소가 복사되었습니다.');
    // ToastAndroid.show('주소가 복사되었습니다.', ToastAndroid.SHORT);
  };

  const _getFee = () => {
    const data = {
      jumju_id: info.mb_id,
      jumju_code: info.mb_jumju_code,
      // jumju type: info.
    };

    mutateGetDeliveryFeeInfo.mutate(data, {
      onSettled: e => {
        if (e.result === 'true' && e.data.arrItems.length > 0)
          dispatch(setDeliveryInfo(e.data.arrItems));
        console.log('ee3', e);
      },
    });
  };

  useEffect(() => {
    _getFee();
  }, []);

  useEffect(() => {
    const type = info.store_service;
    if (info.forHere === true) {
      setTabIdx(0);
      return;
    }
    if (type?.do_delivery === true) {
      setTabIdx(1);
      return;
    }
    if (type?.do_take_out === true) {
      setTabIdx(2);
      return;
    }
  }, []);

  useEffect(() => {
    // console.warn(' ++++++++++++++++++++++++++++++++++ ');
    // 0 : 배달, 1 : 포장, 2 : 먹고가기
    if (info.store_service?.do_for_here) {
      console.log(1);
      dispatch(setDeliveryType(2));
      return;
    }
    if (info.store_service?.do_delivery) {
      console.log(2);
      dispatch(setDeliveryType(0));
      return;
    }
    if (info.store_service?.do_take_out) {
      console.log(3);
      dispatch(setDeliveryType(1));
      return;
    }
  }, []);

  console.log(':: info ::', info);

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: colors.borderColor,
          height: 40,
          marginTop: 13,
          // backgroundColor: 'teal',
        }}>
        {info?.forHere === true && (
          <Pressable
            style={{
              flex: 1,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              setTabIdx(0);
              dispatch(setDeliveryType(2));
            }}>
            <View
              style={{
                width: 70,
                height: '100%',
                paddingBottom: 9,
                alignItems: 'center',
                justifyContent: 'flex-end',
                borderBottomWidth: tabIdx === 0 ? 2 : 0,
                borderBottomColor: colors.borderColor22,
              }}>
              <TextSBold
                style={{
                  fontSize: 17,
                  color: tabIdx === 0 ? colors.fontColor2 : colors.fontColorA2,
                }}>
                먹고가기
              </TextSBold>
            </View>
          </Pressable>
        )}
        {info?.store_service?.do_delivery === true && (
          <Pressable
            style={{
              flex: 1,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              setTabIdx(1);
              dispatch(setDeliveryType(0));
              dispatch(setIsDeliveryStore(true));
            }}>
            <View
              style={{
                borderBottomWidth: tabIdx === 1 ? 2 : 0,
                borderBottomColor: colors.borderColor22,
                width: 70,
                height: '100%',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: 9,
              }}>
              <TextSBold
                style={{
                  fontSize: 17,
                  color: tabIdx === 1 ? colors.fontColor2 : colors.fontColorA2,
                }}>
                배달하기
              </TextSBold>
            </View>
          </Pressable>
        )}

        {info?.store_service?.do_take_out === true && (
          <Pressable
            style={{
              flex: 1,
              alignItems: 'center',
              backgroundColor: 'white',
              justifyContent: 'center',
            }}
            onPress={() => {
              setTabIdx(2);
              dispatch(setDeliveryType(1));
              dispatch(setIsDeliveryStore(false));
            }}>
            <View
              style={{
                width: 70,
                height: '100%',
                paddingBottom: 9,
                alignItems: 'center',
                justifyContent: 'flex-end',
                borderBottomWidth: tabIdx === 2 ? 2 : 0,
                borderBottomColor: colors.borderColor22,
              }}>
              <TextSBold
                style={{
                  fontSize: 17,
                  color: tabIdx === 2 ? colors.fontColor2 : colors.fontColorA2,
                }}>
                포장하기
              </TextSBold>
            </View>
          </Pressable>
        )}
      </View>
      <View
        style={{
          paddingHorizontal: 22,
          paddingTop: 20,
          flexDirection: 'row',
        }}>
        {tabIdx === 0 && (
          <>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <View style={{width: 100}}>
                  <TextRegular
                    style={{fontSize: 16, color: colors.fontColor99}}>
                    최소주문금액
                  </TextRegular>
                </View>
                <TextRegular style={{...styles.subTitleTakeout}}>
                  {replaceString(info?.store_service?.minPriceForHere)}
                </TextRegular>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <View style={{width: 100}}>
                  <TextRegular
                    style={{fontSize: 16, color: colors.fontColor99}}>
                    이용방법
                  </TextRegular>
                </View>
                <TextRegular style={{...styles.subTitleTakeout}}>
                  먹고가기
                </TextRegular>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <View style={{width: 100}}>
                  <TextRegular
                    style={{fontSize: 16, color: colors.fontColor99}}>
                    조리시간
                  </TextRegular>
                </View>
                <TextRegular style={{...styles.subTitleTakeout}}>
                  {info?.cooking_time ? info?.cooking_time : '-'}
                </TextRegular>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <View style={{width: 100}}>
                  <TextRegular
                    style={{fontSize: 16, color: colors.fontColor99}}>
                    결제방법
                  </TextRegular>
                </View>
                <TextRegular style={{...styles.subTitleTakeout}}>
                  선결제
                </TextRegular>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 10, flex: 1}}>
                <View style={{width: 100}}>
                  <TextRegular
                    style={{fontSize: 16, color: colors.fontColor99}}>
                    위치안내
                  </TextRegular>
                </View>
                <View style={{flex: 1}}>
                  <TextRegular style={{...styles.subTitleTakeout}}>
                    {info?.mb_addr1 + ' ' + info?.mb_addr2}
                  </TextRegular>
                </View>
              </View>
            </View>
          </>
        )}

        {tabIdx === 1 && (
          <>
            <View style={{justifyContent: 'space-between'}}>
              <TextRegular style={{fontSize: 16, color: colors.fontColor99}}>
                최소주문금액
              </TextRegular>
              <TextRegular
                style={{
                  fontSize: 16,
                  color: colors.fontColor99,
                  marginVertical: 11,
                }}>
                배달시간
              </TextRegular>
              <TextRegular style={{fontSize: 16, color: colors.fontColor99}}>
                배달팁
              </TextRegular>
            </View>

            <View style={{marginLeft: 22, justifyContent: 'space-between'}}>
              <TextRegular style={{fontSize: 16, color: colors.fontColor3}}>
                {replaceString(info?.minPrice)}
              </TextRegular>
              <TextRegular style={{fontSize: 16, color: colors.fontColor3}}>
                {info?.delivery_time ? info?.delivery_time : '-'}
              </TextRegular>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextRegular style={{fontSize: 16, color: colors.fontColor3}}>
                  {replaceString(info?.tipFrom)}원~{replaceString(info?.tipTo)}
                  원
                </TextRegular>
                <Pressable
                  onPress={() => {
                    navigation.navigate('DeliveryTipInfo', {data: info});
                    // _getFeeInfo();
                  }}
                  style={{
                    width: 52,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: colors.dividerL,
                    marginLeft: 7,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextNotoM style={{fontSize: 12, color: colors.fontColor2}}>
                    자세히
                  </TextNotoM>
                </Pressable>
              </View>
            </View>
          </>
        )}

        {tabIdx === 2 && (
          <>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <View style={{width: 100}}>
                  <TextRegular
                    style={{fontSize: 16, color: colors.fontColor99}}>
                    최소주문금액
                  </TextRegular>
                </View>
                <TextRegular style={{...styles.subTitleTakeout}}>
                  {replaceString(info?.minPriceWrap)}
                </TextRegular>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <View style={{width: 100}}>
                  <TextRegular
                    style={{fontSize: 16, color: colors.fontColor99}}>
                    이용방법
                  </TextRegular>
                </View>
                <TextRegular style={{...styles.subTitleTakeout}}>
                  포장
                </TextRegular>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <View style={{width: 100}}>
                  <TextRegular
                    style={{fontSize: 16, color: colors.fontColor99}}>
                    {routeData.category === 'food' ? '조리시간' : '포장시간'}
                  </TextRegular>
                </View>
                <TextRegular style={{...styles.subTitleTakeout}}>
                  {info?.cooking_time ? info?.cooking_time : '-'}
                </TextRegular>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <View style={{width: 100}}>
                  <TextRegular
                    style={{fontSize: 16, color: colors.fontColor99}}>
                    결제방법
                  </TextRegular>
                </View>
                <TextRegular style={{...styles.subTitleTakeout}}>
                  선결제
                </TextRegular>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 10, flex: 1}}>
                <View style={{width: 100}}>
                  <TextRegular
                    style={{fontSize: 16, color: colors.fontColor99}}>
                    위치안내
                  </TextRegular>
                </View>
                <View style={{flex: 1}}>
                  <TextRegular
                    style={{fontSize: 16, ...styles.subTitleTakeout}}>
                    {info?.mb_addr1 + ' ' + info?.mb_addr2}
                  </TextRegular>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
      {/* 
      {(tabIdx === 0 || tabIdx === 2) && (
        <View
          style={{
            // position: 'absolute',
            flex: 1,
            bottom: 0,
            alignSelf: 'flex-end',
            marginRight: 22,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: colors.borderColor,
            overflow: 'hidden',
          }}
        >
          <MiniMap
            lat={info?.mb_lat}
            lng={info?.mb_lng}
            isStore
            width={layout.width - 144}
            height={130}
          />

          <View
            style={{
              flexDirection: 'row',
              height: 40,
              // width: layout.width - 144,
            }}
          >
            <Pressable
              onPress={() => {
                _copyAdd();
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRightWidth: 1,
                borderColor: colors.borderColor,
              }}
            >
              <TextRegular style={{color: colors.fontColor2}}>
                주소복사
              </TextRegular>
            </Pressable>

            <Pressable
              onPress={() =>
                navigation.navigate('Map', {
                  isStore: true,
                  lat: info?.mb_lat,
                  lng: info?.mb_lng,
                })
              }
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            >
              <TextRegular style={{color: colors.fontColor2}}>
                지도보기
              </TextRegular>
            </Pressable>
          </View>
        </View>
      )} */}
    </>
  );
};

export default MenuDescTab;

const styles = StyleSheet.create({
  titleTakout: {
    color: colors.fontColor99,
    marginVertical: 11,
  },
  subTitleTakeout: {
    fontSize: 16,
    color: colors.fontColor3,
  },
});
