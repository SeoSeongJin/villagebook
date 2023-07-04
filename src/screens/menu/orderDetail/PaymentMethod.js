import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../../styles/commonStyle';
import Header from '../../../component/Header';
import TextRegular from '../../../component/text/TextRegular';
import colors from '../../../styles/colors';
import {useDispatch} from 'react-redux';
import {setPaymentMethod} from '../../../store/reducers/PaymentReducer';
import PaymentList from '../../../config/PaymentList';
import CouponTicket from '../../discount/CouponTicket';
import {resetCoupon} from '../../../store/reducers/CouponReducer';

const PaymentMethod = ({navigation, route}) => {
  const routeData = route.params;
  const layout = useWindowDimensions();
  // console.log('routeData', routeData);
  const dispatch = useDispatch();

  const _getTitle = () => {
    if (routeData?.useCoupon) return '쿠폰 선택';
    else return '결제 수단';
  };

  const renderItem = item => {
    return (
      <>
        <CouponTicket
          data={item}
          download={routeData.download}
          storeInfo={routeData.storeInfo}
          select={routeData.select}
          type={routeData.type}
          navigation={navigation}
          useCoupon={routeData?.useCoupon}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={_getTitle()} navigation={navigation} isPayment={true} />
      {routeData?.useCoupon ? (
        <>
          <FlatList
            data={routeData.storeCoupon}
            renderItem={item => renderItem(item)}
            keyExtractor={(item, index) => index}
            ListEmptyComponent={
              <View style={{marginTop: '40%', marginHorizontal: 22}}>
                <Image
                  source={require('~/assets/no_coupon.png')}
                  style={{
                    height: layout.width,
                    width: '70%',
                    alignSelf: 'center',
                  }}
                  resizeMode="contain"
                />
              </View>
            }
          />
          {/* <CouponTicket data={routeData.storeCoupon} /> */}
        </>
      ) : (
        <View style={{paddingHorizontal: 22}}>
          <Pressable
            onPress={() => {
              dispatch(setPaymentMethod(PaymentList.card));
              navigation.goBack();
            }}
            style={{
              height: 50,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderBottomWidth: 1,
              borderColor: colors.borderColor,
            }}
          >
            <TextRegular>{PaymentList.card}</TextRegular>
            <Image
              source={require('~/assets/arrow_r.png')}
              style={{width: 20, height: 20}}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              dispatch(setPaymentMethod(PaymentList.offlineCard));
              dispatch(resetCoupon());
              navigation.goBack();
            }}
            style={{
              height: 50,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderBottomWidth: 1,
              borderColor: colors.borderColor,
            }}
          >
            <TextRegular>{PaymentList.offlineCard}</TextRegular>
            <Image
              source={require('~/assets/arrow_r.png')}
              style={{width: 20, height: 20}}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              dispatch(setPaymentMethod(PaymentList.offlineCash));
              dispatch(resetCoupon());
              navigation.goBack();
            }}
            style={{
              height: 50,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderBottomWidth: 1,
              borderColor: colors.borderColor,
            }}
          >
            <TextRegular>{PaymentList.offlineCash}</TextRegular>
            <Image
              source={require('~/assets/arrow_r.png')}
              style={{width: 20, height: 20}}
            />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PaymentMethod;
