import {View, Text, Pressable, StyleSheet, Image, FlatList} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import Header from '../../component/Header';
import TextBold from '../../component/text/TextBold';
import colors from '../../styles/colors';
import TextRegular from '../../component/text/TextRegular';
import TextMedium from '../../component/text/TextMedium';
import DividerL from '../../component/DividerL';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {useSelector} from 'react-redux';
import Loading from '../../component/Loading';
import AddressMainRenderItem from './AddressMainRenderItem';
import {useDispatch} from 'react-redux';
import {setCurrentAdd, setPostData} from '../../store/reducers/AddressReducer';
import {customAlert} from '../../component/CustomAlert';
import {setCurrentLocation} from '../../store/reducers/LocationRecuder';

const AddressMain = ({navigation, route}) => {
  const addData = route.params?.addData;
  const dispatch = useDispatch();
  const {userInfo} = useSelector(state => state.authReducer);
  const {currentAdd} = useSelector(state => state.addressReducer);
  const {mutateGetRecentAddress, mutateDeleteUserAddr, mutateSetMainAddr} =
    useCustomMutation();
  const [recentAdd, setRecentAdd] = useState([]);
  // const [currentAdd, setCurrentAdd] = useState();
  // const {trigger} = useSelector(state => state.addressReducer);

  const itemLimit = useRef(0);
  console.log('addData', addData);

  const _getRecentAdd = () => {
    const data = {
      mt_id: userInfo.mt_id,
      item_count: itemLimit.current,
      limit_count: 20,
    };
    console.log('data', data);
    mutateGetRecentAddress.mutate(data, {
      onSuccess: e => {
        if (e.result === 'true' && e.data.arrItems.length > 0)
          setRecentAdd(e.data.arrItems);
        else setRecentAdd([]);
        console.log('e', e);
      },
    });
  };

  // const _getMoreRecentAdd = () => {
  //   const data = {
  //     mt_id: userInfo.mt_id,
  //     item_count: itemLimit.current,
  //     limit_count: 20,
  //   };
  //   console.log('data', data);
  //   mutateGetRecentAddress.mutate(data, {
  //     onSuccess: e => {
  //       if (e.result === 'true' && e.data.arrItems.length > 0)
  //         setRecentAdd(e.data.arrItems);
  //       else setRecentAdd([]);
  //       console.log('e', e);
  //     },
  //   });
  // };

  const _setAdd = data => {
    _setMainAddr(data);
    if (data.isRoad) {
      dispatch(
        setPostData({
          addrId: data.ad_id,
          addrMain: data.ad_addr1,
          addrSub: data.ad_addr2 + data.ad_addr3,
          zipCode: data.ad_zip,
        }),
      );
      dispatch(setCurrentAdd({ad_id: data.ad_id}));
    } else {
      dispatch(
        setPostData({
          addrId: data.ad_id,
          addrMain: data.ad_jibeon,
          addrSub: data.ad_addr2 + data.ad_addr3,
          zipCode: data.ad_zip,
        }),
      );
    }
  };

  const _setMainAddr = data => {
    const info = {
      mt_id: userInfo.mt_id,
      ad_id: data.ad_id,
      mt_app_token: userInfo.mt_app_token,
    };
    console.log('data _setMainAddr', info);

    mutateSetMainAddr.mutate(info, {
      onSuccess: e => {
        if (e.result === 'true')
          return customAlert('알림', '우리동네 등록이 완료되었습니다.');
        console.log('e', e);
      },
    });
  };

  const _deleteAddr = data => {
    const info = {
      mt_id: userInfo.mt_id,
      ad_id: data.ad_id,
    };

    mutateDeleteUserAddr.mutate(info, {
      onSuccess: e => {
        if (e.result === 'true') _getRecentAdd();
        // return customAlert('알림', '');
      },
    });
  };

  const renderItem = item => {
    const data = item.item;
    console.log('data', data);
    return (
      <>
        <Pressable
          onPress={() => {
            dispatch(setCurrentLocation({lat: data.ad_lat, lon: data.ad_lng}));
            if (currentAdd.ad_id !== data.ad_id) _setAdd(data);
          }}
          style={{
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor:
              currentAdd.ad_id === data.ad_id ? colors.mainBG3 : null,
            paddingHorizontal: 22,
          }}>
          <View style={{marginRight: 20}}>
            <Image
              source={require('~/assets/ico_location.png')}
              style={{width: 20, height: 20, tintColor: colors.primary}}
            />
          </View>
          <View
            style={{flex: 1, minHeight: 50, justifyContent: 'space-between'}}>
            <TextBold style={{fontSize: 13, color: colors.fontColor2}}>
              [{data.ad_zip}] {data.ad_addr1} {data.ad_addr2} {data.ad_addr3}
            </TextBold>
            <TextRegular style={{fontSize: 12, color: colors.fontColor2}}>
              [{data.ad_zip}] {data.ad_jibeon} {data.ad_addr2} {data.ad_addr3}
            </TextRegular>
          </View>
          {currentAdd?.ad_id !== data?.ad_id && (
            <Pressable hitSlop={10} onPress={() => _deleteAddr(data)}>
              <Image
                source={require('~/assets/pop_close.png')}
                style={{width: 20, height: 20}}
              />
            </Pressable>
          )}
        </Pressable>
      </>
    );
  };

  useEffect(() => {
    _getRecentAdd();
    return () => {};
  }, []);

  // if (mutateGetRecentAddress.isLoading) return <Loading />;

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'주소 설정'} navigation={navigation} />
      <View style={{paddingHorizontal: 22}}>
        <Pressable
          onPress={() => {
            navigation.navigate('AddressSearch', {
              fromAddress: true,
            });
          }}
          style={{
            ...styles.btnContainer,
            backgroundColor: colors.inputBoxBG,
          }}>
          <Image
            source={require('~/assets/ico_search.png')}
            style={{
              width: 20,
              height: 20,
              marginRight: 10,
              tintColor: colors.primary,
            }}
          />
          <TextRegular style={{fontSize: 14, color: colors.fontColor2}}>
            {addData ? addData : '주소를 직접 입력해주세요'}
          </TextRegular>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Map')}
          style={{
            ...styles.btnContainer,
            borderWidth: 1,
            borderColor: colors.borderColor,
            marginTop: 10,
          }}>
          <Image
            source={require('~/assets/ico_location.png')}
            style={{
              width: 20,
              height: 20,
              marginRight: 10,
              tintColor: colors.primary,
            }}
            resizeMode="contain"
          />
          <TextMedium style={{fontSize: 14, color: colors.fontColor2}}>
            현재위치로 설정하기
          </TextMedium>
        </Pressable>
      </View>
      <DividerL style={{marginTop: 20}} />
      <FlatList
        data={recentAdd}
        renderItem={item => renderItem(item)}
        ItemSeparatorComponent={() => <DividerL style={{height: 1}} />}
        keyExtractor={(item, index) => index}
        // ListHeaderComponentStyle={{
        //   paddingBottom: 20,
        //   borderBottomWidth: 1,
        //   borderColor: colors.borderColor,
        // }}
        // ListHeaderComponent={
        //   <TextMedium style={{color: colors.fontColor2, paddingHorizontal: 22}}>
        //     최근배송지
        //   </TextMedium>
        // }
        // ListEmptyComponent={
        //   <View style={{padding: 22, alignSelf: 'center'}}>
        //     <TextRegular></TextRegular>
        //   </View>
        // }
        // ListFooterComponent={<></>}
      />
    </SafeAreaView>
  );
};

export default AddressMain;

const styles = StyleSheet.create({
  btnContainer: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
});
