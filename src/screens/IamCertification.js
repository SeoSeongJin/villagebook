import {View, Text} from 'react-native';
import React from 'react';
import {Pressable} from 'react-native';
import IMP from 'iamport-react-native';
import Loading from '../component/Loading';
import {Errorhandler} from '../config/ErrorHandler';
import axios from 'axios';

import {IAM_API_KEY, IAM_SECRET} from '@env';
import CertificationList from '../config/CertificationList';
import EditConfig from './mypage/edit/EditConfig';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../styles/commonStyle';

const IamCertification = ({navigation, route}) => {
  // const _updatePhone = () => {
  //   if (res && res?.certified == true) {
  //     const data = {
  //       mt_id: userInfo.mt_id,
  //       mt_hp: phone,
  //       mt_auth: res?.certified ? true : false,
  //     };

  //     console.warn(data);

  //     mutateUpdatePhone.mutate(data, {
  //       onSettled: e => {
  //         console.log('e', e);

  //         if (e.result === 'true') {
  //           Alert.alert('알림', '휴대폰번호 수정이 완료되었습니다.', [
  //             {
  //               text: '확인',
  //               onPress: () => {
  //                 dispatch(
  //                   setUserInfo({
  //                     ...userInfo,
  //                     mt_hp: e.data.arrItems.mt_hp,
  //                   }),
  //                 );
  //                 // navigation.goBack();
  //               },
  //             },
  //           ]);
  //         } else {
  //           Alert.alert('알림', '현재 해당 기능을 사용 할 수 없습니다.', [
  //             {
  //               text: '확인',
  //               onPress: () => {
  //                 // navigation.goBack();
  //               },
  //             },
  //           ]);
  //         }
  //       },
  //     });
  //   } else {
  //     customAlert('알림', '본인인증이 필요합니다.', () => {});
  //   }
  // };

  const _router = res => {
    switch (route.params.target) {
      case CertificationList.isSign:
        return navigation.navigate('SignForm', {res: res});
      case CertificationList.isEdit:
        return navigation.navigate('EditSummit', {
          res: res,
          target: EditConfig.target.phone,
          addData: route.params?.addData,
        });
      case CertificationList.isOrder:
        return navigation.navigate('WriteOrderForm', {res: res});
      default:
        Errorhandler(res);
    }
  };

  const _getIamInfo = async res => {
    try {
      const {imp_uid, merchant_uid} = res;

      const getToken = await axios.post(
        'https://api.iamport.kr/users/getToken',
        {
          imp_key: IAM_API_KEY,
          imp_secret: IAM_SECRET,
        },
        {headers: {'Content-Type': 'application/json'}},
      );

      const {access_token} = getToken.data.response;
      console.log('getToken data', getToken.data);

      const getCertifications = await axios.get(
        `https://api.iamport.kr/certifications/${imp_uid}`,
        {
          headers: {Authorization: access_token},
        },
      );
      const certificationsInfo = getCertifications.data.response; // 조회한 인증 정보

      console.log('certificationsInfo', certificationsInfo);

      //회원가입시, 비밀번호 변경 시, 회원 가입 이후
      _router(certificationsInfo);
    } catch (e) {
      Errorhandler(e);
      console.error('Certification', e);
    }
  };

  const data = {
    merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
    company: '어스닉', // 회사명 또는 URL
    // carrier: 'SKT', // 통신사
    // name: '홍길동', // 이름
    // phone: '01012341234', // 전화번호
  };

  const _callback = res => {
    console.log('res', res);
    if (res.success === 'false') {
      _router(res);
    } else _getIamInfo(res);
    // navigation.navigate('OrderFinish', res);
  };

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <IMP.Certification
        userCode={'imp72538339'}
        loading={<Loading />} // 로딩 컴포넌트
        data={data}
        callback={_callback}
      />
    </SafeAreaView>
  );
};

export default IamCertification;
