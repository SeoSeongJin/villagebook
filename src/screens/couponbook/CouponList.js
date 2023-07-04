import {View, Text} from 'react-native';
import React from 'react';
import {Image} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {Pressable} from 'react-native';
import {FlatList} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import TextMedium from '../../component/text/TextMedium';
import TextBold from '../../component/text/TextBold';
import TextLight from '../../component/text/TextLight';
import colors from '../../styles/colors';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {useEffect} from 'react';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {Alert} from 'react-native';
import MainBanner from '../../component/MainBanner';
import BannerList from '../../config/BannerList';

const CouponList = ({navigation, route, isMy}) => {
  const layout = useWindowDimensions();
  const routeData = route?.params;
  const [couponData, setCouponData] = useState([]);
  const {couponBoolFilterIndex} = useSelector(state => state.couponReducer);
  const {mutateGetCouponBookList, mttCpbSave, mttCpbMy} = useCustomMutation();
  const {currentLocation} = useSelector(state => state.locationReducer);
  const {userInfo} = useSelector(state => state.authReducer);

  const _getBookList = () => {
    const data = {
      item_count: 0,
      limit_count: 20,
      ca_code: routeData?.ca_code,
      ca_sort: couponBoolFilterIndex,
      mb_lat: currentLocation?.lat,
      mb_lng: currentLocation?.lon,
    };
    console.log('## data', data);
    // return;
    mutateGetCouponBookList.mutate(data, {
      onSuccess: res => {
        console.log('## res', res.data);
        if (res.data?.arrItems?.length > 0) {
          setCouponData(res.data.arrItems);
        }
      },
    });
  };

  const _getMyCBList = () => {
    const data = {
      item_count: '0',
      // limit_count: '10',
      mt_id: userInfo.mt_id,
      // N 미사용, Y 사용 완료
      cp_use: tabIndex === '1' ? 'N' : 'Y',
    };
    mttCpbMy.mutate(data, {
      onSuccess: res => {
        console.log('res', res.data.arrItems);
        setMyCpn(res.data.arrItems);
      },
    });
    console.log('data ::', data);
  };

  // const

  useEffect(() => {
    _getBookList();
  }, [couponBoolFilterIndex]);

  const _onPressSave = element => {
    // console.log('element', element);
    const data = {
      jumju_id: element.cp_jumju_id,
      jumju_code: element.cp_jumju_code,
      mt_id: userInfo.mt_id,
      coupon_id: element.cp_id,
    };
    console.log('data', data);

    if (!userInfo) {
      Alert.alert('쿠폰북', '로그인이 필요합니다.', [
        {
          text: '로그인 하러 가기',
          onPress: () =>
            navigation.reset({
              routes: [{name: 'Login'}],
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

  const renderItem = item => {
    const element = item.item;
    const elementIdx = item.index;
    // console.log('element', element);
    return (
      <Shadow
        distance={5}
        offset={[0, 2]}
        style={{width: '100%'}}
        containerStyle={{
          marginTop: elementIdx === 0 && isMy ? 14 : 0,
          marginHorizontal: 14,
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
    );
  };

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        // flex: 1,
      }}>
      <FlatList
        data={couponData}
        keyExtractor={(item, index) => index}
        renderItem={item => renderItem(item)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{width: layout.width}}
        ListHeaderComponent={
          <>
            {routeData?.isMain && (
              <MainBanner
                navigation={navigation}
                style={{
                  marginBottom: 30,
                }}
                position={BannerList.couponBook}
              />
            )}
          </>
        }
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Image
                source={require('~/assets/coupon_ready.png')}
                style={{height: (layout.width * 0.8) * 1, width: layout.width * 0.8}}
                resizeMode="contain"
              />
          </View>
        }
      />
    </View>
  );
};

export default CouponList;
