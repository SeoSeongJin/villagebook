import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  Modal,
  Platform,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import Header from '../../component/Header';
import TextBold from '../../component/text/TextBold';
import colors from '../../styles/colors';
import TextNotoM from '../../component/text/TextNotoM';
import TextRegular from '../../component/text/TextRegular';
import TextNotoB from '../../component/text/TextNotoB';
import {replaceString} from '../../config/utils/Price';
import CouponTicket from './CouponTicket';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {useSelector} from 'react-redux';
import Loading from '../../component/Loading';
import {customAlert} from '../../component/CustomAlert';
import UseInfoList from '../../config/UseInfoList';

const DiscountMain = ({navigation}) => {
  const {userInfo} = useSelector(state => state.authReducer);
  const layout = useWindowDimensions();
  const [page, setPage] = useState(1);
  const [couponList, setCouponList] = useState();

  const renderItem = item => {
    return <CouponTicket data={item} navigation={navigation} />;
  };

  const {mutateGetCoupon} = useCustomMutation();

  const itemLimit = useRef(0);

  const _getCoupon = () => {
    const data = {
      mt_id: userInfo.mt_id,
      item_count: itemLimit.current,
      limit_count: 20,
    };

    mutateGetCoupon.mutate(data, {
      onSuccess: e => {
        if (e.result === 'true' && e.data.arrItems.length > 0) {
          setCouponList(e.data.arrItems);
        } else setCouponList([]);
        console.log('_getCoupon', e);
      },
    });
  };

  const _getMoreCoupon = () => {
    itemLimit.current += 20;

    const data = {
      mt_id: userInfo.mt_id,
      item_count: itemLimit.current + 20,
      limit_count: 20,
    };

    mutateGetCoupon.mutate(data, {
      onSuccess: e => {
        if (e.result === 'false')
          return customAlert('알림', '더보기 가능한 쿠폰이 없습니다.');
        else if (couponList.length > 0 && e.data.arrItems.length > 0) {
          setCouponList(prev => prev.concat(e.data.arrItems));
        }
        console.log('_getMoreCoupon', e);
      },
    });
  };

  useEffect(() => {
    _getCoupon();
  }, []);

  if (!couponList) return <Loading />;

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header
        title={'할인함 (포인트&쿠폰)'}
        showCart={true}
        navigation={navigation}
      />
      <FlatList
        ListEmptyComponent={
          <View
            style={{
              marginTop: '25%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('~/assets/no_coupon.png')}
              style={{width: 250, height: 250}}
              resizeMode="contain"
            />
          </View>
        }
        ListFooterComponent={() =>
          couponList.length > 0 &&
          (mutateGetCoupon.isLoading && couponList ? (
            <Loading />
          ) : (
            <Pressable
              onPress={() => {
                _getMoreCoupon();
              }}
              style={{
                width: 150,
                height: 50,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.primary,
              }}>
              <TextBold style={{color: 'white'}}>더보기</TextBold>
            </Pressable>
          ))
        }
        ListFooterComponentStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 20,
        }}
        ListHeaderComponent={
          <View style={{paddingHorizontal: 14, marginTop: 26}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TextBold style={{fontSize: 18, color: colors.fontColor2}}>
                포인트 & 쿠폰 안내
              </TextBold>
              <Pressable
                onPress={() => {
                  navigation.navigate('UseInfo', {
                    target: UseInfoList.target.coupon_use,
                  });
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
            <View
              style={{
                height: 50,
                borderRadius: 5,
                marginTop: 23,
                marginBottom: 10,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: colors.inputBoxBG,
              }}>
              <TextRegular>내 포인트</TextRegular>
              <TextNotoB style={{fontSize: 15, color: colors.primary}}>
                {replaceString(userInfo.mt_point)}P
              </TextNotoB>
            </View>
          </View>
        }
        data={couponList}
        renderItem={item => renderItem(item)}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default DiscountMain;
