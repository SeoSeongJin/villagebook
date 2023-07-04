import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../component/Header';
import commonStyles from '../../../styles/commonStyle';
import TextBold from '../../../component/text/TextBold';
import TextMedium from '../../../component/text/TextMedium';
import colors from '../../../styles/colors';
import TextRegular from '../../../component/text/TextRegular';
import EditConfig from './EditConfig';
import AuthStorage from '../../../store/localStorage/AuthStorageModuel';
import {useSelector} from 'react-redux';
import {useMutation} from 'react-query';
import authAPI from '../../../api/modules/authAPI';
import Loading from '../../../component/Loading';
import AuthStorageModuel from '../../../store/localStorage/AuthStorageModuel';
import {useDispatch} from 'react-redux';
import {setIsGuest, setUserInfo} from '../../../store/reducers/AuthReducer';

const EditInfo = ({navigation}) => {
  const {userInfo} = useSelector(state => state.authReducer);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const _removeReset = async () => {
    dispatch(setUserInfo(''));
    dispatch(setIsGuest(true));
    await AuthStorage._removeUserTokenID(() => {});
    await AuthStorageModuel._removeCartData(() => {});
    await AuthStorage._removeItemAutoLogin(() => {
      navigation.reset({
        routes: [{name: 'Login'}],
      });
    });
  };

  const mutateSignOut = useMutation(authAPI._signOut, {
    onSuccess: e => {
      console.log('mutateSignOut', e);
      setLoading(false);
      _removeReset();
    },
  });

  const _pressLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      {
        text: '로그아웃',
        onPress: () => {
          _removeReset();
        },
      },
      {
        text: '취소',
        onPress: () => {},
      },
    ]);
  };

  const _handleSignOut = () => {
    const data = {
      mt_id: userInfo.mt_id,
      mt_pwd: userInfo.mt_pwd,
      act: 'retire',
    };
    setLoading(true);
    mutateSignOut.mutate(data);
  };

  const _pressSignOut = () => {
    Alert.alert('회원탈퇴', '회원탈퇴 하시겠습니까?', [
      {
        text: '회원탈퇴',
        onPress: () => {
          _handleSignOut();
        },
      },
      {
        text: '취소',
        onPress: () => {},
      },
    ]);
  };

  if (loading) return <Loading />;

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'개인정보수정'} navigation={navigation} showCart={true} />
      <View style={{}}>
        <View
          style={{
            height: 50,
            backgroundColor: colors.inputBoxBG,
            justifyContent: 'center',
            paddingHorizontal: 22,
          }}>
          <TextBold style={{color: colors.fontColor2, fontSize: 16}}>
            정보
          </TextBold>
        </View>
        <View
          style={{
            paddingHorizontal: 22,
            height: 220,
            flexDirection: 'row',
          }}>
          {/* 리스트 항목 */}
          <View style={{justifyContent: 'space-evenly'}}>
            <TextMedium style={{color: colors.fontColorA}}>닉네임</TextMedium>
            <TextMedium style={{color: colors.fontColorA}}>이메일</TextMedium>
            <TextMedium style={{color: colors.fontColorA}}>
              휴대폰번호
            </TextMedium>
            {userInfo.mt_login_type === '1' && (
              <TextMedium style={{color: colors.fontColorA}}>
                비밀번호
              </TextMedium>
            )}
          </View>

          {/* 해당 항목 유저 정보 */}
          <View
            style={{justifyContent: 'space-evenly', marginLeft: 40, flex: 1}}>
            <TextMedium style={{color: colors.fontColor2}}>
              {userInfo.mt_nickname ?? userInfo.mt_name}
            </TextMedium>
            <TextMedium style={{color: colors.fontColor2}}>
              {userInfo.mt_email}
            </TextMedium>
            <TextMedium style={{color: colors.fontColor2}}>
              {userInfo.mt_hp ? userInfo.mt_hp : ''}
            </TextMedium>
            {userInfo.mt_login_type === '1' && (
              <TextMedium style={{color: colors.fontColor2}}>
                {'************'}
              </TextMedium>
            )}
          </View>
          <View style={{justifyContent: 'space-evenly', width: 45}}>
            <Pressable
              onPress={() => {
                navigation.navigate('EditSummit', {
                  target: EditConfig.target.nickname,
                });
              }}
              hitSlop={10}
              style={{
                ...styles.btnEdit,
              }}>
              <TextMedium style={{color: colors.fontColor2, fontSize: 12}}>
                변경
              </TextMedium>
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate('EditSummit', {
                  target: EditConfig.target.email,
                });
              }}
              hitSlop={10}
              style={{
                ...styles.btnEdit,
              }}>
              <TextMedium style={{color: colors.fontColor2, fontSize: 12}}>
                변경
              </TextMedium>
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate('EditSummit', {
                  target: EditConfig.target.phone,
                });
              }}
              hitSlop={10}
              style={{
                ...styles.btnEdit,
              }}>
              <TextMedium style={{color: colors.fontColor2, fontSize: 12}}>
                변경
              </TextMedium>
            </Pressable>
            {userInfo.mt_login_type === '1' && (
              <Pressable
                onPress={() => {
                  navigation.navigate('EditSummit', {
                    target: EditConfig.target.password,
                  });
                }}
                hitSlop={10}
                style={{
                  ...styles.btnEdit,
                }}>
                <TextMedium style={{color: colors.fontColor2, fontSize: 12}}>
                  변경
                </TextMedium>
              </Pressable>
            )}
          </View>
        </View>
        <View
          style={{
            height: 25,
            backgroundColor: colors.inputBoxBG,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            marginTop: 20,
            paddingHorizontal: 22,
          }}>
          <Pressable
            onPress={() => {
              _pressLogout();
            }}
            style={{marginRight: 10, ...styles.btnLogout}}>
            <TextMedium style={{color: colors.cWithe, fontSize: 12}}>
              로그아웃
            </TextMedium>
          </Pressable>
          <Pressable
            onPress={() => {
              _pressSignOut();
            }}
            style={{marginRight: 0, ...styles.btnLogout}}>
            <TextMedium style={{color: colors.cWithe, fontSize: 12}}>
              회원탈퇴
            </TextMedium>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditInfo;

const styles = StyleSheet.create({
  btnEdit: {
    height: 27,
    backgroundColor: colors.couponBG,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingHorizontal: 12,
  },

  btnLogout: {
    height: 30,
    backgroundColor: colors.fontMain2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingHorizontal: 15,
  },
});
