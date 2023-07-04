import {Image, Pressable} from 'react-native';
import React from 'react';
import {customAlert} from '../../component/CustomAlert';
export const _setRating = (isTotal, style) => {
  const temp = 5;
  let temp2 = [];

  for (let i = 0; i < temp; i++) {
    temp2.push(
      <Pressable key={i} onPress={() => {}}>
        <Image
          source={require('~/assets/ico_star_on.png')}
          style={[
            {
              width: isTotal ? 20 : 16,
              height: isTotal ? 20 : 16,
              marginHorizontal: 3,
            },
            style,
          ]}
          resizeMode="contain"
        />
      </Pressable>,
    );
  }

  return temp2;
};

export const _showAddr = (userInfo, emtpyText) => {
  if (userInfo?.mt_addr1) {
    const temp = userInfo.mt_addr1
      ? userInfo.mt_addr1 + ' ' + userInfo.mt_addr2 + ' ' + userInfo.mt_addr3
      : userInfo.mt_jibeon +
          ' ' +
          userInfo.mt_addr2 +
          ' ' +
          userInfo.mt_addr3 ??
        emtpyText ??
        '';
    return temp;
  } else return '주소설정';
};

export const _guestAlert = navigation => {
  customAlert(
    '알림',
    '로그인이 필요한 기능입니다.',
    () => {},
    '로그인 하러 가기',
    () =>
      navigation.reset({
        routes: [{name: 'Login'}],
      }),
    '취소',
    () => {},
  );
};
