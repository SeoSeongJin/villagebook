import {View, Text, ScrollView, StatusBar, Platform} from 'react-native';
import React from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import NaverMapView from 'react-native-nmap';
import {Pressable} from 'react-native';
import colors from '../../styles/colors';
import {Image} from 'react-native';
import {useSelector} from 'react-redux';
import {useState} from 'react';
import {useEffect} from 'react';
import {FlatList} from 'react-native';
import TextRegular from '../../component/text/TextRegular';
import {Shadow} from 'react-native-shadow-2';
import TextSBold from '../../component/text/TextSBold';
import {useWindowDimensions} from 'react-native';
import {useRef} from 'react';
import {Marker} from 'react-native-nmap';
import {Align} from 'react-native-nmap';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import TextMedium from '../../component/text/TextMedium';
import TextBold from '../../component/text/TextBold';
import TextLight from '../../component/text/TextLight';
import {Modal} from 'react-native';
import {ActivityIndicator} from 'react-native';
import Header from '../../component/Header';
import CouponFilterView from './CouponFilterView';

const CouponBookMap = ({navigation}) => {
  const {currentLocation} = useSelector(state => state.locationReducer);
  const {couponbookData} = useSelector(state => state.couponReducer);
  const layout = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [center, setCenter] = useState();
  const [moveCenter, setMoveCenter] = useState();

  const [cpbList, setCpbList] = useState([]);
  const [slctdCpb, setSlctdCpd] = useState();

  const [storeCpnList, setStoreCpnList] = useState([]);

  // 선택된 카테고리 필터
  const [pickedFilter, setPickedFilter] = useState(
    couponbookData ? '전체' : undefined,
  );

  // 펼치기 토글
  const [isOpen, setIsOpen] = useState(false);

  // flat ref
  const flatRef = useRef(null);

  const {mutateGetCouponBookList, mttCpbListOwner} = useCustomMutation();

  const _getBookList = (lat, lon) => {
    setLoading(true);
    const data = {
      item_count: 0,
      // limit_count: 10,
      ca_code: pickedFilter !== '전체' ? pickedFilter : '',
      //ca_code:pickedFilter,
      ca_sort: '1',
      mb_lat: lat ? lat : currentLocation?.lat,
      mb_lng: lon ? lon : currentLocation?.lon,
    };
    console.log('## 필터', data);
    //console.log("필터 : "+pickedFilter)
    // return;
    mutateGetCouponBookList.mutate(data, {
      onSuccess: res => {
        //console.log('## res', res.data);
        if (res.data?.arrItems?.length > 0) {
          setCpbList(res.data.arrItems);
        }
      },
      onSettled: res => {
        setLoading(false);
        // setTimeout(() => {
        //   setLoading(false);
        // }, 1500);
      },
    });
  };

  const _getCpnOfStore = () => {
    const data = {
      item_count: '0',
      jumju_id: slctdCpb.cp_jumju_id,
      jumju_code: slctdCpb.cp_jumju_code,
    };
    //console.log('data', data, slctdCpb);
    mttCpbListOwner.mutate(data, {
      onSuccess: res => {
        console.log('res', res.data.arrItems);
        setStoreCpnList(res.data.arrItems);
      },
    });
  };

  useEffect(() => {
    if (slctdCpb) _getCpnOfStore();
  }, [slctdCpb]);

  // const _getLifeStoreList = () => {
  //   const data = {
  //     item_count: 0,
  //     limit_count: 30,
  //     mb_jumju_type: 'lifestyle',
  //     mb_lat: currentLocation?.lat ? currentLocation?.lat : '',
  //     mb_lng: currentLocation?.lon ? currentLocation?.lon : '',
  //     mb_ca_sort: '1',
  //   };

  //   console.log('_getLife data ::', data);

  //   mutateGetLifeStyle.mutate(data, {
  //     onSuccess: res => {
  //       console.log('res ::', res.data.arrItems);
  //       setStoreList(res.data.arrItems);
  //     },
  //   });
  // };

  useEffect(() => {
    _getBookList();
    // _getLifeStoreList();
  }, [pickedFilter]);

  useEffect(() => {
    console.log('couponbookData', couponbookData);
    if (currentLocation) {
      console.log('## USER LOCATION', currentLocation);

      setCenter({
        latitude: Number(currentLocation.lat),
        longitude: Number(currentLocation.lon),
        zoom: 13,
      });
    }
  }, []);

  const _sliceText = str => {
    let temp = str;
    // if (str.length > 6) {
    //   temp = temp.slice(0, 12);
    //   temp = temp.trim();
    //   temp = temp;
    // } else {
    temp = temp.slice(0, 7);
    temp = temp.trim();
    temp = temp;
    if (temp?.length >= 7) temp = temp + '...';
    // }
    return temp;
  };

  const renderItem = item => {
    let element = item.item;
    const elementIdx = item.index;
    return (
      <Pressable
        onPress={() => {
          if (element?.ca_code) setPickedFilter(element?.ca_code);
          else setPickedFilter('전체');
        }}
        hitSlop={5}
        style={{
          height: 25,
          backgroundColor:
            element.ca_code === pickedFilter || element.ca_name === pickedFilter
              ? colors.primary
              : 'white',
          borderWidth: 1,
          borderColor:
            element.ca_code === pickedFilter || element.ca_name === pickedFilter
              ? colors.primary
              : colors.fontColorA2,
          marginRight: 10,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 30,
          paddingHorizontal: 15,
        }}>
        <TextRegular
          style={{
            color:
              element.ca_code === pickedFilter ||
              element.ca_name === pickedFilter
                ? 'white'
                : colors.fontColor2,
          }}>
          {element?.ca_name}
        </TextRegular>
      </Pressable>
    );
  };

  const renderCpnItem = ele => {
    const item = ele.item;
    return (
      <Shadow
        distance={5}
        offset={[0, 2]}
        style={{width: '100%'}}
        containerStyle={{
          // position: 'absolute',
          zIndex: 100,
          width: '95%',
          alignSelf: 'center',
          // bottom: 0,
        }}>
        <Pressable
          onPress={() => {
            // console.log('slctdCpb,', item);
            navigation.navigate('CouponBookDetail', {...item});
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
              item?.store_logo
                ? {uri: item?.store_logo}
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
                {item?.store_name}
              </TextMedium>
              <TextLight
                style={{
                  color: colors.fontColorA,
                  fontSize: 11,
                  marginRight: 5,
                }}>
                {item?.cp_end_txt}
              </TextLight>
            </View>
            <TextBold
              style={{fontSize: 15, color: colors.fontColor2}}
              numberOfLines={2}>
              {item?.cp_subject}
            </TextBold>
            <TextMedium
              style={{fontSize: 11, color: colors.fontColorA2}}
              numberOfLines={1}>
              {item?.cp_memo}
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
          <View
            style={{
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('~/assets/down_coupon.png')}
              style={{width: 40, height: 40}}
              resizeMode="contain"
            />
            <TextLight style={{fontSize: 12}}>
              {item?.cp_coupon_download_txt}
            </TextLight>
          </View>
        </Pressable>
      </Shadow>
    );
  };

  const renderOpenItem = item => {
    const element = item.item;
    const elementIdx = item.index;
    // console.log('element', element);
    return (
      <Pressable
        hitSlop={3}
        onPress={() => {
          //   _onPressCate(element);
          if (element?.ca_code) setPickedFilter(element?.ca_code);
          else setPickedFilter('전체');
          setIsOpen(!isOpen);
          if (flatRef?.current) {
            flatRef.current.scrollToIndex({animated: true, index: elementIdx});
          }
          //   naviRef.current.navigate(element.ca_name);
          //   setInit(element.ca_name);
        }}
        style={{
          // flex: windo,
          width: layout.width / 4.6,
          height: 25,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 3,
          borderWidth: 1,
          borderColor:
            element.ca_code === pickedFilter || element.ca_name === pickedFilter
              ? colors.primary
              : colors.colorE3,
          backgroundColor:
            element.ca_code === pickedFilter || element.ca_name === pickedFilter
              ? colors.primary
              : 'white',
          borderRadius: 30,
          marginRight: 7,
        }}>
        <TextRegular
          style={{
            color:
              element.ca_code === pickedFilter ||
              element.ca_name === pickedFilter
                ? 'white'
                : colors.fontColor2,
            fontSize: 13,
          }}>
          {element.ca_name}
        </TextRegular>
      </Pressable>
    );
  };

  console.log(Platform.OS)
  //console.log(storeCpnList?.length)
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      edges={['left', 'right', 'top']}
      style={{...commonStyles.safeAreaStyle}}>
      <View style={{zIndex: 2000}}>
        <Header navigation={navigation} title="쿠폰북 지도" isSearch={false} />
      </View>

      <SafeAreaView
        style={{
          position: 'absolute',
          width: '100%',
          zIndex: 100,
          paddingTop: Platform.OS === 'ios' ? (insets.top + 15) : 70,
          backgroundColor: isOpen ? 'white' : undefined,
        }}
        edges={['top']}
      >
        <Pressable
          onPress={() => navigation.navigate('CouponBookSearch')}
          style={{
            flex: 1,
            height: 50,
            backgroundColor: 'white',
            borderWidth: 1.5,
            borderColor: colors.primary,
            borderRadius: 10,
            marginHorizontal: 14,
            justifyContent: 'center',
          }}>
          <Image
            source={require('~/assets/ico_search.png')}
            style={{
              tintColor: colors.primary,
              width: 22,
              height: 22,
              position: 'absolute',
              right: 10,
            }}
            resizeMode="contain"
          />
        </Pressable>

        <FlatList
          data={couponbookData ? couponbookData : []}
          ref={flatRef}
          horizontal
          hitSlop={5}
          showsHorizontalScrollIndicator={false}
          style={{marginLeft: 14, marginTop: 10, marginRight: 30}}
          renderItem={item => renderItem(item)}
          keyExtractor={item => item.ca_id}
        />
        <Pressable
          onPress={() => setIsOpen(!isOpen)}
          hitSlop={5}
          style={{
            bottom: 0,
            right: 4,
            width: 30,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
          }}>
          <Image
            source={require('~/assets/down_arrow.png')}
            style={{width: 24, height: 24}}
            resizeMode={'contain'}
          />
        </Pressable>
        {/* 펼칠시 나오는 뷰 */}
        {isOpen && (
          <SafeAreaView edges={['top']}>
          <FlatList
            data={couponbookData}
            keyExtractor={(item, index) => index}
            renderItem={item => renderOpenItem(item)}
            numColumns={4}
            style={{
              flex: 1,
              top: -25,
              position: 'absolute',
              backgroundColor: 'white',
              zIndex: 100,
              width: '100%',
            }}
            columnWrapperStyle={{
              flex: 1,
              marginBottom: 7,
              marginLeft: 14,
            }}
            ListFooterComponent={
              <Shadow distance={1} offset={[0, 1]} style={{width: '100%'}}>
                <Pressable
                  onPress={() => setIsOpen(!isOpen)}
                  style={{
                    backgroundColor: 'white',
                    width: '100%',
                    height: 45,
                    marginBottom: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: colors.borderColor,
                    flexDirection: 'row',
                  }}>
                  <TextSBold style={{color: colors.fontColor2, fontSize: 16}}>
                    접어두기
                  </TextSBold>
                  <Image
                    source={require('~/assets/down_arrow.png')}
                    style={{
                      width: 26,
                      height: 26,
                      transform: [{rotate: '180deg'}],
                    }}
                    resizeMode="contain"
                  />
                </Pressable>
              </Shadow>
            }
          />
          </SafeAreaView>
        )}
      </SafeAreaView>
      {storeCpnList?.length > 0 && (
        <SafeAreaView
          style={{position: 'absolute', bottom: 0, width: '100%', zIndex: 200}}
        >
          <Pressable
            hitSlop={5}
            onPress={() => {
              setStoreCpnList([]);
            }}
            style={{position: 'relative', zIndex: 2000, top: -0, right: 0}}>
            <Image
              source={require('~/assets/pop_close.png')}
              style={{
                width: 25,
                height: 25,
                marginLeft: 'auto',
                marginRight: 15,
                marginBottom: 10,
              }}
              resizeMode="contain"
            />
          </Pressable>
          <FlatList
            data={storeCpnList}
            renderItem={item => renderCpnItem(item)}
            keyExtractor={(item, index) => index}
            style={{
              zIndex: 200,
              maxHeight: 300,
            }}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      )}

      {storeCpnList?.length === 0 && (
        <SafeAreaView
          style={{
            position: 'absolute',
            zIndex: 100,
            bottom: 10,
            width: 100,
            right: 14,
          }}
          // edges={['']}
        >
        <Pressable
          onPress={() => {
            // if (moveCenter) _getBookList(moveCenter.lat, moveCenter.lon);
            navigation.navigate('CouponBookMain', {data: couponbookData});
          }}
          style={{
            position: 'absolute',
            width: 100,
            height: 40,
            backgroundColor: colors.primary,
            zIndex: 100,
            borderRadius: 40,
            alignSelf: 'center',
            bottom: 30,
            right: 14,
            elevation: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TextBold style={{color: 'white', fontSize: 16}}>리스트보기</TextBold>
        </Pressable>
        </SafeAreaView>
      )}

      <NaverMapView
        center={center}
        style={{width: '100%', height:  Platform.OS === 'ios' ? (layout.height - 100) : (layout.height - 55)}}
        zoomControl={false}
        scaleBar={false}
        showsMyLocationButton={true}
        scrollGesturesEnabled={true}
        zoomGesturesEnabled={true}
        tiltGesturesEnabled={false}
        rotateGesturesEnabled={false}
        stopGesturesEnabled={false}
        liteModeEnabled={false}
        onCameraChange={e => {
          // console.log('### onCameraChange', e);
          setMoveCenter({lat: e.latitude, lon: e.longitude});
          setCenter(undefined);
          setSlctdCpd(undefined);
        }}
        // useTextureView={true}
        onMapClick={e => {
          setSlctdCpd(undefined);
          setStoreCpnList([]);
        }}>
        {/* <Marker
          width={35}
          height={35}
          image={require('~/assets/my_location.png')}
          coordinate={{
            latitude: Number(currentLocation.lat),
            longitude: Number(currentLocation.lon),
          }}
        /> */}
        {/* {moveCenter && (
          <Marker
            coordinate={{
              latitude: Number(moveCenter.lat),
              longitude: Number(moveCenter.lon),
            }}></Marker>
        )} */}

        {cpbList.map(
          (item, index) =>
            item?.store_lat &&
            item?.store_lng && (
              // item.mb_lat &&
              // item.mb_lng &&
              <Marker
                key={item.cp_jumju_code + index}
                width={item?.store_name?.length < 7 ? 80 : 100}
                height={47}
                caption={{
                  text: _sliceText(item.store_name),
                  align: Align.Center,
                  textSize: 12,
                }}
                image={require('~/assets/map_tag.png')}
                coordinate={{
                  latitude: Number(
                    item.store_lat ? item.store_lat : currentLocation.lat,
                  ),
                  longitude: Number(
                    item.store_lng ? item.store_lng : currentLocation.lon,
                  ),
                }}
                onClick={() => {
                  console.log('onClick! :::', item);
                  setSlctdCpd(item);
                  setCenter({
                    latitude: Number(item.store_lat),
                    longitude: Number(item.store_lng),

                    zoom: 16,
                  });
                }}
              />
            ),
        )}
      </NaverMapView>

      <Modal
        transparent
        onRequestClose={() => setLoading(false)}
        visible={loading}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={'large'} color={colors.primary} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CouponBookMap;
