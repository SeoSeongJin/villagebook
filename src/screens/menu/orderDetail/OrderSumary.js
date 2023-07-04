import {View, Text, Image, ScrollView, Pressable, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../../styles/commonStyle';
import Header from '../../../component/Header';
import colors from '../../../styles/colors';
import TextMedium from '../../../component/text/TextMedium';
import TextRegular from '../../../component/text/TextRegular';
import TextNotoM from '../../../component/text/TextNotoM';
import TextBold from '../../../component/text/TextBold';
import DividerL from '../../../component/DividerL';
import Receipt from '../../../component/Receipt';
import {useCustomMutation} from '../../../hooks/useCustomMutation';
import Loading from '../../../component/Loading';
import {replaceString} from '../../../config/utils/Price';

const OrderSumary = ({navigation, route}) => {
  const routeData = route.params?.orderData;

  const [orderData, setOrderData] = useState();
  const {mutateOrderDetail} = useCustomMutation();

  const _getDetail = () => {
    const data = {
      mt_id: routeData.mt_id,
      od_id: routeData.od_id,
      jumju_id: routeData.jumju_id,
      jumju_code: routeData.jumju_code,
    };
    console.log('data', data);
    mutateOrderDetail.mutate(data, {
      onSuccess: e => {
        console.log('e', e);
        if (e.data?.arrItems) {
          _parseCartData(e.data.arrItems);
        }
      },
    });
  };

  const _parseCartData = prop => {
    let temp = [];

    prop.orderDetail.map((item, index) => {
      temp.push(JSON.parse(item.cart_data));
    });
    console.log('parsed', temp);

    setOrderData({data: prop, parsedCartData: temp});
    return temp;
  };

  useEffect(() => {
    _getDetail();
  }, []);

  if (!orderData) return <Loading />;

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'주문 상세'} navigation={navigation} />
      <ScrollView>
        <View
          style={{
            backgroundColor: colors.inputBoxBG,
            paddingHorizontal: 22,
            paddingVertical: 20,
          }}
        >
          <View style={{flexDirection: 'row'}}>
            <Image
              source={
                orderData.data.store.store_logo
                  ? {uri: orderData.data.store.store_logo}
                  : require('~/assets/no_use_img.png')
              }
              style={{width: 60, height: 60, borderRadius: 10}}
            />
            <View
              style={{flex: 1, marginLeft: 10, justifyContent: 'space-evenly'}}
            >
              <TextMedium style={{color: colors.fontColor2}}>
                {orderData.data.store.mb_company}
              </TextMedium>
              <TextRegular style={{color: colors.fontColor6}}>
                {orderData.data.order.order_good_name}{' '}
                {orderData.data.orderDetail.lenght > 1 &&
                  '외' + (orderData.data.orderDetail.length - 1) + '건'}
              </TextRegular>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Pressable
              onPress={() =>
                Linking.openURL(`tel: ${orderData.data.store.mb_tel}`)
              }
              style={{
                flex: 1,
                height: 45,
                marginRight: 5,
                borderRadius: 5,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextNotoM style={{color: 'white'}}>가게 전화</TextNotoM>
            </Pressable>
            <Pressable
              onPress={() => {
                console.log('data', orderData.data.store);
                navigation.navigate('MenuDetail2', {
                  jumju_id: orderData.data.store.jumju_id,
                  jumju_code: orderData.data.store.jumju_code,
                  category: route.params.orderData.category,
                  mb_company: orderData.data.store.mb_company,
                });
              }}
              style={{
                flex: 1,
                height: 45,
                borderRadius: 5,
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: colors.borderColor,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextNotoM style={{color: colors.fontColorA}}>
                가게 보기
              </TextNotoM>
            </Pressable>
          </View>
        </View>
        {orderData.parsedCartData[0].savedItems.map((item2, index) => (
          <View key={index}>
            <View style={{paddingHorizontal: 22, paddingTop: 19}}>
              <TextMedium style={{fontSize: 17, color: colors.fontColor2}}>
                {item2.main.menuName}
                {'  '}
                <TextRegular
                  style={{
                    fontSize: 12,
                    color: colors.fontColorA,
                  }}
                >
                  수량 : {item2.count}
                </TextRegular>
              </TextMedium>

              <View style={{marginVertical: 10}}>
                {item2.main.option.map((item3, index) => (
                  <TextRegular
                    key={item3 + index}
                    style={{color: colors.fontColor99}}
                  >
                    - {item3.name} : {item3.value}
                  </TextRegular>
                ))}
              </View>
              {item2.sub.length > 0 && (
                <>
                  <TextMedium style={{fontSize: 13, color: colors.fontColor2}}>
                    추가선택
                  </TextMedium>

                  <View style={{marginVertical: 10}}>
                    {item2.sub.map((item3, index) => (
                      <TextRegular
                        key={item3 + index}
                        style={{color: colors.fontColor99}}
                      >
                        - {item3.itemCategory} : {item3.itemName}
                      </TextRegular>
                    ))}
                  </View>
                </>
              )}
              <View style={{alignSelf: 'flex-end'}}>
                <TextBold style={{fontSize: 17, color: colors.fontColor2}}>
                  {replaceString(item2.totalPrice)}원
                </TextBold>
              </View>
            </View>
            <DividerL style={{height: 1, marginVertical: 10}} />
          </View>
        ))}

        <View
          style={{
            borderWidth: 1,
            borderColor: colors.borderColor,
            borderRadius: 5,
            paddingHorizontal: 16,
            paddingVertical: 24,
            marginVertical: 16,
            marginHorizontal: 22,
          }}
        >
          <TextBold style={{fontSize: 18, color: colors.fontColor2}}>
            결제금액
          </TextBold>
          <View style={{marginTop: 20}}>
            <View
              style={{
                marginBottom: 11,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TextRegular style={{color: colors.fontColor99}}>
                총 주문금액
              </TextRegular>
              <TextRegular style={{color: colors.fontColor3}}>
                {replaceString(orderData.data.order.odder_cart_price)}원
              </TextRegular>
            </View>

            <View
              style={{
                marginBottom: 11,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TextRegular style={{color: colors.fontColor99}}>
                배달팁
              </TextRegular>
              <TextRegular style={{color: colors.fontColor3}}>
                {replaceString(orderData.data.order.order_cost)}원
              </TextRegular>
            </View>

            <View
              style={{
                marginBottom: 11,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TextRegular style={{color: colors.fontColor99}}>
                추가배달팁
              </TextRegular>
              <TextRegular style={{color: colors.fontColor3}}>
                {replaceString(orderData.data.order.order_cost2)}원
              </TextRegular>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 11,
              }}
            >
              <TextRegular style={{color: colors.fontColor99}}>
                포인트
              </TextRegular>
              <TextRegular style={{color: colors.primary}}>
                - {replaceString(orderData.data.order.order_point)}원
              </TextRegular>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 11,
              }}
            >
              <TextRegular style={{color: colors.fontColor99}}>
                먹고가기 할인
              </TextRegular>
              <TextRegular style={{color: colors.primary}}>
                - {replaceString(orderData.data.order.order_for_here_discount)}
                원
              </TextRegular>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 11,
              }}
            >
              <TextRegular style={{color: colors.fontColor99}}>
                포장 할인
              </TextRegular>
              <TextRegular style={{color: colors.primary}}>
                - {replaceString(orderData.data.order.order_take_out_discount)}
                원
              </TextRegular>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 11,
              }}
            >
              <TextRegular style={{color: colors.fontColor99}}>
                점주쿠폰 할인
              </TextRegular>
              <TextRegular style={{color: colors.primary}}>
                - {replaceString(orderData.data.order.order_coupon_store)}원
              </TextRegular>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}
            >
              <TextRegular style={{color: colors.fontColor99}}>
                동네북쿠폰 할인
              </TextRegular>
              <TextRegular style={{color: colors.primary}}>
                - {replaceString(orderData.data.order.order_coupon_system)}원
              </TextRegular>
            </View>

            <DividerL style={{height: 1, marginVertical: 20}} />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}
            >
              <TextRegular style={{color: colors.fontColor99}}>
                {'주문방법'}
              </TextRegular>
              <TextRegular style={{color: colors.primary}}>
                {orderData.data.order.od_method === 'delivery'
                  ? '배달'
                  : orderData.data.order.od_method === 'warp'
                  ? '포장'
                  : '먹고가기'}
              </TextRegular>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
                marginBottom: 20,
              }}
            >
              <TextRegular style={{color: colors.fontColor99}}>
                {'결제방법'}
              </TextRegular>
              <TextRegular style={{color: colors.primary}}>
                {orderData.data.order.od_settle_case}
              </TextRegular>
            </View>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TextBold style={{fontSize: 18, color: colors.fontColor2}}>
              총 결제금액
            </TextBold>

            <TextBold style={{fontSize: 18, color: colors.fontColor2}}>
              {replaceString(orderData.data.order.order_sumprice)}원
            </TextBold>
          </View>
        </View>

        <View style={{paddingHorizontal: 22}}>
          <View style={{marginBottom: 13, flexDirection: 'row', flex: 1}}>
            <View style={{width: 120}}>
              <TextRegular
                style={{
                  color: colors.fontColor99,
                  marginBottom: 13,
                }}
              >
                배달주소
              </TextRegular>
            </View>
            <View style={{flex: 1}}>
              <TextRegular
                style={{
                  color: colors.fontColor99,
                  marginBottom: 13,
                  color: colors.fontColor3,
                }}
              >
                {console.log('orderData.data.order.', orderData.data.order)}
                {orderData.data.order.order_addr1}{' '}
                {orderData.data.order?.order_addr2}{' '}
                {orderData.data.order?.order_addr3}
              </TextRegular>
            </View>
          </View>

          <View style={{marginBottom: 13, flexDirection: 'row', flex: 1}}>
            <View style={{width: 120}}>
              <TextRegular
                style={{
                  color: colors.fontColor99,
                  marginBottom: 13,
                }}
              >
                전화번호
              </TextRegular>
            </View>
            <View style={{flex: 1}}>
              <TextRegular
                style={{
                  color: colors.fontColor99,
                  marginBottom: 13,
                  color: colors.fontColor3,
                }}
              >
                {orderData.data.order.order_hp}
              </TextRegular>
            </View>
          </View>

          <View style={{marginBottom: 13, flexDirection: 'row', flex: 1}}>
            <View style={{width: 120}}>
              <TextRegular
                style={{
                  color: colors.fontColor99,
                  marginBottom: 13,
                }}
              >
                가게 사장님에게
              </TextRegular>
            </View>
            <View style={{flex: 1}}>
              <TextRegular
                style={{
                  color: colors.fontColor99,
                  marginBottom: 13,
                  color: colors.fontColor3,
                }}
              >
                {orderData.data.order.order_seller}
              </TextRegular>
            </View>
          </View>

          <View style={{marginBottom: 13, flexDirection: 'row', flex: 1}}>
            <View style={{width: 120}}>
              <TextRegular
                style={{
                  color: colors.fontColor99,
                  marginBottom: 13,
                }}
              >
                배달 기사님에게
              </TextRegular>
            </View>
            <View style={{flex: 1}}>
              <TextRegular
                style={{
                  color: colors.fontColor99,
                  marginBottom: 13,
                  color: colors.fontColor3,
                }}
              >
                {orderData.data.order.order_officer}
              </TextRegular>
            </View>
          </View>

          {/* 
          <Pressable
            style={{
              height: 50,
              backgroundColor: colors.primary,
              borderRadius: 5,
              marginBottom: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TextMedium style={{color: 'white', fontSize: 17}}>
              주문내역 삭제
            </TextMedium>
          </Pressable> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderSumary;
