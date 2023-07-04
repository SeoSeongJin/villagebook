import {View, Text, FlatList, Pressable} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import Header from '../../component/Header';
import TextRegular from '../../component/text/TextRegular';
import colors from '../../styles/colors';
import FastImage from 'react-native-fast-image';
import dayjs from 'dayjs';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {useSelector} from 'react-redux';
import Loading from '../../component/Loading';
import {customAlert} from '../../component/CustomAlert';
import TextBold from '../../component/text/TextBold';
import NoHistory from '../../component/NoHistory';
import {useDispatch} from 'react-redux';
import {setIsLifeStyle} from '../../store/reducers/CategoryReducer';

const OrderList = ({navigation}) => {
  const [history, setHistory] = useState([]);
  const {mutateOrderHistory} = useCustomMutation();
  const {userInfo} = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  const itemLimit = useRef(0);

  const _getHistory = () => {
    const data = {
      item_count: itemLimit.current,
      limit_count: 20,
      mt_id: userInfo.mt_id,
    };

    console.log('log 1', data);

    mutateOrderHistory.mutate(data, {
      onSettled: e => {
        if (e.result === 'true' && e.data.arrItems.length > 0)
          setHistory(e.data.arrItems);
        else setHistory([]);
      },
    });
  };

  const _getMoreHistory = () => {
    itemLimit.current += 20;
    const data = {
      item_count: itemLimit.current,
      limit_count: 20,
      mt_id: userInfo.mt_id,
    };
    mutateOrderHistory.mutate(data, {
      onSettled: e => {
        if (e.result === 'true' && e.data.arrItems.length > 0) {
          console.log('hihi');
          setHistory(prev => prev.concat(e.data.arrItems));
        } else customAlert('알림', '이전 주문내역이 없습니다.');
      },
    });
  };

  useEffect(() => {
    _getHistory();
    return () => {};
  }, []);

  const renderItem = item => {
    // od_process_status : 신규주문 / 접수완료 / 배달중 / 배달완료
    const data = item.item;
    const isDeliveried = data.od_process_status === '배달완료' ? true : false;
    const isReviewPossible = data.od_review === 'true' ? true : false;
    console.log('item', item);
    return (
      <View
        style={{
          flex: 1,
          borderTopWidth: 1,
          borderTopColor: colors.borderColor,
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.storeIcon,
            paddingHorizontal: 22,
            paddingVertical: 10,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View style={{flex: 1}}>
            <TextRegular>주문일자 : {data.od_time}</TextRegular>
          </View>
          <View
            style={{
              width: 90,
              height: 25,
              borderRadius: 20,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TextRegular style={{color: 'white'}}>
              {data.od_process_status}
            </TextRegular>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 22,
            paddingBottom: 10,
            paddingTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <FastImage
            source={
              data.store_logo
                ? {uri: data.store_logo}
                : require('~/assets/no_use_img.png')
            }
            style={{width: 70, height: 70, borderRadius: 20}}
          />
          <View style={{marginLeft: 10, flex: 1}}>
            <TextRegular style={{fontSize: 16}}>{data.mb_company}</TextRegular>
            <TextRegular>{data.od_good_name}</TextRegular>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            height: 40,
            paddingHorizontal: 22,
            marginBottom: 15,
          }}>
          <Pressable
            onPress={() => {
              dispatch(setIsLifeStyle(false));
              navigation.navigate('MenuDetail2', {
                jumju_id: data.jumju_id,
                jumju_code: data.jumju_code,
                category: data.jumju_type,
                mb_company: data.mb_company,
              });
            }}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: colors.borderColor,
              marginRight: 10,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextRegular style={{color: colors.fontColor2}}>
              가게보기
            </TextRegular>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('OrderSumary', {
                orderData: {
                  mt_id: userInfo.mt_id,
                  od_id: data.od_id,
                  jumju_id: data.jumju_id,
                  jumju_code: data.jumju_code,
                  category: data.jumju_type,
                },
              });
            }}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: colors.borderColor,
              marginRight: 10,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextRegular style={{color: colors.fontColor2}}>
              주문상세
            </TextRegular>
          </Pressable>
          <Pressable
            onPress={() => {
              return navigation.navigate('WriteReview', {storeInfo: data});
              isDeliveried
                ? isReviewPossible
                  ? navigation.navigate('WriteReview', {storeInfo: data})
                  : customAlert('알림', '이미 작성된 리뷰가 있습니다.')
                : customAlert('알림', '배달완료된 주문만 리뷰작성 가능합니다');
            }}
            style={{
              flex: 1,
              borderWidth: 1,
              backgroundColor:
                isDeliveried && isReviewPossible ? 'white' : colors.inputBoxBG,
              borderColor: colors.borderColor,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextRegular
              style={{
                color: isDeliveried ? colors.fontColor2 : colors.fontColorA,
              }}>
              리뷰쓰기
            </TextRegular>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'주문내역'} navigation={navigation} showCart={true} />
      {/* {console.log('his', history)} */}
      <FlatList
        data={history}
        ListEmptyComponent={() => <NoHistory />}
        renderItem={item => renderItem(item)}
        keyExtractor={(item, index) => item.od_id + index}
        ListFooterComponentStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 20,
        }}
        ListFooterComponent={e =>
          mutateOrderHistory.isLoading && history ? (
            <Loading />
          ) : history.length > 0 ? (
            <Pressable
              onPress={() => {
                _getMoreHistory();
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
          ) : (
            <></>
          )
        }
      />
    </SafeAreaView>
  );
};

export default OrderList;
