import {
  getProfile as getKakaoProfile,
  login as KakaoLogin,
} from '@react-native-seoul/kakao-login';
import {getProfile, NaverLogin} from '@react-native-seoul/naver-login';
import {kConsumerKey, kConsumerSecret} from '@env';
import {useSelector} from 'react-redux';
import {customAlert} from '../../component/CustomAlert';
import {Platform} from 'react-native';

export default {
  _KakaoLogin: async fcmToken => {
    try {
      await KakaoLogin();
      const profile = await getKakaoProfile();
      // const userInfo = {
      //   social_id: profile.id,
      //   email: profile.email,
      //   nickname: profile.nickname,
      // };
      const data = {
        mt_id: profile.id,
        mt_pwd: '',
        mt_pwd_re: '',
        mt_name: profile.nickname,
        mt_nickname: profile.nickname,
        mt_hp: profile?.phoneNumber.replace(/-/gi, ''),
        mt_certify: 1,
        mt_email: profile.email,
        mt_level: 2,
        mt_image1: profile.thumbnailImageUrl,
        mb_login_type: 3,
        mt_app_token: fcmToken,
        mt_visit_device: Platform.OS,
      };
      if (data.mt_hp !== 'null') data.mt_hp = data.mt_hp.replace('+82 ', '0');

      console.log('kakao ###', profile);
      return data;
      //   handleSNSLogin('3', userInfo);
    } catch (error) {
      // customAlert('알림', '카카오 로그인이 취소되었습니다.');
      console.error(error);
      console.log('카카오 로그인이 취소되었습니다.');
    }
  },

  _NaverLogin: async fcmToken => {
    const iosKeys = {
      kConsumerKey: 'nGK2ISNXozWaxAXbBTIs',
      kConsumerSecret: 'FaR9Tjtk1V',
      kServiceAppName: '동네북',
      kServiceAppUrlScheme: 'dongnaebook', // only for iOS
    };

    const androidKeys = {
      kConsumerKey,
      kConsumerSecret,
      kServiceAppName: '동네북',
    };

    const initials = Platform.OS === 'ios' ? iosKeys : androidKeys;

    const handleGetUserProfile = async props => {
      const profileResult = await getProfile(props);
      if (profileResult.resultcode === '024') {
        Alert.alert('로그인 실패', profileResult.message);
        return;
      } else {
        console.log('profileResult', profileResult);
        const profileData = profileResult.response;
        const data = {
          mt_id: profileData.id,
          mt_pwd: '',
          mt_pwd_re: '',
          mt_name: profileData.nickname,
          mt_nickname: profileData.nickname,
          mt_hp: profileData.mobile.replace(/-/gi, ''),
          mt_certify: 1,
          mt_email: profileData.email,
          mt_level: 2,
          mt_image1: profileData.profile_image,
          mb_login_type: 2,
          mt_app_token: fcmToken,
          mt_visit_device: Platform.OS,
        };
        console.log('summit data', data);
        return data;
        // handleSNSLogin('2', userInfo);
      }
    };

    const handleNaverLogin = () => {
      // console.log('props', initials);
      return new Promise((resolve, reject) => {
        NaverLogin.login(initials, (err, token) => {
          console.log('Token is fetched  ::', token);
          let temp;
          if (token) {
            temp = handleGetUserProfile(token.accessToken);
          }

          if (err) {
            console.log('Error', err);
            reject(err);
            return;
          }
          resolve(temp);
        });
      });
    };

    const result = await handleNaverLogin();
    return result;
  },
};
