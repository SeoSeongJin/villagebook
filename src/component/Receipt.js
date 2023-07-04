import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import colors from '../styles/colors';
import TextBold from './text/TextBold';
import TextRegular from './text/TextRegular';
import DividerL from './DividerL';
import {replaceString} from '../config/utils/Price';
import {useCustomMutation} from '../hooks/useCustomMutation';
import {useSelector} from 'react-redux';

const Receipt = ({orderResult, isSummary}) => {
  const menuData = orderResult
    ? JSON.parse(orderResult.orderResultData.data.arrItems.od_menu_data)
    : null;
  const orderData = orderResult
    ? orderResult.orderResultData.data.arrItems
    : null;
  const summitedData = orderResult.summitedData ?? null;

  const menuDetail = menuData?.savedItems ?? null;

  // console.log('menuDetail', menuDetail);
  // console.log('orderData', orderData);
  // console.log('summitedData', summitedData);

  const _calcTotalPrice = () => {
    if (menuDetail) {
      let temp = 0;
      menuDetail.map((item, index) => {
        temp += item.totalPrice;
      });
      return temp;
    }
  };

  const _calcLastPrice = () => {
    const totalItemPrice = _calcTotalPrice();
    let temp = 0;
    console.log('totalItemPrice', totalItemPrice);
    temp =
      totalItemPrice +
      (Number(orderData.od_send_cost) + Number(orderData.od_send_cost2)) -
      (Number(orderData.od_coupon_price_store) +
        Number(orderData.od_coupon_price_system) +
        Number(summitedData.od_takeout_discount) +
        Number(summitedData.od_for_here_discount) +
        Number(orderData.od_receipt_point));
    console.log('temp', temp);
    return temp;
  };
  console.log('orderResult', orderResult);

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.borderColor,
        borderRadius: 5,
        paddingHorizontal: 16,
        paddingVertical: 24,
        marginVertical: 16,
      }}>
      <TextBold style={{fontSize: 18, color: colors.fontColor2}}>
        결제금액
      </TextBold>
      <View style={{marginTop: 20}}>
        <View
          style={{
            marginBottom: 11,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TextRegular style={{color: colors.fontColor99}}>
            총 주문금액
          </TextRegular>
          <TextRegular style={{color: colors.fontColor3}}>
            {replaceString(_calcTotalPrice())}원
          </TextRegular>
        </View>
        {summitedData?.od_method === 'delivery' && (
          <>
            <View
              style={{
                marginBottom: 11,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TextRegular style={{color: colors.fontColor99}}>
                배달팁
              </TextRegular>
              <TextRegular style={{color: colors.fontColor3}}>
                {replaceString(summitedData?.od_send_cost)}원
              </TextRegular>
            </View>

            <View
              style={{
                marginBottom: 11,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TextRegular style={{color: colors.fontColor99}}>
                추가배달팁
              </TextRegular>
              <TextRegular style={{color: colors.fontColor3}}>
                {replaceString(orderData?.od_send_cost2)}원
              </TextRegular>
            </View>
          </>
        )}

        {orderData?.od_receipt_point > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 11,
            }}>
            <TextRegular style={{color: colors.fontColor99}}>
              포인트 사용
            </TextRegular>
            <TextRegular style={{color: colors.primary}}>
              - {replaceString(orderData?.od_receipt_point)}원
            </TextRegular>
          </View>
        )}

        {orderData?.od_method !== 'delivery' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 11,
            }}>
            <TextRegular style={{color: colors.fontColor99}}>
              {orderData?.od_method === 'wrap' ? '포장할인' : '먹고가기 할인'}
            </TextRegular>
            <TextRegular style={{color: colors.primary}}>
              -{' '}
              {replaceString(
                orderData?.od_method === 'wrap'
                  ? summitedData?.od_takeout_discount
                  : summitedData?.od_for_here_discount,
              )}
              원{/* - {replaceString(summitedData?.od_takeout_discount)}원 */}
            </TextRegular>
          </View>
        )}

        {orderData?.od_coupon_price_store > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 11,
            }}>
            <TextRegular style={{color: colors.fontColor99}}>
              점주쿠폰 할인
            </TextRegular>
            <TextRegular style={{color: colors.primary}}>
              - {replaceString(summitedData.od_coupon_price_store)}원
            </TextRegular>
          </View>
        )}

        {orderData?.od_coupon_price_system > 0 && (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TextRegular style={{color: colors.fontColor99}}>
              동네북쿠폰 할인
            </TextRegular>
            <TextRegular style={{color: colors.primary}}>
              - {replaceString(summitedData.od_coupon_price_system)}원
            </TextRegular>
          </View>
        )}

        <DividerL style={{height: 1, marginVertical: 20}} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <TextRegular style={{color: colors.fontColor99}}>
            {'주문방법'}
          </TextRegular>
          <TextRegular style={{color: colors.primary}}>
            {orderData?.od_method_value}
          </TextRegular>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
            marginBottom: 20,
          }}>
          <TextRegular style={{color: colors.fontColor99}}>
            {'결제방법'}
          </TextRegular>
          <TextRegular style={{color: colors.primary}}>
            {orderData?.od_pay_method_value}
          </TextRegular>
        </View>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TextBold style={{fontSize: 18, color: colors.fontColor2}}>
          총 결제금액
        </TextBold>

        <TextBold style={{fontSize: 18, color: colors.fontColor2}}>
          {replaceString(_calcLastPrice())}원
        </TextBold>
      </View>
    </View>
  );
};

export default Receipt;
