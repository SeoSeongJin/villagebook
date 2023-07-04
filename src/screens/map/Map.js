import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  PermissionsAndroid,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
} from 'react-native';
import NaverMapView from 'react-native-nmap';
import {Marker} from 'react-native-nmap';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../component/Header';
import {View} from 'react-native';
import {TextInput} from 'react-native';
import commonStyles from '../../styles/commonStyle';
import colors from '../../styles/colors';
import TextBold from '../../component/text/TextBold';
import {useDispatch, useSelector} from 'react-redux';
import {setPostData} from '../../store/reducers/AddressReducer';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {customAlert} from '../../component/CustomAlert';

const Map = ({navigation, route}) => {
  const isStore = route.params?.isStore ?? false;
  const storeLat = Number(route.params?.lat);
  const storeLon = Number(route.params?.lng);
  const {userInfo} = useSelector(state => state.authReducer);
  const {postData} = useSelector(state => state.addressReducer);
  const dispatch = useDispatch();
  console.log('ROUTE DATA ::', route.params);
  const [position, setPosition] = useState({
    latitude: null,
    longitude: null,
  });
  const [mapInit, setMapInit] = useState(false);
  const [converted, setConverted] = useState();
  const [text, setText] = useState('');
  const layout = useWindowDimensions();
  const {mutateInsertMainAddr} = useCustomMutation();

  const requestPermissions = async callback => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }

    callback();
  };

  const _getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setPosition({latitude: latitude, longitude: longitude});
        setMapInit({latitude: latitude, longitude: longitude});
        // console.log('cur location', latitude, longitude);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const _setStorePosition = () => {
    setPosition({latitude: storeLat, longitude: storeLon});
    setMapInit({latitude: storeLat, longitude: storeLon});
  };

  const _convertCoor = ({lon, lat}) => {
    axios
      .get(
        `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lon},${lat}&sourcecrs=epsg:4326&orders=roadaddr&output=json`,
        {
          headers: {
            'X-NCP-APIGW-API-KEY-ID': 'cwl7xpywcu',
            'X-NCP-APIGW-API-KEY': 'UAFbbOu83NLBLVGsPnKXhnoYjBEYFXjDerel8Dhx',
          },
        },
      )
      .then(result => {
        console.log('Conversion ::', result);
        setConverted(result.data.results[0]);
      })
      .catch(err => console.error('Conversion Err ::', err));
  };

  useEffect(() => {
    if (isStore) {
      requestPermissions(_setStorePosition);
    } else {
      requestPermissions(_getCurrentLocation);
    }
  }, []);

  const _insertAddr = () => {
    // ? `${converted.region.area1.name} ${converted.region.area2.name} ${converted.land.name} ${converted.land.number1}`
    const addr =
      converted.region.area1.name +
      ' ' +
      converted.region.area2.name +
      ' ' +
      converted.land.name +
      ' ' +
      converted.land.number1 +
      (converted.land.number2 ? '-' + converted.land.number2 : '');
    const sido = converted.region.area1.name;
    const gugun = converted.region.area2.name ? converted.region.area2.name : '';
    const dong = converted.region.area3.name ? converted.region.area3.name : '';

    const data = {
      mt_id: userInfo.mt_id,
      mt_name: userInfo.mt_name,
      mt_hp: userInfo.mt_hp,
      ad_zip: converted.land.addition1.value,
      //도로명 주소 우선 없다면 지번 주소 입력
      ad_addr1: addr,
      ad_addr2: text,
      ad_addr3: '',
      ad_latitude: position.latitude,
      ad_longitude: position.longitude,
      ad_jibeon: addr,
      ad_sido:sido,
      ad_gugun:gugun,
      ad_dong:dong,
    };

    console.log('ADD data ::', data);

    mutateInsertMainAddr.mutate(data, {
      onSuccess: e => {
        if (e.result === 'true') {
          customAlert('알림', '우리동네 등록이 완료되었습니다.');
          navigation.navigate('CategoryView', {
            selectedCategory: 'lifestyle',
          });
          // navigation.navigate('Main');
          dispatch(
            setPostData({
              ...postData,
              addrMain: `${converted.region.area1.name} ${converted.region.area2.name} ${converted.land.name} ${converted.land.number1}`,
              addrSub: text,
            }),
          );
        } else {
          customAlert('알림', '우리동네 등록을 실패하였습니다.');
        }
        console.log('e', e);
      },
    });
  };

  if (!mapInit) return <ActivityIndicator style={{flex: 1}} />;

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header
        title={!isStore ? '주소 설정' : '가게 위치'}
        navigation={navigation}
      />
      <View
        style={{
          flex: 1,
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          top: layout.height / 2 + 4,
          zIndex: 100,
          // opacity: 0.5,
        }}>
        {!isStore && (
          <Image
            source={require('~/assets/ico_location.png')}
            style={{
              width: 50,
              height: 50,
              zIndex: 100,
              tintColor: colors.primary,
            }}
            resizeMode="contain"
          />
        )}
      </View>
      <NaverMapView
        animateToCoordinates={e => console.log('e:::::::', e)}
        style={{width: '100%', height: layout.height}}
        zoomControl={false}
        scaleBar={false}
        showsMyLocationButton={true}
        center={{...mapInit, zoom: 16}}
        scrollGesturesEnabled={true}
        zoomGesturesEnabled={true}
        tiltGesturesEnabled={false}
        rotateGesturesEnabled={true}
        stopGesturesEnabled={false}
        liteModeEnabled={false}
        onCameraChange={e => {
          if (!isStore) {
            setPosition({latitude: e.latitude, longitude: e.longitude});
            _convertCoor({lon: e.longitude, lat: e.latitude});
          }
          console.log('e', e);
        }}
        onMapClick={e => {
          setPosition({latitude: e.latitude, longitude: e.longitude});
          _convertCoor({lon: e.longitude, lat: e.latitude});
          setPosition({latitude: e.latitude, longitude: e.longitude});
        }}>
        {/* <Marker
          animateToCoordinate={e => {
            console.log('anime', e);
          }}
          coordinate={position}
          onClick={() => console.log('onClick! p0')}
        /> */}
      </NaverMapView>
      {!isStore && (
        <>
          <View
            style={{
              width: '100%',
              height: 130,
              zIndex: 100,
              backgroundColor: 'white',
              padding: 22,
              position: 'absolute',
              bottom: 0,
              ...Platform.select({
                ios: {
                  shadowColor: '#00000029',
                  shadowOpacity: 0.6,
                  shadowRadius: 50 / 2,
                  shadowOffset: {
                    height: 12,
                    width: 0,
                  },
                },
                android: {
                  elevation: 10,
                },
              }),
            }}>
            <Text style={{fontSize: 15}}>
              {console.log('converted', converted)}
              {converted
                ? `${converted.region.area1.name} ${
                    converted.region.area2.name
                  } ${converted.land.name} ${converted.land.number1}${
                    converted.land.number2 ? '-' + converted.land.number2 : ''
                  }`
                : '현재 위치의 주소를 찾을 수 없습니다. 지도를 이동시켜 보세요'}
            </Text>
            <View style={{flexDirection: 'row', marginVertical: 10}}>
              <TextInput
                value={text}
                onChangeText={setText}
                autoCapitalize={'none'}
                placeholder={'상세주소 입력'}
                style={{
                  flex: 1,
                  marginRight: 10,
                  backgroundColor: colors.inputBoxBG,
                  height: 50,
                  borderRadius: 10,
                  padding: 10,
                }}></TextInput>
              <Pressable
                onPress={() => {
                  if (converted) {
                    _insertAddr();
                  } else {
                    customAlert('알림', '올바른 주소를 설정해주세요');
                  }
                }}
                style={{
                  width: 80,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TextBold style={{color: 'white', fontSize: 17}}>저장</TextBold>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Map;
