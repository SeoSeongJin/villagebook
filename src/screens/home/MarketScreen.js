import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {FlatList, Image, Text, View} from 'react-native';
import {StyleSheet} from 'react-native';
import {Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Shadow} from 'react-native-shadow-2';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import mainAPI from '../../api/modules/mainAPI';
import BottomBar from '../../component/BottomBar';
import Header from '../../component/Header';
import Loading from '../../component/Loading';
import MainBanner from '../../component/MainBanner';
import SearchBox from '../../component/mainScreen/SearchBox';
import TextEBold from '../../component/text/TextEBold';
import TextMedium from '../../component/text/TextMedium';
import BannerList from '../../config/BannerList';
import {Errorhandler} from '../../config/ErrorHandler';
import {_guestAlert} from '../../config/utils/modules';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {setIsLifeStyle} from '../../store/reducers/CategoryReducer';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyle';
import AutoHeightImage from 'react-native-auto-height-image';

const MarketScreen = ({navigation, route}) => {
  const selectedCategory = route.params?.selectedCategory;
  const [categoryData, setCategoryData] = useState();
  const [foodData, setFoodData] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [cateRoute, setCateRoute] = useState();

  const {mutateGetAddress} = useCustomMutation();
  const {userInfo, isGuest} = useSelector(state => state.authReducer);
  const [addr, setAddr] = useState();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const layout = useWindowDimensions();

  const mutateCategory = useMutation(mainAPI._getCategory, {
    onSuccess: e => {
      if (e.result === 'true') {
        let temp = e.data.arrItems;
        setCategoryData(temp);
      } else setCategoryData([]);
    },
  });

  const mutateFood = useMutation(mainAPI._getCategory, {
    onSuccess: e => {
      if (e.result === 'true') {
        let temp = e.data.arrItems;
        console.log('food data', temp);
        setFoodData(temp);
      }
    },
    onError: err => {
      Errorhandler(err);
    },
  });
  const mutateMarket = useMutation(mainAPI._getCategory, {
    onSuccess: e => {
      if (e.result === 'true') {
        let temp = e.data.arrItems;
        console.log('market temp', temp);
        setMarketData(temp);
      }
    },
    onError: err => {
      Errorhandler(err);
    },
  });

  const _getAddr = () => {
    const data = {
      mt_id: userInfo.mt_id,
    };

    mutateGetAddress.mutate(data, {
      onSuccess: e => {
        if (e.result === 'true') {
          let tempAddr =
            e.data.arrItems[0].ad_addr1 +
            ' ' +
            e.data.arrItems[0].ad_addr2 +
            e.data.arrItems[0].ad_addr3;
          setAddr(tempAddr);
        } else setAddr('주소설정');
        console.log('mutateGetAddress', e);
      },
    });
  };

  const _init = () => {
    const data = {
      ca_type: selectedCategory,
    };
    mutateCategory.mutate(data);
  };

  useEffect(() => {
    _init();
  }, [cateRoute]);

  useEffect(() => {
    if (isFocused) _getAddr();
  }, [isFocused]);

  const renderItem = item => {
    const caName = item.item.ca_name;
    return (
      <>
        <Pressable
          onPress={() => {
            if (item.item) {
              if (selectedCategory === 'lifestyle')
                dispatch(setIsLifeStyle(true));
              else dispatch(setIsLifeStyle(false));

              navigation.navigate('StoreList', {
                routeIdx: item.item.ca_name,
                category: selectedCategory,
                categoryData: categoryData,
              });

              // navigation.navigate('StoreList', {
              //   routeIdx: item.item.ca_name,
              //   category:
              //     caName === '동네북 오더'
              //       ? 'food'
              //       : caName === '순간이동 마켓'
              //       ? 'market'
              //       : selectedCategory,
              //   categoryData:
              //     caName === '동네북 오더'
              //       ? foodData
              //       : caName === '순간이동 마켓'
              //       ? marketData
              //       : categoryData,
              // });
            }
          }}
          style={{
            flex: 1,
            // justifyContent: 'space-between',
            alignItems: 'center',
            // marginHorizontal: 10,
          }}>
          <View style={{width: 80, alignItems: 'center'}}>
            <Image
              source={
                caName === '동네북 오더'
                  ? require('~/assets/food_icon.png')
                  : caName === '순간이동 마켓'
                  ? require('~/assets/market_icon.png')
                  : {uri: item.item.ca_img}
              }
              style={{width: 55, height: 55}}
              resizeMode="contain"
            />
            <TextMedium
              style={{
                textAlign: 'center',
                fontSize: 13,
              }}>
              {caName}
            </TextMedium>
          </View>
        </Pressable>
        {item.index === categoryData?.length - 1 &&
          categoryData?.length % 4 !== 0 && (
            <View style={{flex: 4 - (categoryData?.length % 4)}}></View>
          )}
      </>
    );
  };

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header
        title={''}
        navigation={navigation}
        showLogo={true}
        showNoti={true}
        showCart={true}
      />
      <View style={{paddingHorizontal: 14, marginBottom: 17}}>
        <Pressable
          onPress={() => {
            if (!isGuest && userInfo) {
              navigation.navigate('AddressMain');
            } else {
              _guestAlert(navigation);
            }
          }}
          style={{
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: 'white',
            marginBottom: 10,
          }}>
          <Image
            source={require('~/assets/ico_location.png')}
            style={{
              width: 19,
              height: 19,
              marginRight: 8,
              tintColor: colors.primary,
            }}
          />
          <View style={{marginLeft: 0, marginRight: 3}}>
            <TextEBold
              numberOfLines={1}
              style={{
                fontSize: 15,
                color: colors.fontColor2,
              }}>
              {addr}
            </TextEBold>
          </View>
          <Image
            source={require('~/assets/arrow.png')}
            style={{
              tintColor: colors.primary,
              width: 17,
              height: 17,
              // transform: [{rotate: '90deg'}],
            }}
            resizeMode={'contain'}
          />
        </Pressable>

        <SearchBox
          isSub={true}
          navigation={navigation}
          category={selectedCategory}
          // onPress={() =>
          //   navigation.navigate('SearchView', {
          //     isSub: true,
          //     category: selectedCategory,
          //   })
          // }
        />
        {/* 메인배너 */}
      </View>

      <FlatList
        data={categoryData}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => <Loading />}
        ListHeaderComponent={
          <View style={{}}>
            <MainBanner
              navigation={navigation}
              style={{
                marginBottom: 17,
              }}
              position={BannerList[`${selectedCategory}`]}
            />
            {/* <Shadow> */}
            {/* <Pressable
              onPress={() => {
                navigation.navigate('CouponBookMain', {data: categoryData});
              }}
              style={{
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Shadow distance={5} offset={[0, 1]} style={{borderRadius: 10}}>
                <AutoHeightImage
                  source={require('~/assets/coupon.png')}
                  width={layout.width - 28}
                />
              </Shadow>
            </Pressable> */}
            {/* </Shadow> */}
          </View>
        }
        renderItem={item => renderItem(item)}
        numColumns={4}
        contentContainerStyle={{
          paddingBottom: 70,
        }}
        columnWrapperStyle={{
          alignSelf: 'center',
          marginBottom: 10,
          paddingHorizontal: 14,
        }}
        keyExtractor={(item, index) => index}
      />
      <BottomBar navigation={navigation} />
    </SafeAreaView>
  );
};

export default MarketScreen;

const styles = StyleSheet.create({
  bookStyle: {
    flex: 1,
  },
});
