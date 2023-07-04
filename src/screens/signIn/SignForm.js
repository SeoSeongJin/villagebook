import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import Header from '../../component/Header';
import TextBold from '../../component/text/TextBold';
import colors from '../../styles/colors';
import TextRegular from '../../component/text/TextRegular';
import {Input} from '../../component/Input';
import {Button} from '../../component/Button';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useMutation} from 'react-query';
import authAPI from '../../api/modules/authAPI';
import {APP_TOKEN} from '@env';
import {Errorhandler} from '../../config/ErrorHandler';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useSelector} from 'react-redux';
import CertificationList from '../../config/CertificationList';
import {useEffect} from 'react';

const SignForm = ({navigation, route}) => {
  console.log('ROUTE', route.params);
  const {fcmToken} = useSelector(state => state.authReducer);
  const [fsImage, setFsImage] = useState();
  const [modal, setModal] = useState(false);
  const [modalPic, setModalPic] = useState(false);

  const mutateCheckId = useMutation(authAPI._checkId, {
    onSuccess: e => {
      if (e.result === 'false') {
        Errorhandler(e.msg);
      } else {
        console.log('e', e);
        if (!fm.values.mt_id.trim())
          Alert.alert('알림', `아이디를 입력해주세요.`);
        else if (e.result === 'true') fm.setFieldValue('mt_idChecked', true);
        Alert.alert('알림', `${e.msg}`);
      }
    },
  });

  const mutateCheckNickName = useMutation(authAPI._checkNickName, {
    onSuccess: e => {
      if (e.result === 'false') {
        Alert.alert('알림', `${e.msg}`);
      } else {
        if (!fm.values.mt_nickname.trim())
          Alert.alert('알림', `닉네임을 입력해주세요.`);
        else if (e.result === 'true') {
          fm.setFieldValue('mt_nickNameChecked', true);
        }
        Alert.alert('알림', `${e.msg}`);
      }
    },
  });

  // const mutateSendCode = useMutation(authAPI._sendCode, {
  //   onSuccess: e => {
  //     if (e.result === 'false') {
  //       Alert.alert('알림', `${e.msg}`);
  //     } else {
  //       Alert.alert(
  //         '알림',
  //         `인증번호가 발송 되었습니다.\n받은 번호를 입력 후 인증확인을 해주세요.`,
  //       );
  //       console.log('e', e);
  //       fm.setFieldValue('mt_certify_check', String(e.data.arrItems.certno));
  //     }
  //   },
  // });

  const mutateSignIn = useMutation(authAPI._submitForm, {
    onSettled: e => {
      if (e.result === 'true') {
        Alert.alert(
          '가입완료',
          '회원가입이 완료되었습니다.\n로그인 페이지로 이동합니다.',
          [{text: '확인', onPress: () => navigation.navigate('Login')}],
        );
      }
      console.log('mutateSignIn', e);
    },
    // onSuccess: e => {
    //   // Alert.alert('알림', `인증번호가 발송 되었습니다.`);
    // },
  });

  const fm = useFormik({
    initialValues: {
      mt_id: '',
      mt_pwd: '',
      mt_pwd_re: '',
      mt_hp: '',
      // mt_code: '', // 프론트에서 인증코드 확인용 // 이니시스 본인인증으로 변경
      mt_certify: '',
      // mt_certify_check: '',
      mt_nickname: '',
      mt_email: '',
      mt_level: '2',
      mt_image1: '', //이미지 관련 설정 필요
      mt_idChecked: false, //중복 체크 여부 확인 값 1
      mt_nickNameChecked: false, //중복 체크 여부 확인 값 2
    },
    validationSchema: yup.object({
      mt_id: yup.string().required('아이디를 입력해주세요.'),
      mt_pwd: yup.string().required('비밀번호를 입력해주세요.'),
      mt_pwd_re: yup
        .string()
        .required('비밀번호를 입력해주세요.')
        .oneOf([yup.ref('mt_pwd'), null], '비밀번호가 일치하지 않습니다.'),
      // mt_hp: yup
      //   .number('올바른 휴대폰 번호를 입력해주세요.')
      //   .integer('올바른 휴대폰 번호를 입력해주세요.')
      //   .required('휴대폰번호를 입력해주세요.'),
      mt_hp: yup.string().required('본인인증을 해주세요.'),
      // mt_code: yup
      //   .string()
      //   .required('인증번호를 입력해주세요.')
      //   .oneOf(
      //     [yup.ref('mt_certify_check'), null],
      //     '인증번호가 일치하지 않습니다.',
      //   ),
      mt_nickname: yup.string().required('닉네임을 입력해주세요.'),
      mt_email: yup
        .string()
        .email('올바른 형식의 이메일을 입력해주세요.')
        .required('이메일을 입력해주세요.'),
      mt_idChecked: yup.boolean().isTrue('아이디 중복확인을 해주세요.'),
      mt_nickNameChecked: yup.boolean().isTrue('닉네임 중복확인을 해주세요.'),
    }),
    onSubmit: info => handleSubmit(info),
  });

  useEffect(() => {
    const res = route.params?.res;
    if (res && res?.certified == true) {
      fm.setFieldValue('mt_hp', res.phone);
      fm.setFieldValue('mt_certify', 1);
    }
    console.log(':: RES CERTIFI', res);
  }, [route.params]);

  // console.log(fm.errors);
  const handleSubmit = e => {
    // console.log('summited', e);
    const data = {
      mt_id: e.mt_id,
      mt_pwd: e.mt_pwd,
      mt_pwd_re: e.mt_pwd_re,
      mt_name: e.mt_nickname,
      mt_nickname: e.mt_nickname,
      mt_hp: e.mt_hp,
      mt_certify: e.mt_certify,
      mt_email: e.mt_email,
      mt_level: e.mt_level,
      mt_image1: e.mt_image1,
      mb_login_type: 1,
      mt_app_token: fcmToken,
    };
    console.log('summit data', data);
    mutateSignIn.mutate(data);
  };

  const _checkId = () => {
    const data = {mt_id: fm.values.mt_id};
    if (fm.values.mt_id.trim()) mutateCheckId.mutate(data);
    else Alert.alert('알림', '아이디를 입력해주세요.');
  };
  const _checkNickName = () => {
    const data = {mt_nickname: fm.values.mt_nickname};
    if (fm.values.mt_nickname.trim()) mutateCheckNickName.mutate(data);
    else Alert.alert('알림', '닉네임을 입력해주세요.');
  };

  const _onPressCertification = () => {
    navigation.navigate('IamCertification', {target: CertificationList.isSign});
    // const data = {mt_hp: fm.values.mt_hp};
    // if (!data.mt_hp.trim() || fm.errors.mt_hp)
    //   Errorhandler('올바른 휴대폰 번호를 입력해주세요.');
    // else mutateSendCode.mutate(data);
  };

  // const _vaildateCode = () => {
  //   console.log('certify', fm.values.mt_certify_check);
  //   console.log('mt_code', fm.values.mt_code);

  //   if (
  //     fm.values.mt_certify_check &&
  //     fm.values.mt_code == fm.values.mt_certify_check
  //   ) {
  //     Alert.alert('휴대폰인증', '휴대폰인증이 완료되었습니다.');
  //     //인증 완료시 1
  //     fm.setFieldValue('mt_certify', '1');
  //   } else {
  //     Alert.alert('휴대폰인증', '인증번호가 일치하지 않습니다.');
  //     //인증 미완료시 0
  //     fm.setFieldValue('mt_certify', '0');
  //   }
  // };

  const _setProfileImage = () => {
    ImageCropPicker.openCamera({
      compressImageMaxHeight: 3000,
      compressImageMaxWidth: 2000,
      // cropping: true,
    }).then(image => {
      let temp = image.path.split('.');
      const convert = {
        uri: image.path,
        name: image.modificationDate + '.' + temp[temp.length - 1],
        type: image.mime,
      };
      console.log('convert', convert);
      console.log('image :', image);
      fm.setFieldValue('mt_image1', convert);
      setFsImage(image.path);
      setModalPic(!modalPic);
    });
  };

  const _setProfileImageFromLocal = () => {
    ImageCropPicker.openPicker({}).then(image => {
      let temp = image.path.split('.');
      const convert = {
        uri: image.path,
        name: image.modificationDate + '.' + temp[temp.length - 1],
        type: image.mime,
      };
      console.log('convert', convert);
      console.log('image :', image);
      fm.setFieldValue('mt_image1', convert);
      setFsImage(image.path);
      setModalPic(!modalPic);
    });
  };

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'동네북 회원가입'} navigation={navigation} />
      <ScrollView>
        <View style={{paddingHorizontal: 22}}>
          <TextBold>아이디</TextBold>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Input formik={fm} value={'mt_id'} flex={1} />
            <Button
              hitSlop={10}
              text={'중복확인'}
              onPress={() => {
                _checkId();
              }}
              isLoading={mutateCheckId.isLoading}
            />
          </View>

          {/* {console.log(fm.errors)} */}
          <View style={{marginTop: 20}}>
            <TextBold>비밀번호</TextBold>
            <Input
              formik={fm}
              marginTop={10}
              marginBottom={7}
              secureTextEntry
              value={'mt_pwd'}
            />
            <TextBold>비밀번호 재입력</TextBold>
            <Input
              formik={fm}
              value={'mt_pwd_re'}
              marginTop={7}
              secureTextEntry
            />
          </View>

          <View style={{marginTop: 20}}>
            <TextBold>휴대폰 인증</TextBold>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Input
                editable={false}
                value={'mt_hp'}
                formik={fm}
                flex={1}
                placeholder={'본인인증이 필요합니다.'}
                keyboardType={'numeric'}
              />
              <Button
                hitSlop={10}
                text={'본인인증'}
                onPress={() => _onPressCertification()}
                // isLoading={mutateSendCode.isLoading}
              />
            </View>
            {/* 인증번호 작성 */}
            {/* <View style={{flexDirection: 'row', marginTop: 7}}>
              <Input
                formik={fm}
                value={'mt_code'}
                flex={1}
                keyboardType={'numeric'}
                placeholder={'인증번호를 입력해주세요.'}
              />
              <Button
                hitSlop={10}
                borderWidth={1}
                text={'인증확인'}
                onPress={() => _vaildateCode()}
              />
            </View> */}
          </View>

          <View style={{marginTop: 20}}>
            <TextBold>닉네임</TextBold>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Input formik={fm} value={'mt_nickname'} flex={1} />
              <Button
                hitSlop={10}
                text={'중복확인'}
                isLoading={mutateCheckNickName.isLoading}
                onPress={() => {
                  _checkNickName();
                }}
              />
            </View>
          </View>

          <View style={{marginTop: 20}}>
            <TextBold>이메일</TextBold>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Input formik={fm} value={'mt_email'} flex={1} />
            </View>
          </View>

          <View style={{marginTop: 20}}>
            <TextBold>프로필사진</TextBold>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              {fsImage && (
                <Pressable
                  onPress={() => {
                    setModal(!modal);
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginRight: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={{uri: fsImage ? fsImage : null}}
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: colors.inputBoxBG,
                    }}
                  />
                </Pressable>
              )}

              <Pressable
                onPress={() => {
                  setModalPic(!modalPic);
                  // _setProfileImage();
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  backgroundColor: colors.inputBoxBG,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('~/assets/ico_plus.png')}
                  style={{width: 30, height: 30}}
                />
              </Pressable>
            </View>
          </View>

          <Button
            flex={1}
            marginTop={30}
            marginBottom={30}
            text={'가입완료'}
            onPress={() => {
              // if (fm.values.mt_idChecked && fm.values.mt_nickNameChecked)
              if (Object.keys(fm.errors).length === 0) fm.handleSubmit();
              else {
                Alert.alert('알림', fm.errors[Object.keys(fm.errors)[0]]);
                // if (fm.errors.mt_pwd_re)
                // Alert.alert('알림', fm.errors.mt_pwd_re);
              }
            }}
          />
        </View>
      </ScrollView>
      <Modal
        transparent
        visible={modal}
        onRequestClose={() => {
          setModal(!modal);
        }}>
        <ImageViewer
          imageUrls={[{url: fsImage}]}
          useNativeDriver
          renderHeader={() => (
            <Pressable
              hitSlop={20}
              onPress={() => {
                setModal(!modal);
              }}
              style={{alignItems: 'flex-end', margin: 20, zIndex: 300}}>
              <Image
                source={require('~/assets/pop_close.png')}
                style={{
                  top: 30,
                  zIndex: 100,
                  width: 30,
                  height: 30,
                  tintColor: 'white',
                  position: 'absolute',
                }}
              />
            </Pressable>
          )}
          loadingRender={() => (
            <ActivityIndicator size={'large'} color={colors.primary} />
          )}
        />
      </Modal>

      <Modal
        transparent
        visible={modalPic}
        onRequestClose={() => {
          setModalPic(!modalPic);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            paddingHorizontal: 22,
            flexDirection: 'column',
          }}>
          <Pressable
            hitSlop={20}
            onPress={() => {
              setModalPic(!modalPic);
            }}
            style={{
              alignSelf: 'flex-end',
              zIndex: 300,
            }}>
            <Image
              source={require('~/assets/pop_close.png')}
              style={{
                top: 50,
                width: 30,
                height: 30,
                tintColor: 'white',
              }}
            />
          </Pressable>
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <View
              style={{
                width: '100%',
                height: 70,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
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
                    elevation: 5,
                  },
                }),
              }}>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  onPress={() => _setProfileImage()}
                  style={{
                    flex: 1,
                    height: 70,
                    backgroundColor: colors.mainBG1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('~/assets/btn_add.png')}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: colors.fontColor2,
                      marginRight: 10,
                      marginLeft: 10,
                    }}
                    resizeMode="contain"
                  />
                  <TextBold
                    style={{
                      color: colors.fontColor2,
                      includeFontPadding: false,
                      flex: 1,
                    }}>
                    사진 촬영
                  </TextBold>
                </Pressable>

                <Pressable
                  onPress={() => _setProfileImageFromLocal()}
                  style={{
                    flex: 1,
                    height: 70,
                    backgroundColor: colors.mainBG2,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('~/assets/btn_add.png')}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: colors.fontColor2,
                      marginRight: 10,
                      marginLeft: 10,
                    }}
                    resizeMode="contain"
                  />
                  <TextBold
                    style={{
                      flex: 1,
                      color: colors.fontColor2,
                      includeFontPadding: false,
                    }}>
                    갤러리 가져오기
                  </TextBold>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SignForm;

const styles = StyleSheet.create({
  input: {
    height: 50,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
  },
});
