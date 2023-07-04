import {
  View,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../component/Header';
import colors from '../../../styles/colors';
import TextRegular from '../../../component/text/TextRegular';
import TextBold from '../../../component/text/TextBold';
import EditConfig from './EditConfig';
import TextMedium from '../../../component/text/TextMedium';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../../styles/commonStyle';
import {customAlert} from '../../../component/CustomAlert';
import Loading from '../../../component/Loading';
import {useDispatch, useSelector} from 'react-redux';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useCustomMutation} from '../../../hooks/useCustomMutation';
import {setUserInfo} from '../../../store/reducers/AuthReducer';
import CertificationList from '../../../config/CertificationList';

const EditSummit = ({navigation, route}) => {
  const target = route.params?.target;
  const dispatch = useDispatch();

  const {mutateCheckNickName, mutateUpdateUserInfo, mutateUpdatePhone} =
    useCustomMutation();

  const [delay, setDelay] = useState(false);
  const [sendedTime, setSendedTime] = useState('');

  const {userInfo} = useSelector(state => state.authReducer);

  const [nickname, setNickname] = useState('');
  const [checkNickname, setCheckNickname] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [profileImg, setProfileImg] = useState();

  const [modal, setModal] = useState(false);
  const [modalPic, setModalPic] = useState(false);

  const _checkNickname = () => {
    const data = {
      mt_nickname: nickname,
    };

    mutateCheckNickName.mutate(data, {
      onSettled: e => {
        console.log('e', e);
        if (e.result === 'true') {
          setCheckNickname(true);
          return customAlert('알림', '사용가능한 닉네임입니다.');
        } else {
          setCheckNickname(false);
          return customAlert('알림', '닉네임 중복으로 사용 불가능합니다.');
        }
      },
    });
  };

  const _updateInfo = isEmail => {
    const data = {
      mt_id: userInfo.mt_id,
      mt_nick: nickname ?? userInfo.mt_nickname,
      mt_image1: profileImg ?? '',
      mt_email: email ?? userInfo.mt_email,
    };

    console.log('data', data);

    if (!checkNickname && !isEmail)
      return customAlert('알림', '닉네임 중복 체크가 필요합니다.');

    mutateUpdateUserInfo.mutate(data, {
      onSettled: e => {
        if (e.result === 'true') {
          Alert.alert('알림', '회원정보 수정이 완료되었습니다.', [
            {
              text: '확인',
              onPress: () => {
                dispatch(
                  setUserInfo({
                    ...userInfo,
                    mt_email: e.data.arrItems.mb_email
                      ? e.data.arrItems.mb_email
                      : userInfo.mt_email,
                    mt_nickname: e.data.arrItems.mt_nickname
                      ? e.data.arrItems.mt_nickname
                      : userInfo.mt_nickname,
                    mt_profil_url: e.data.arrItems.mt_profil_url
                      ? e.data.arrItems.mt_profil_url
                      : userInfo.mt_profil_url,
                  }),
                );
                navigation.goBack();
              },
            },
          ]);
        } else {
          Alert.alert('알림', '현재 해당 기능을 사용 할 수 없습니다.', [
            {
              text: '확인',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]);
        }

        console.log('e', e);
      },
    });
  };

  const _updatePhone = () => {
    const res = route.params?.res;

    if (res && res?.certified == true) {
      const data = {
        mt_id: userInfo.mt_id,
        mt_hp: phone,
        mt_auth: res?.certified ? true : false,
      };

      console.warn(data);

      mutateUpdatePhone.mutate(data, {
        onSettled: e => {
          console.log('e', e);

          if (e.result === 'true') {
            Alert.alert('알림', '휴대폰번호 수정이 완료되었습니다.', [
              {
                text: '확인',
                onPress: () => {
                  dispatch(
                    setUserInfo({
                      ...userInfo,
                      mt_hp: e.data.arrItems.mt_hp,
                    }),
                  );
                  navigation.goBack();
                },
              },
            ]);
          } else {
            Alert.alert('알림', '현재 해당 기능을 사용 할 수 없습니다.', [
              {
                text: '확인',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]);
          }
        },
      });
    } else {
      customAlert('알림', '본인인증이 필요합니다.', () => {});
    }
  };

  // const _vaildate = (str, setState) => {
  //   let temp = str.trim();
  //   temp = temp.replace(/[^0-9]/gi, '');
  //   setState(temp);
  // };

  // const _setDelay = () => {
  //   setDelay(true);
  //   setTimeout(() => {
  //     setDelay(false);
  //   }, 1000);
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
      setProfileImg(convert);
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
      setProfileImg(convert);
      setModalPic(!modalPic);
    });
  };

  const _convertPhoneNumber = str => {
    const phone = str.replace(
      /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,
      '$1-$2-$3',
    );
    return phone;
  };

  useEffect(() => {
    if (checkNickname) setCheckNickname(false);
  }, [nickname]);

  useEffect(() => {
    const res = route.params?.res;
    const res2 = route.params;
    console.log(':: RES2 ', res2);
    if (res && res?.certified == true) {
      setPhone(res.phone);
    }
    console.log(':: RES CERTIFI', res);
  }, [route]);

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'정보 수정'} navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {target === EditConfig.target.nickname && (
          <>
            <View style={{padding: 22}}>
              <TextRegular style={{color: colors.fontColor2}}>
                닉네임 변경
              </TextRegular>
              <View
                style={{flexDirection: 'row', marginTop: 5, marginBottom: 20}}>
                <TextInput
                  value={nickname}
                  onChangeText={e => {
                    setNickname(e.trim());
                  }}
                  autoCapitalize={'none'}
                  style={{
                    flex: 1,
                    height: 50,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: colors.borderColor,
                    paddingHorizontal: 10,
                  }}
                  placeholder="닉네임을 입력하세요"
                />
                <Pressable
                  onPress={() => {
                    _checkNickname();
                  }}
                  style={{
                    height: 50,
                    width: 100,
                    borderRadius: 10,
                    marginLeft: 10,
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TextBold style={{color: 'white'}}>중복확인</TextBold>
                </Pressable>
              </View>
              <TextRegular style={{color: colors.fontColor2}}>
                프로필 사진
              </TextRegular>

              <View style={{marginTop: 10, flexDirection: 'row'}}>
                <Pressable
                  style={{
                    borderWidth: 1,
                    borderColor: colors.borderColor,
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    setModal(!modal);
                  }}>
                  <Image
                    source={
                      !userInfo?.mt_profil_url && !profileImg?.uri
                        ? require('~/assets/no_use_img.png')
                        : {uri: profileImg?.uri ?? userInfo.mt_profil_url}
                    }
                    style={{width: 100, height: 100, borderRadius: 10}}
                  />
                </Pressable>

                <Pressable
                  onPress={() => {
                    setModalPic(!modalPic);
                    // _setProfileImage();
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                    marginLeft: 10,
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

              <Pressable
                onPress={() => {
                  _updateInfo();
                }}
                style={{
                  height: 50,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                  borderRadius: 10,
                }}>
                {mutateUpdateUserInfo.isLoading ? (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <ActivityIndicator color={'white'} />
                  </View>
                ) : (
                  <TextBold style={{color: 'white'}}>내정보수정</TextBold>
                )}
              </Pressable>
            </View>
          </>
        )}

        {target === EditConfig.target.email && (
          <View style={{padding: 22}}>
            <TextRegular style={{color: colors.fontColor2}}>
              이메일 변경
            </TextRegular>

            <TextInput
              value={email}
              autoCapitalize="none"
              onChangeText={e => setEmail(e.trim())}
              style={{
                height: 50,
                marginTop: 5,
                marginBottom: 20,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: colors.borderColor,
                paddingHorizontal: 10,
              }}
              placeholder="이메일을 입력하세요"
            />

            <Pressable
              onPress={() => {
                _updateInfo(true);
              }}
              style={{
                height: 50,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
                borderRadius: 10,
              }}>
              {mutateUpdateUserInfo.isLoading ? (
                <Loading />
              ) : (
                <TextBold style={{color: 'white'}}>내정보수정</TextBold>
              )}
            </Pressable>
          </View>
        )}

        {target === EditConfig.target.phone && (
          <>
            <View style={{padding: 22}}>
              <TextRegular style={{color: colors.fontColor2}}>
                휴대폰 인증
              </TextRegular>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                  marginBottom: 5,
                }}>
                <TextInput
                  editable={false}
                  value={phone ? _convertPhoneNumber(phone) : userInfo.mt_hp}
                  // onChangeText={e => _vaildate(e, setPhone)}
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    height: 50,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: colors.borderColor,
                    paddingHorizontal: 10,
                    marginRight: 10,
                  }}
                  // placeholder="본인인증이 필요합니다."
                />
                <Pressable
                  onPress={() => {
                    navigation.navigate('IamCertification', {
                      target: CertificationList.isEdit,
                    });
                    // _setDelay();
                  }}>
                  <View
                    style={{
                      width: 100,
                      height: 50,
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TextMedium style={{color: colors.fontColor2}}>
                      재인증
                    </TextMedium>
                  </View>
                </Pressable>
              </View>
              {/* 
              <TextInput
                value={code}
                onChangeText={e => _vaildate(e, setCode)}
                keyboardType="numeric"
                style={{
                  flex: 1,
                  height: 50,
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: colors.borderColor,
                  paddingHorizontal: 10,
                }}
                placeholder="새로운 휴대폰 번호를 입력하세요."
              /> */}

              <Pressable
                onPress={() => {
                  _updatePhone();
                }}
                style={{
                  height: 50,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                  borderRadius: 10,
                }}>
                <TextBold style={{color: 'white'}}>휴대폰번호 변경</TextBold>
              </Pressable>
            </View>
          </>
        )}
        {target === EditConfig.target.password && (
          <>
            <View style={{padding: 22}}>
              <TextRegular style={{color: colors.fontColor2}}>
                새로운 비밀번호
              </TextRegular>

              <TextInput
                style={{
                  flex: 1,
                  height: 50,
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: colors.borderColor,
                  paddingHorizontal: 10,
                  marginRight: 10,
                  marginVertical: 10,
                }}
                placeholder="새 비밀번호를 입력해주세요"
              />

              <TextInput
                style={{
                  flex: 1,
                  height: 50,
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: colors.borderColor,
                  paddingHorizontal: 10,
                }}
                placeholder="새 비밀번호를 다시 입력해주세요"
              />

              <Pressable
                style={{
                  height: 50,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                  borderRadius: 10,
                }}>
                <TextBold style={{color: 'white'}}>비밀번호 변경</TextBold>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
      <Modal
        transparent
        visible={modal}
        onRequestClose={() => {
          setModal(!modal);
        }}>
        <ImageViewer
          imageUrls={[{url: profileImg?.uri}]}
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

export default EditSummit;
