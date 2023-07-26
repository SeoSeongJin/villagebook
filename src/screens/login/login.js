import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,

  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import Input from '../../component/loginScreen/Input';
import TextMedium from '../../component/text/TextMedium';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyle';
import {_reqAPI} from '../../api/apiModule';
import loginConfig from './loginConfig';
import {useMutation} from 'react-query';
import authAPI from '../../api/modules/authAPI';
import Loading from '../../component/Loading';
import {useDispatch, useSelector} from 'react-redux';
import {setIsGuest, setUserInfo} from '../../store/reducers/AuthReducer';
import {useFormik} from 'formik';
import * as yup from 'yup';
import localStorageConfig from '../../store/localStorage/localStorageConfig';
import AuthStorageModuel from '../../store/localStorage/AuthStorageModuel';
import SNSLogin from './SNSLogin';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {Errorhandler} from '../../config/ErrorHandler';
import TextNotoR from '../../component/text/TextNotoR';
import AutoLogin from '../../component/loginScreen/AutoLogin';
import appleAuth from '@invertase/react-native-apple-authentication';
import jwtDecode from 'jwt-decode';
import UserAgent from 'react-native-user-agent';
import { createInstance, HackleProvider, useTrack } from "@hackler/react-native-sdk";

const Login = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [logading, setLoading] = useState(false);
  const {fcmToken, autoLogin} = useSelector(state => state.authReducer);
  const {mutateSNSlogin} = useCustomMutation();

  let screenTo = '';
  let jumju_id = '';
  let jumju_code = '';
  let eventType = '';

  if(route?.params) {
    screenTo = route?.params.screenTo;
    jumju_id = route?.params.jumju_id;
    jumju_code = route?.params.jumju_code;
    eventType = route?.params.eventType;
  }
  const isAuto = () => {
    return autoLogin
      ? localStorageConfig.state.true
      : localStorageConfig.state.false;
  };

  const track = useTrack();

  const mutate = useMutation(authAPI._login, {
    onSuccess: async e => {
      if (e.result === 'false') {
        Alert.alert(
          '로그인 실패',
          '아이디 혹은 비밀번호가 일치하지 않습니다.',
          [
            {
              text: '확인',
              onPress: () => {
                setLoading(false);
                navigation.reset({
                  routes: [{name: 'Login'}],
                });
              },
            },
          ],
        );
      } else {
        console.log('login e', e);
        await AuthStorageModuel._setItemAutoLogin(isAuto());
        await AuthStorageModuel._setItemUserToken(fcmToken);
        await AuthStorageModuel._setItemLoginType(
          localStorageConfig.loginType.local,
        );
        await AuthStorageModuel._setItemUserId(e.data.arrItems.mt_id);
        dispatch(setIsGuest(false));
        dispatch(setUserInfo(e.data.arrItems));

        // 이벤트를 속성과 함께 전송
        var today = new Date();
        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);
        var dateString = year + '-' + month + '-' + day;

        const event = {
          key: "log_in",
          properties: {
            mtId: e.data.arrItems.mt_id,
            date: dateString,
          }
        }

        track(event);

        if(screenTo != ''){
          navigation.reset({
            routes: [
              {name: screenTo, params: {jumju_id: jumju_id, jumju_code: jumju_code, eventType: eventType}},
            ],
          });
        }else {
          navigation.reset({
            routes: [
              {name: 'CategoryView', params: {selectedCategory: 'lifestyle'}},
            ],
          });
        }

        // navigation.reset({
        //   routes: [{name: 'Main'}],
        // });
      }
    },
  });

  const _login = async e => {
    const data = {
      mt_id: e.mt_id,
      mt_pwd: e.mt_pwd,
      mt_app_token: fcmToken,
      mt_visit_device: Platform.OS,
    };
    mutate.mutate(data);
  };

  const Divider = () => {
    return (
      <View
        style={{
          width: 1,
          height: 20,
          backgroundColor: colors.primary,
          marginHorizontal: 10,
        }}
      />
    );
  };

  const fm = useFormik({
    initialValues: {
      mt_id: '',
      mt_pwd: '',
    },
    validationSchema: yup.object({
      mt_id: yup.string().required('아이디를 입력해주세요.'),
      mt_pwd: yup.string().required('비밀번호를 입력해주세요.'),
    }),
    onSubmit: info => handleSubmit(info),
  });

  const handleSubmit = e => {
    setLoading(true);
    _login(e);
  };

  const _NaverLogin = async () => {
    const result = await SNSLogin._NaverLogin(fcmToken);
    const data = {
      mt_id: result.mt_id,
      mt_pwd: result.mt_pwd,
      mt_app_token: result.mt_app_token,
      mt_login_type: '2',
      mt_sns_url: result.mt_image1,
      mt_hp: result.mt_hp,
      mt_name: result.mt_name,
      mt_email: result.mt_email,
      mt_nickname: result.mt_nickname,
      mt_visit_device: Platform.OS,
    };

    // 로그인 하기
    console.log('_NaverLogin result', result);
    console.log('_NaverLogin data', data);

    mutateSNSlogin.mutate(data, {
      onSuccess: async e => {
        if (e.result === 'true') {
          try {
            console.log('login e', e);
            await AuthStorageModuel._setItemAutoLogin(isAuto());
            await AuthStorageModuel._setItemUserToken(fcmToken);
            await AuthStorageModuel._setItemLoginType(
              localStorageConfig.loginType.sns,
            );
            await AuthStorageModuel._setItemLoginTypeNum(
              localStorageConfig.loginTypeNum.naver,
            );
            await AuthStorageModuel._setItemUserId(e.data.arrItems.mt_id);
            dispatch(setIsGuest(false));
            dispatch(setUserInfo(e.data.arrItems));
            navigation.reset({
              routes: [
                {name: 'CategoryView', params: {selectedCategory: 'lifestyle'}},
              ],
            });
            // navigation.reset({
            //   routes: [{name: 'Main'}],
            // });
          } catch (err) {
            Errorhandler(err);
          }
        }
      },
    });
  };

  const _KakaoLogin = async () => {
    const result = await SNSLogin._KakaoLogin(fcmToken);
    const data = {
      mt_id: result.mt_id,
      mt_pwd: result.mt_pwd,
      mt_app_token: result.mt_app_token,
      mt_login_type: '3',
      mt_sns_url: result.mt_image1,
      mt_hp: result.mt_hp === 'null' || !result.mt_hp ? '' : result.mt_hp,
      mt_name: result.mt_name,
      mt_email: result.mt_email,
      mt_nickname: result.mt_nickname,
      mt_visit_device: Platform.OS,
    };

    console.log('_KakaoLogin result', result);
    console.log('_KakaoLogin data', data);

    mutateSNSlogin.mutate(data, {
      onSuccess: async e => {
        if (e.result === 'true') {
          try {
            console.log('login e', e);
            await AuthStorageModuel._setItemAutoLogin(isAuto());
            await AuthStorageModuel._setItemUserToken(fcmToken);
            await AuthStorageModuel._setItemLoginType(
              localStorageConfig.loginType.sns,
            );
            await AuthStorageModuel._setItemLoginTypeNum(
              localStorageConfig.loginTypeNum.kakao,
            );
            await AuthStorageModuel._setItemUserId(e.data.arrItems.mt_id);
            dispatch(setIsGuest(false));
            dispatch(setUserInfo(e.data.arrItems));
            navigation.reset({
              routes: [
                {name: 'CategoryView', params: {selectedCategory: 'lifestyle'}},
              ],
            });
            // navigation.reset({
            //   routes: [{name: 'Main'}],
            // });
          } catch (err) {
            Errorhandler(err);
          }
        }
      },
    });
  };

  const _AppleLogin = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    console.log('apple', appleAuthRequestResponse);
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    console.log('apple', appleAuthRequestResponse, credentialState);
    const decoded = jwtDecode(appleAuthRequestResponse.identityToken);
    console.log('decode', decoded);
    const nickname = decoded.email.split('@', 1);
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      let name =
        appleAuthRequestResponse.fullName.familyName +
        appleAuthRequestResponse.fullName.givenName;
      if (name) {
        console.log('name1', name);
      } else {
        console.log('name2', name);
      }
      const userInfo = {
        social_id: appleAuthRequestResponse.user,
        email: decoded.is_private_email === 'true' ? '' : decoded.email,
        nickname: nickname,
      };
      console.log('USERINFO APPLE', userInfo);
      const data = {
        mt_id: userInfo.social_id,
        // mt_pwd: result.mt_pwd,
        mt_app_token: fcmToken,
        mt_login_type: '5',
        // mt_sns_url: result.mt_image1,
        // mt_hp: result.mt_hp === 'null' || !result.mt_hp ? '' : result.mt_hp,
        mt_name: name,
        mt_email: userInfo.email,
        mt_nickname: name,
      };
      console.log('BEFORE SUMMIT :::', data);
      mutateSNSlogin.mutate(data, {
        onSuccess: async e => {
          if (e.result === 'true') {
            try {
              console.log('login e', e);
              await AuthStorageModuel._setItemAutoLogin(isAuto());
              await AuthStorageModuel._setItemUserToken(fcmToken);
              await AuthStorageModuel._setItemLoginType(
                localStorageConfig.loginType.sns,
              );
              await AuthStorageModuel._setItemLoginTypeNum(
                localStorageConfig.loginTypeNum.kakao,
              );
              await AuthStorageModuel._setItemUserId(e.data.arrItems.mt_id);
              dispatch(setIsGuest(false));
              dispatch(setUserInfo(e.data.arrItems));
              // navigation.reset({
              //   routes: [{name: 'Main'}],
              // });
              navigation.reset({
                routes: [
                  {
                    name: 'CategoryView',
                    params: {selectedCategory: 'lifestyle'},
                  },
                ],
              });
            } catch (err) {
              Errorhandler(err);
            }
          }
        },
      });
    }
  };

  const _guestLogin = () => {
    dispatch(setIsGuest(true));
    navigation.reset({
      routes: [{name: 'CategoryView', params: {selectedCategory: 'lifestyle'}}],
    });
    // navigation.navigate('CategoryView', {
    //   selectedCategory: 'lifestyle',
    // });
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
      return appleAuth.onCredentialRevoked(async () => {
        console.warn(
          'If this function executes, User Credentials have been Revoked',
        );
      });
    }
  }, []); // passing in an empty array as the second argument ensures this is only ran once when component mounts initially.

  if (logading) return <Loading />;
  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        <View style={{flex: 1, alignItems: 'center', marginTop: '17%'}}>
          <FastImage
            style={{
              width: 221,
              height: 54,
              marginBottom: 20,
            }}
            tintColor={colors.primary}
            source={require('../../assets/logo.png')}
            resizeMode={FastImage.resizeMode.contain}
          />
          <TextNotoR style={{fontSize: 15, color: colors.fontColor2}}>
            우리동네 모든 것을 담았다.
          </TextNotoR>
        </View>
        <View
          style={{
            alignItems: 'center',
            paddingHorizontal: 22,
            paddingTop: 33,
            marginTop: 40,
          }}>
          <Input fm={fm} />
          {/* <View style={{flexDirection:'row'}}>
            <Image source={require('~/assets/top_ic_map_off.png')}/>
          </View> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 63,
              width: '100%',
            }}>
            <AutoLogin />
            <Pressable
              hitSlop={5}
              // style={{marginBottom: 20}}
              onPress={() => _guestLogin()}>
              <TextNotoR>건너뛰기</TextNotoR>
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              if (Object.keys(fm.errors).length === 0) {
                fm.handleSubmit();
              } else {
                Alert.alert('알림', fm.errors[Object.keys(fm.errors)[0]]);
              }
            }}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 50,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 25,
            }}>
            <TextMedium style={{fontSize: 17, color: 'white'}}>
              로그인
            </TextMedium>
          </Pressable>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              marginBottom: Platform.OS === 'ios' ? 30 : 70,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Pressable
              onPress={() => {
                navigation.navigate('FindUserAccount', {
                  target: loginConfig.target.findId,
                });
              }}>
              <TextNotoR style={{fontSize: 14}}>아이디 찾기</TextNotoR>
            </Pressable>
            <Divider />
            <Pressable
              onPress={() => {
                navigation.navigate('FindUserAccount', {
                  target: loginConfig.target.findPW,
                });
              }}>
              <TextNotoR style={{fontSize: 14}}>비밀번호 찾기</TextNotoR>
            </Pressable>
            <Divider />
            <Pressable
              onPress={() => {
                navigation.navigate('CheckTerms');
              }}>
              <TextNotoR style={{fontSize: 14}}>회원가입</TextNotoR>
            </Pressable>
          </View>

          {/* {Platform.OS === 'ios' && ( */}
          {/* )} */}

          {/* <Pressable
            style={{
              width: '100%',
              height: 20,
              alignItems: 'center',
              marginBottom: 26,
            }}>
            <TextMedium
              style={{
                fontSize: 16,
                textAlign: 'center',
              }}>
              SNS 계정으로 로그인
            </TextMedium>
          </Pressable> */}
          <View
            style={{
              flexDirection: 'row',
            }}>
            {/* 네이버 */}
            <Pressable
              onPress={() => {
                _NaverLogin();
              }}
              style={{
                ...style.snsButton,
                marginRight: 18.5,
              }}>
              <Image
                source={require('../../assets/sns_naver.png')}
                style={{...style.snsImage}}
                resizeMode={'contain'}></Image>
            </Pressable>
            {/* 페이스북 */}
            {/* <Pressable
              onPress={() => {}}
              style={{
                ...style.snsButton,
              }}>
              <Image
                source={require('../../assets/sns_facebook.png')}
                style={{...style.snsImage}}
                resizeMode={'contain'}></Image>
            </Pressable> */}
            {/* 카카오 */}
            <Pressable
              onPress={() => {
                // customAlert('알림', '현재 준비중입니다.');
                _KakaoLogin();
              }}
              style={{
                ...style.snsButton,
                marginLeft: 18.5,
              }}>
              <Image
                source={require('../../assets/sns_kakao.png')}
                style={{...style.snsImage}}
                resizeMode={'contain'}></Image>
            </Pressable>

            {/* 애플 */}
            {Platform.OS === 'ios' && (
              <Pressable
                onPress={() => _AppleLogin()}
                style={{
                  ...style.snsButton,
                  marginLeft: 37,
                }}>
                <Image
                  source={require('../../assets/sns_apple.png')}
                  style={{...style.snsImage}}
                  resizeMode={'contain'}></Image>
              </Pressable>
            )}
            {/* 본인인증 테스트 버튼 */}
            {/* <Pressable
              onPress={() => navigation.navigate('IamCertification')}
              style={{
                ...style.snsButton,
                marginLeft: 37,
              }}>
              <Image
                source={require('../../assets/sns_apple.png')}
                style={{...style.snsImage}}
                resizeMode={'contain'}></Image>
            </Pressable> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const style = StyleSheet.create({
  snsButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  snsImage: {
    width: 60,
    height: 60,
  },
});
