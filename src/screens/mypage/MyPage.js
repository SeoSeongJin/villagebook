import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import Header from '../../component/Header';
import colors from '../../styles/colors';
import TextBold from '../../component/text/TextBold';
import TextRegular from '../../component/text/TextRegular';
import {replaceString} from '../../config/utils/Price';
import {useSelector} from 'react-redux';
import {useMutation} from 'react-query';

const MyPage = ({navigation}) => {
  const {userInfo} = useSelector(state => state.authReducer);

  const _snsIcon = () => {
    //1: 일반, 2:네이버, 3:카카오, 4:구글 X -> (페북), 5:애플
    switch (userInfo.mt_login_type) {
      case '2':
        return require('~/assets/sns_naver.png');
      case '3':
        return require('~/assets/sns_kakao.png');
      case '4':
        return require('~/assets/sns_facebook.png');
      case '5':
        return require('~/assets/sns_apple.png');
      default:
        return require('~/assets/no_use_img.png');
    }
  };

  const arr = [
    '개인정보 수정',
    '공지사항',
    '1:1문의',
    //'포인트&쿠폰',
    '내쿠폰',
    '이벤트',
    '리뷰 관리',
    '알림 설정',
    //'커뮤니티',
  ];

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'마이페이지'} navigation={navigation} showCart={true} />
      <ScrollView>
        <View
          style={{
            backgroundColor: colors.inputBoxBG,
            paddingHorizontal: 22,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 20,
              alignItems: 'center',
            }}>
            <Image
              source={
                userInfo.mt_profil_url
                  ? {uri: userInfo.mt_profil_url}
                  : userInfo.mt_profil_url
                  ? {uri: userInfo.mt_profil_url}
                  : require('~/assets/no_use_img.png')
              }
              style={{width: 60, height: 60, borderRadius: 60 / 2}}
            />
            <View style={{flex: 1, marginLeft: 20}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextBold style={{color: colors.fontColor2}}>
                  {userInfo.mt_nickname ?? userInfo.mt_name}
                </TextBold>
                <TextRegular style={{fontSize: 12, color: colors.fontColor2}}>
                  님
                </TextRegular>
                {/* sns 로고 삭제 */}
                {/* <TextBold style={{color: colors.fontColor2}}> / </TextBold> */}
                {/* {userInfo.mt_login_type === '1' ? (
                  <TextBold style={{color: colors.fontColor2}}>
                    {userInfo.mt_id}
                  </TextBold>
                ) : (
                  <View
                    style={{
                      width: 17,
                      height: 17,
                      borderRadius: 17 / 2,
                      overflow: 'hidden',
                    }}>
                    <Image
                      source={_snsIcon()}
                      style={{width: 17, height: 17}}
                      resizeMode="center"
                    />
                  </View>
                )} */}
              </View>
              <TextRegular style={{color: colors.fontColor2}}>
                {userInfo.mt_email}
              </TextRegular>
              <Pressable
                onPress={() => {
                  navigation.navigate('EditInfo');
                }}
                style={{
                  marginTop: 10,
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
                hitSlop={10}>
                <TextRegular style={{color: colors.fontColor2}}>
                  정보 입력
                </TextRegular>
                <Image
                  source={require('~/assets/arrow_r.png')}
                  style={{width: 15, height: 15, marginLeft: 10}}
                />
              </Pressable>
            </View>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              height: 80,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              marginBottom: 20,
            }}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <TextBold style={{color: colors.fontColor2}}>포인트</TextBold>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <TextBold style={{color: '#D91313'}}>
                {replaceString(userInfo.mt_point)}
              </TextBold>
              <TextBold style={{color: '#D91313'}}>P</TextBold>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <TextBold style={{color: colors.fontColorA, fontSize: 18}}>
                {userInfo.mt_coupon ? userInfo.mt_coupon : 0}
              </TextBold>
              <TextBold style={{color: colors.fontColor2}}>쿠폰</TextBold>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <TextBold style={{color: colors.fontColorA, fontSize: 18}}>
                {userInfo.mt_review_cnt ?? 0}
              </TextBold>
              <TextBold style={{color: colors.fontColor2}}>리뷰</TextBold>
            </View>
          </View>
        </View>

        <View style={{paddingHorizontal: 22}}>
          {arr.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                switch (index) {
                  case 0:
                    navigation.navigate('EditInfo');
                    break;
                  case 1:
                    navigation.navigate('Notice');
                    break;
                  case 2:
                    navigation.navigate('FAQ');
                    break;
                  case 3:
                    //navigation.navigate('DiscountMain');
                    navigation.navigate('CouponBookMy');
                    break;
                  case 4:
                    navigation.navigate('EventBoard');
                    break;
                  case 5:
                    navigation.navigate('Review');
                    break;
                  case 6:
                    navigation.navigate('PushSetting');
                    break;
                  case 7:
                    navigation.navigate('CommunityMain');
                    break;
                  default:
                    break;
                }
              }}
              style={{
                ...styles.btnMenus,
                borderBottomWidth: index === arr.length - 1 ? 0 : 1,
              }}>
              <TextBold style={{fontSize: 14, color: colors.fontColor2}}>
                {item}
              </TextBold>
              <Image
                source={require('~/assets/arrow_r.png')}
                style={{width: 15, height: 15, marginLeft: 10}}
              />
            </Pressable>
          ))}
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.inputBoxBG,
            paddingHorizontal: 22,
          }}>
          {/* <TextBold style={{color: colors.fontColor2}}>주의사항</TextBold> */}
          {/* <TextBold style={{color: colors.fontColor2}}>주문취소</TextBold>
          <TextBold style={{color: colors.fontColor2}}>업체연락처</TextBold>
          <TextBold style={{color: colors.fontColor2}}>주문누락</TextBold>
          <TextBold style={{color: colors.fontColor2}}>쿠폰사용</TextBold>
          <TextBold style={{color: colors.fontColor2}}>포인트사용</TextBold>
          <TextBold style={{color: colors.fontColor2}}>전화주문</TextBold>
          <TextBold style={{color: colors.fontColor2}}>유의사항</TextBold> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyPage;

const styles = StyleSheet.create({
  btnMenus: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: colors.borderColor,
    paddingVertical: 20,
  },
});
