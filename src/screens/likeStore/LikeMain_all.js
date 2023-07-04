import {View, Text, Pressable, StyleSheet, FlatList, Image} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import BottomBar from '../../component/BottomBar';
import Header from '../../component/Header';
import colors from '../../styles/colors';
import LikeItems from '../../component/likeStoreScreen/LikeItems';
import {encode} from 'jwt-simple';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {useSelector} from 'react-redux';
import Loading from '../../component/Loading';
import RenderItem from '../../component/likeStoreScreen/RenderItem';
import TextBold from '../../component/text/TextBold';
import FastImage from 'react-native-fast-image';
import TextMedium from '../../component/text/TextMedium';
import {customAlert} from '../../component/CustomAlert';
import {useDispatch} from 'react-redux';
import {setIsLifeStyle} from '../../store/reducers/CategoryReducer';

const LikeMain = ({navigation}) => {
  const [tabIdx, setTabIdx] = useState(0);
  const {mutateGetLikeList, mutateSetLikeStore, mutateLikeLifeStyle} =
    useCustomMutation();
  const {userInfo} = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const limit = 20;
  const itemLimit = useRef(0);

  const _getList = (type, more) => {
    if (more) {
      itemLimit.current += limit;
    }
    const data = {
      item_count: itemLimit.current,
      limit_count: limit,
      mt_id: userInfo.mt_id,
      jumju_type: type,
    };
    console.log('data', data);
    mutateGetLikeList.mutate(data, {
      onSuccess: e => {
        if (more) {
          if (e.result === 'true') {
            let temp = e.data.arrItems;
            setList(prev => prev.concat(temp));
            console.log('Merged Arr', temp);
          }
        } else {
          if (e.result === 'true') {
            setList(e.data.arrItems);
          } else {
            setList([]);
          }
        }
      },
    });
  };

  const _getLifeList = more => {
    if (more) {
      itemLimit.current += limit;
    }
    const data = {
      item_count: itemLimit.current,
      limit_count: 9,
      mt_id: userInfo.mt_id,
      jumju_type: 'lifestyle',
    };

    mutateLikeLifeStyle.mutate(data, {
      onSuccess: e => {
        if (more) {
          if (e.result === 'true') {
            let temp = e.data.arrItems;
            setList(prev => prev.concat(temp));
            console.log('Merged Arr', temp);
          }
        } else {
          if (e.result === 'true') {
            setList(e.data.arrItems);
          } else {
            setList([]);
          }
        }
      },
    });
  };

  const _setLikeStore = item => {
    const data = {
      mt_id: userInfo.mt_id,
      jumju_id: item.item.jumju_id,
      jumju_code: item.item.jumju_code,
    };
    console.log('data', data);
    console.log('list', list);
    mutateSetLikeStore.mutate(data, {
      onSuccess: e => {
        let temp = [...list];
        temp = temp.filter(item2 => item2.jumju_code !== item.item.jumju_code);
        setList(temp);
      },
    });
  };
  const _getCategory = () => {
    switch (tabIdx) {
      case 0:
        return 'food';
      case 1:
        return 'market';
      case 2:
        return 'lifestyle';
      default:
        return;
    }
  };

  useEffect(() => {
    _getList('food');
  }, []);

  if (!list) {
    return <Loading />;
  }

  const RenderItem = ({item}) => {
    const data = item.item;
    console.log('item', item);
    return (
      <View
        key={item.index}
        style={{
          flex: 1,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          paddingVertical: 12,
          borderBottomColor: colors.borderColor,
          // marginBottom: 10,
          borderRadius: 12,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Pressable
            style={{flexDirection: 'row', flex: 1}}
            onPress={() => {
              navigation.navigate(
                tabIdx !== 2 ? 'MenuDetail2' : 'LifeStyleStoreInfo',
                {
                  jumju_id: data.jumju_id,
                  jumju_code: data.jumju_code,
                  mb_company: data.mb_company,
                  category: _getCategory(),
                },
              );
            }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderWidth: 1,
                borderRadius: 10,
                marginRight: 15,
                borderColor: colors.borderColor,
                overflow: 'hidden',
              }}>
              <FastImage
                source={
                  data.store_logo
                    ? {uri: data.store_logo}
                    : require('~/assets/no_img.png')
                }
                resizeMode={FastImage.resizeMode.cover}
                style={{flex: 1}}
              />
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <TextMedium style={{fontSize: 17, color: colors.fontColor2}}>
                {data.mb_company}
              </TextMedium>
              {tabIdx !== 2 ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('~/assets/ico_star_on.png')}
                      style={{width: 15, height: 15}}
                    />
                    <TextMedium
                      style={{fontSize: 14, color: colors.fontColor8}}>
                      {data.stars}
                    </TextMedium>
                  </View>
                  <TextMedium style={{fontSize: 14, color: colors.fontColor8}}>
                    {'최소주문 ' + data.minPrice}
                  </TextMedium>
                  <TextMedium style={{fontSize: 14, color: colors.fontColor8}}>
                    {'배달팁' + data.tipFrom + '~' + data.tipTo + '원'}
                  </TextMedium>
                </>
              ) : (
                <></>
              )}
            </View>
            <Pressable
              hitSlop={10}
              onPress={() => {
                customAlert(
                  '찜 삭제',
                  '단골찜에서 삭제하시겠습니까?',
                  () => {},
                  '확인',
                  () => {
                    _setLikeStore(item);
                  },
                  '취소',
                  () => {},
                );
              }}
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={require('~/assets/top_heart_on.png')}
                style={{width: 30, height: 30}}
              />
            </Pressable>
          </Pressable>
        </View>
      </View>
    );
  };

  // const LikeItems = ({data, navigation}) => {
  //   return (
  //     <View style={{flex: 1}}>
  //       <FlatList
  //         ListHeaderComponent={
  //           <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}></View>
  //         }
  //         data={data}
  //         ListEmptyComponent={
  //           <View
  //             style={{
  //               alignItems: 'center',
  //               justifyContent: 'center',
  //               marginVertical: 25,
  //             }}>
  //             <TextBold>찜내역이 없습니다.</TextBold>
  //           </View>
  //         }
  //         showsVerticalScrollIndicator={false}
  //         renderItem={item => <RenderItem item={item} />}
  //         keyExtractor={(item, index) => index}
  //         onEndReached={() => {
  //           let type = tabIdx === 0 ? 'food' : 'market';
  //           if (list.length > 4) _getList(type, true);
  //         }}
  //       />
  //     </View>
  //   );
  // };

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'단골찜'} navigation={navigation} showCart={true} />
      <View
        style={{
          ...styles.tabContainer,
        }}>
        <Pressable
          style={{
            ...styles.tabItemContainer,
          }}
          onPress={() => {
            itemLimit.current = 0;
            dispatch(setIsLifeStyle(false));
            setTabIdx(0);
            _getList('food');
          }}>
          <View
            style={{
              borderBottomWidth: tabIdx === 0 ? 2 : 0,
              ...styles.tabItem,
            }}>
            <TextBold
              style={{
                fontSize: 16,
                color: tabIdx === 0 ? colors.fontColor2 : colors.fontColorA2,
              }}>
              맛집
            </TextBold>
          </View>
        </Pressable>
        <Pressable
          style={{
            ...styles.tabItemContainer,
          }}
          onPress={() => {
            itemLimit.current = 0;
            dispatch(setIsLifeStyle(false));
            setTabIdx(1);
            _getList('market');
          }}>
          <View
            style={{
              borderBottomWidth: tabIdx === 1 ? 2 : 0,
              ...styles.tabItem,
            }}>
            <TextBold
              style={{
                fontSize: 16,
                color: tabIdx === 1 ? colors.fontColor2 : colors.fontColorA2,
              }}>
              마켓
            </TextBold>
          </View>
        </Pressable>
        <Pressable
          style={{
            ...styles.tabItemContainer,
          }}
          onPress={() => {
            itemLimit.current = 0;
            dispatch(setIsLifeStyle(true));
            setTabIdx(2);
            _getLifeList();
          }}>
          <View
            style={{
              borderBottomWidth: tabIdx === 2 ? 2 : 0,
              ...styles.tabItem,
            }}>
            <TextBold
              style={{
                fontSize: 16,
                color: tabIdx === 2 ? colors.fontColor2 : colors.fontColorA2,
              }}>
              동네정보
            </TextBold>
          </View>
        </Pressable>
      </View>

      <View style={{flex: 1, paddingHorizontal: 22}}>
        <View style={{flex: 1}}>
          <FlatList
            ListHeaderComponent={
              <View style={{flexDirection: 'row', alignSelf: 'flex-end'}} />
            }
            data={list}
            ListEmptyComponent={
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 25,
                }}>
                <TextBold>찜내역이 없습니다.</TextBold>
              </View>
            }
            showsVerticalScrollIndicator={false}
            renderItem={item => <RenderItem item={item} />}
            keyExtractor={(item, index) => index}
            onEndReached={() => {
              let type =
                tabIdx === 0 ? 'food' : tabIdx === 1 ? 'market' : 'lifestyle';
              if (list.length % limit === 0) {
                _getList(type, true);
              }
            }}
          />
        </View>
      </View>
      {/* {tabIdx === 1 && (
        <View style={{flex: 1, paddingHorizontal: 22}}>
          <LikeItems navigation={navigation} data={list}></LikeItems>
        </View>
      )}
      {tabIdx === 2 && (
        <View style={{flex: 1, paddingHorizontal: 22}}>
          <LikeItems navigation={navigation} data={list}></LikeItems>
        </View>
      )} */}
      {/* <BottomBar navigation={navigation} /> */}
    </SafeAreaView>
  );
};

export default LikeMain;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    height: 40,
    marginTop: 13,
  },
  tabItemContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    borderBottomColor: colors.borderColor22,
    width: 70,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
  },
});
