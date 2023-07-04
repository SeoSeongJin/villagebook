import {View, Image, ScrollView, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../../styles/commonStyle';
import Header from '../../../component/Header';
import TextBold from '../../../component/text/TextBold';
import TextMedium from '../../../component/text/TextMedium';
import colors from '../../../styles/colors';
import TextRegular from '../../../component/text/TextRegular';
import OptionCount from '../OptionCount';
import DividerL from '../../../component/DividerL';
import CartButton from '../CartButton';
import {useDispatch, useSelector} from 'react-redux';
import {replaceString} from '../../../config/utils/Price';
import {removeItem, resetSavedItem} from '../../../store/reducers/CartReducer';
import {useCustomMutation} from '../../../hooks/useCustomMutation';
import {
  setDeliveryData,
  setIsDeliveryStore,
} from '../../../store/reducers/PaymentReducer';
import Caution from '../../../component/Caution';
import AuthStorageModuel from '../../../store/localStorage/AuthStorageModuel';
import {setDeliveryType} from '../../../store/reducers/DeliveryInfoReducer';
import {resetCoupon} from '../../../store/reducers/CouponReducer';
import {customAlert} from '../../../component/CustomAlert';

const SummitOrder = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {mutateDeliveryFee, mutateStoreInfo} = useCustomMutation();
  const cartStore = useSelector(state => state.cartReducer);
  const [storeInfo, setStoreInfo] = useState();
  const {isDelivery, deliveryType} = useSelector(
    state => state.deliveryReducer,
  );
  console.log('deliveryType', deliveryType);
  const [deliveryInfo, setDeliveryInfo] = useState();
  const _filterOption = prop => {
    const temp = prop.main.option;
    let arr = [];

    temp.map((item, index) => {
      arr.push(item.name, ' : ', item.value, ', ');
    });

    return arr;
  };
  // console.warn('deliveryType', route.params);

  const _getTotalPrice = isSummit => {
    let temp = 0;
    cartStore.savedItem.savedItems.map((item, index) => {
      temp += item.totalPrice;
    });
    if (isSummit) {
      const DeliveryData = {...deliveryInfo};

      if (deliveryType === 1) {
        let calc = temp - DeliveryData?.take_out_discount ?? 0;
        return calc;
      } else if (deliveryType === 2) {
        let calc = temp - DeliveryData?.for_here_discount ?? 0;
        return calc;
      } else {
        let calc = temp + DeliveryData?.send_cost + DeliveryData?.send_cost2;
        return replaceString(calc);
      }
    } else return replaceString(temp);
  };

  const _getDeliveryFee = () => {
    const data = {
      jumju_id: cartStore.savedItem.savedStoreCode.jumju_id,
      jumju_code: cartStore.savedItem.savedStoreCode.code,
      total_price: _getTotalPrice(),
    };
    console.log('_getDeliveryFee :::', data);
    mutateDeliveryFee.mutate(data, {
      onSettled: e => {
        console.log(':: RESULT _getDeliveryFee', e);
        if (e.result === 'true') setDeliveryInfo(e.data.arrItems[0]);
      },
    });
  };

  useEffect(() => {
    _getDeliveryFee();
  }, [cartStore]);

  const _cartStorage = async () => {
    let temp = cartStore.savedItem;
    // console.log('_cartStorag summit3 ::::::::::::', temp);
    temp = {...temp, logo: cartStore.storeLogoUrl};
    // console.log('_cartStorag summit4 ::::::::::::', temp);
    await AuthStorageModuel._setCartData(temp);
  };

  const _getMinPrice = () => {
    switch (deliveryType) {
      case 0:
        return deliveryInfo?.min_price;
      case 1:
        return deliveryInfo?.min_price_wrap;
      case 2:
        return deliveryInfo?.min_price_for_here;
      default:
        return;
    }
  };

  useEffect(() => {
    if (
      cartStore.savedItem.savedItems.length === 0 &&
      cartStore.savedItem.savedStoreCode?.code
    ) {
      dispatch(resetSavedItem());
    } else {
      _cartStorage();
    }
  }, [cartStore.savedItem]);

  useEffect(() => {
    if (deliveryInfo) {
      console.log('path1 :::', deliveryInfo);
      console.log('deliveryType', deliveryType);
      dispatch(setDeliveryData(deliveryInfo));
    }
  }, [deliveryInfo]);

  useEffect(() => {
    if (deliveryType == undefined && deliveryInfo) {
      console.warn(deliveryInfo);
      if (deliveryInfo.for_here === 'true') {
        console.log(1);
        dispatch(setDeliveryType(2));
        return;
      }
      if (deliveryInfo.delivery === 'true') {
        console.log(2);
        dispatch(setDeliveryType(0));
        return;
      }
      if (deliveryInfo.take_out === 'true') {
        console.log(3);
        dispatch(setDeliveryType(1));
        return;
      }
    }
  }, [deliveryInfo]);

  if (cartStore.savedItem.savedItems.length === 0)
    return (
      <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
        <Header title={'카트'} navigation={navigation} />
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Image
            source={require('~/assets/no_cart.png')}
            style={{width: 300, height: 300}}
          />
        </View>
      </SafeAreaView>
    );

  // if (!mutateDeliveryFee.data || mutateDeliveryFee.isLoading)
  //   return <Loading />;
  // console.log('mutate data', mutateDeliveryFee.data);

  return (
    <>
      <SafeAreaView
        style={{flex: 0, backgroundColor: 'white'}}
        edges={['top']}
      />
      <SafeAreaView
        style={{...commonStyles.safeAreaStyle, backgroundColor: colors.primary}}
        edges={['bottom', 'left', 'right']}
      >
        <Header
          title={'카트'}
          navigation={navigation}
          style={{backgroundColor: 'white'}}
        />
        {/* {console.log('sumoder data', route.params)} */}

        <ScrollView
          // contentContainerStyle={{backgroundColor: 'white'}}
          style={{backgroundColor: 'white'}}
        >
          <View
            style={{
              paddingHorizontal: 22,
              alignItems: 'center',
              paddingTop: 20,
            }}
          >
            <Image
              source={{uri: cartStore.storeLogoUrl}}
              style={{
                width: 130,
                height: 130,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.borderColor,
              }}
            />
            <View style={{marginVertical: 10}}>
              <TextMedium style={{fontSize: 18}}>
                {cartStore.currentStoreCode.storeName}
              </TextMedium>
            </View>
            {cartStore.savedItem.savedItems.map((item, index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  padding: 10,
                  width: '100%',
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: colors.borderColor,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}
                >
                  <View style={{flex: 1}}>
                    <TextBold>
                      {item.main.menuName}
                      {'  '}
                    </TextBold>
                    <TextRegular style={{color: colors.fontColorA}}>
                      {_filterOption(item)}
                    </TextRegular>
                    {/* <TextRegular>{item.main.option}</TextRegular> */}
                  </View>
                  <Pressable
                    hitSlop={12}
                    onPress={() => {
                      // const temp = cartStore.savedItem.savedItems.filter(
                      //   (item, index2) => index2 !== index,
                      // );
                      // console.log('temp arr', temp);
                      dispatch(removeItem({index: index}));
                    }}
                  >
                    <Image
                      source={require('~/assets/pop_close.png')}
                      style={{width: 20, height: 20}}
                    />
                  </Pressable>
                </View>
                <TextRegular>사이드 메뉴 추가선택 : </TextRegular>
                {item.sub.length !== 0 ? (
                  item.sub.map((item, index) => (
                    <TextRegular
                      key={index}
                      style={{fontSize: 12, color: colors.fontColorA}}
                    >
                      {item.itemCategory +
                        ' / ' +
                        item.itemName +
                        ' / ' +
                        replaceString(item.itemPrice)}
                      원
                    </TextRegular>
                  ))
                ) : (
                  <TextRegular style={{fontSize: 12, color: colors.fontColorA}}>
                    없음
                  </TextRegular>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}
                >
                  <TextBold>
                    {replaceString(
                      cartStore.savedItem.savedItems[index].totalPrice,
                    )}
                  </TextBold>
                  <OptionCount
                    price={cartStore.mainCount.mainPrice}
                    savedItem={item}
                    index={index}
                    isSummit
                  />
                </View>
              </View>
            ))}

            <Pressable
              onPress={() => {
                console.log('path1', cartStore.currentStoreCode);
                navigation.navigate('MenuDetail2', {
                  jumju_id:
                    cartStore.currentStoreCode?.jumju_id ??
                    cartStore.savedItem.savedStoreCode.jumju_id,
                  jumju_code:
                    cartStore.currentStoreCode?.code ??
                    cartStore.savedItem.savedStoreCode.code,
                  category: cartStore.savedItem.savedStoreCode.category,
                });
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 20,
              }}
            >
              <Image
                source={require('~/assets/ico_plus.png')}
                style={{width: 20, height: 20}}
              />
              <TextBold>더 담으러 가기</TextBold>
            </Pressable>
          </View>
          <DividerL />
          <View style={{flex: 1, paddingHorizontal: 22, paddingTop: 40}}>
            <TextBold>먹고가기/배달/포장 선택</TextBold>
            <Pressable
              // disabled={deliveryInfo?.for_here === 'true' ? false : true}
              onPress={() => {
                if (deliveryInfo?.for_here === 'true') {
                  dispatch(setDeliveryType(2));
                } else {
                  customAlert(
                    '알림',
                    '해당 가게는 먹고가기를 지원하지 않습니다.',
                  );
                }
              }}
              style={{
                flex: 1,
                height: 50,
                borderRadius: 7,
                marginTop: 10,
                backgroundColor:
                  deliveryType === 2 ? colors.primary : colors.inputBoxBG,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextBold
                style={{
                  color:
                    deliveryType === 2
                      ? 'white'
                      : deliveryInfo?.for_here === 'false'
                      ? 'gray'
                      : colors.fontColor2,
                }}
              >
                먹고가기
              </TextBold>
            </Pressable>

            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
              <Pressable
                onPress={() => {
                  if (deliveryInfo?.delivery === 'true') {
                    dispatch(setDeliveryType(0));
                    dispatch(setIsDeliveryStore(true));
                  } else {
                    customAlert(
                      '알림',
                      '해당 가게는 배달을 지원하지 않습니다.',
                    );
                  }
                }}
                style={{
                  flex: 1,
                  borderRadius: 7,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 50,
                  marginRight: 10,
                  backgroundColor:
                    deliveryType === 0 ? colors.primary : colors.inputBoxBG,
                }}
              >
                <TextBold
                  style={{
                    color:
                      deliveryType === 0
                        ? 'white'
                        : deliveryInfo?.delivery === 'false'
                        ? 'gray'
                        : colors.fontColor2,
                  }}
                >
                  배달
                </TextBold>
              </Pressable>
              <Pressable
                // disabled={deliveryInfo?.take_out === 'true' ? false : true}
                onPress={() => {
                  // dispatch(setIsDelivery(false));
                  if (deliveryInfo?.take_out === 'true') {
                    dispatch(setDeliveryType(1));
                    dispatch(setIsDeliveryStore(false));
                  } else {
                    customAlert(
                      '알림',
                      '해당 가게는 포장을 지원하지 않습니다.',
                    );
                  }
                }}
                style={{
                  flex: 1,
                  borderRadius: 7,
                  backgroundColor:
                    deliveryType === 1 ? colors.primary : colors.inputBoxBG,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TextBold
                  style={{
                    color:
                      deliveryType === 1
                        ? 'white'
                        : deliveryInfo?.take_out === 'false'
                        ? 'gray'
                        : colors.fontColor2,
                  }}
                >
                  포장
                </TextBold>
              </Pressable>
            </View>

            <View style={{marginTop: 10}}>
              {deliveryType === 0 ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <TextRegular>배달팁</TextRegular>
                    <TextRegular>
                      {replaceString(deliveryInfo?.send_cost)}원
                    </TextRegular>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 10,
                    }}
                  >
                    <TextRegular>추가 배달팁</TextRegular>
                    <TextRegular>
                      {replaceString(deliveryInfo?.send_cost2)}원
                    </TextRegular>
                  </View>
                </>
              ) : deliveryType === 1 ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 10,
                    }}
                  >
                    <TextRegular>포장할인</TextRegular>
                    <TextRegular>
                      {replaceString(deliveryInfo?.take_out_discount)}원
                    </TextRegular>
                  </View>
                </>
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 10,
                    }}
                  >
                    <TextRegular>먹고가기 할인</TextRegular>
                    <TextRegular>
                      {replaceString(deliveryInfo?.for_here_discount)}원
                    </TextRegular>
                  </View>
                </>
              )}

              <View
                style={{height: 1, backgroundColor: colors.borderColor}}
              ></View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                  marginBottom: 10,
                }}
              >
                <TextBold style={{fontSize: 18}}>총 주문 금액</TextBold>
                <TextBold style={{fontSize: 18}}>
                  {replaceString(_getTotalPrice(true))}
                </TextBold>
              </View>
              <View
                style={{
                  alignSelf: 'flex-end',
                  marginBottom: 20,
                  flexDirection: 'row',
                }}
              >
                <TextMedium style={{fontSize: 12}}>최소주문금액 : </TextMedium>
                <TextMedium style={{fontSize: 12}}>
                  {replaceString(_getMinPrice())}
                </TextMedium>
              </View>
            </View>
          </View>
          <Caution />
        </ScrollView>
        <View style={{flex: 1}}>
          <CartButton
            navigation={navigation}
            goTo={'OrderPage'}
            isDelivery={deliveryType === 0 ? true : false}
            lastPrice={_getTotalPrice(true)}
            deliveryInfo={deliveryInfo}
            data={route.params?.data}
            isLoading={mutateDeliveryFee.isLoading}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default SummitOrder;
