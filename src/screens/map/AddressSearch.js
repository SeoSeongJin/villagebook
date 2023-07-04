import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import Postcode from '@actbase/react-daum-postcode';
import {useDispatch, useSelector} from 'react-redux';
import {setPostData} from '../../store/reducers/AddressReducer';
import axios from 'axios';

const AddressSearch = ({navigation, route}) => {
  const fromOrder = route.params?.fromWriteOrder;
  const fromAddress = route.params?.fromAddress;
  const dispatch = useDispatch();
  const {postData} = useSelector(state => state.addressReducer);

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Postcode
        style={{flex: 1}}
        jsOptions={{animation: true, showMoreHName: true}}
        onSelected={data => {
          console.log('post data', data);
          if (fromOrder) {
            navigation.navigate('WriteOrderForm', {addData: data});
          } else if (fromAddress) {
            dispatch(
              setPostData({
                ...postData,
                addrMain:
                  data.address ??
                  data.roadAddress ??
                  data.autoJibunAddress ??
                  data.jibunAddress,
                addrSub: '',
                zipCode: data.zonecode,
              }),
            );
            navigation.navigate('AddressSetDetail', {addData: data});
          } else {
            navigation.navigate('Map', {data: data});
          }
        }}
      />
    </SafeAreaView>
  );
};

export default AddressSearch;
