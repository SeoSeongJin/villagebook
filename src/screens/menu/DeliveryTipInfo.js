import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../component/Header';
import TextRegular from '../../component/text/TextRegular';
import commonStyles from '../../styles/commonStyle';
import TextSBold from '../../component/text/TextSBold';
import DividerL from '../../component/DividerL';
import colors from '../../styles/colors';
import {customAlert} from '../../component/CustomAlert';
import {replaceString} from '../../config/utils/Price';
import {useSelector} from 'react-redux';

const DeliveryTipInfo = ({route, navigation}) => {
  const routeData = route.params.data;
  console.log('route', route.params);
  const {deliveryInfo} = useSelector(state => state.deliveryReducer);

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'배달팁'} navigation={navigation} />
      <View style={{padding: 22}}>
        <TextSBold style={{color: colors.fontColor2}}>배달팁 정보</TextSBold>
        <View style={{marginVertical: 10}}>
          <TextRegular>
            {routeData.store_service.do_jumju_delivery_guide}
          </TextRegular>
        </View>
        <DividerL style={{height: 1, marginVertical: 10}} />
        <View
          style={{
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <View style={{flex: 2}}>
              <TextSBold style={{color: colors.fontColor2}}>
                주문 금액
              </TextSBold>
            </View>
            <View style={{flex: 1}}>
              <TextSBold style={{color: colors.fontColor2}}>배달팁</TextSBold>
            </View>
          </View>
          {deliveryInfo.map((item, index) => (
            <View key={index} style={{flexDirection: 'row'}}>
              <View style={{flex: 2}}>
                <TextRegular style={{color: colors.fontColor2}}>
                  {replaceString(item.dd_charge_start)}원 ~{' '}
                  {replaceString(item.dd_charge_end)}원
                </TextRegular>
              </View>
              <View style={{flex: 1}}>
                <TextRegular style={{color: colors.fontColor2}}>
                  {replaceString(item.dd_charge_price)}원
                </TextRegular>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DeliveryTipInfo;
