import {View, Text, Pressable, TextInput} from 'react-native';
import React, {useState} from 'react';
import colors from '../../styles/colors';
import TextBold from '../../component/text/TextBold';
import TextRegular from '../../component/text/TextRegular';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import Header from '../../component/Header';
import {useDispatch, useSelector} from 'react-redux';
import {setPostData} from '../../store/reducers/AddressReducer';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {customAlert} from '../../component/CustomAlert';
import {useEffect} from 'react';
import axios from 'axios';
import {Modal} from 'react-native';
import {setCurrentLocation} from '../../store/reducers/LocationRecuder';

const AddressSetDetail = ({navigation, route}) => {
  const addrData = route.params?.addData;
  const [text, setText] = useState('');
  const {postData} = useSelector(state => state.addressReducer);
  const {mutateInsertMainAddr} = useCustomMutation();
  const {userInfo} = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  const [userCoor, setUserCoor] = useState();
  const [loading, setLoading] = useState(false);

  console.log('addrData', addrData);

  const _geocoding = async addStr => {
    console.log('geo coding');
    await axios
      .get(
        `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${addStr}`,
        {
          headers: {
            'X-NCP-APIGW-API-KEY-ID': 'cwl7xpywcu',
            'X-NCP-APIGW-API-KEY': 'UAFbbOu83NLBLVGsPnKXhnoYjBEYFXjDerel8Dhx',
          },
        },
      )
      .then(res => {
        console.log('data data', res.data.addresses[0]);
        if (res?.data?.addresses[0]) {
          setUserCoor(res.data.addresses[0]);
        }
      })
      .catch(err => console.log('err err', err))
      .finally(() => {});
    // return res;
  };

  useEffect(() => {
    _geocoding(addrData.address);
  }, []);

  const _insertAddr = () => {
    const data = {
      mt_id: userInfo.mt_id,
      mt_name: userInfo.mt_name,
      mt_hp: userInfo.mt_hp,
      ad_zip: addrData.zonecode,
      //도로명 주소 우선 없다면 지번 주소 입력
      ad_addr1:
        addrData.address ??
        addrData.roadAddress ??
        addrData.autoJibunAddress ??
        addrData.jibunAddress,
      ad_addr2: text,
      ad_addr3: '',
      ad_latitude: userCoor.y,
      ad_longitude: userCoor.x,
      ad_jibeon: addrData.jibunAddress
        ? addrData.jibunAddress + ' ' + text
        : addrData.autoJibunAddress + ' ' + text,
    };
    console.log('ADD data :::', data);
    // return;
    mutateInsertMainAddr.mutate(data, {
      onSuccess: e => {
        if (e.result === 'true') {
          customAlert('알림', '우리동네 등록이 완료되었습니다.');
          dispatch(setCurrentLocation({lat: userCoor.y, lon: userCoor.x}));

          navigation.navigate('CategoryView', {
            selectedCategory: 'lifestyle',
          });
          // navigation.navigate('Main');
        } else {
          customAlert('알림', '우리동네 등록을 실패하였습니다.');
        }
        console.log('e', e);
      },
    });
  };

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'상세 주소 입력'} navigation={navigation} />
      <View style={{paddingHorizontal: 22}}>
        <TextBold>상세 주소 입력</TextBold>
        <View style={{marginVertical: 10, marginBottom: 40}}>
          <View style={{marginBottom: 10}}>
            <TextRegular>{postData.addrMain}</TextRegular>
          </View>
          <TextInput
            value={text}
            onChangeText={setText}
            style={{
              height: 50,
              backgroundColor: colors.inputBoxBG,
              borderRadius: 10,
              paddingHorizontal: 10,
            }}
            placeholder={'상세 주소를 입력해주세요'}></TextInput>
        </View>
        <Pressable
          onPress={() => {
            dispatch(setPostData({...postData, addrSub: text}));
            _insertAddr();
          }}
          style={{
            width: '100%',
            height: 50,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
          }}>
          <TextBold style={{color: 'white'}}>설정완료</TextBold>
        </Pressable>
      </View>
      {/* <Modal
        transparent
        statusBarTranslucent={true}
        onRequestClose={() => {
          // setModal(!modal);
        }}
        visible={loading}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      </Modal> */}
    </SafeAreaView>
  );
};

export default AddressSetDetail;
