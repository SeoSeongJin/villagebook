import {View, Text, Pressable, Image, Share, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import TextRegular from '../text/TextRegular';
import TextSBold from '../text/TextSBold';
import colors from '../../styles/colors';
import {_guestAlert} from '../../config/utils/modules';

const LikeShare = ({
  storeInfo,
  categoryMain,
  likeCount,
  navigation,
  imgUrl,
}) => {
  const {userInfo} = useSelector(state => state.authReducer);
  const {isGuest} = useSelector(state => state.authReducer);
  const {mutateSetLikeStore} = useCustomMutation();

  const [like, setLike] = useState();
  const [likeNum, setLikeNum] = useState(likeCount);
  console.log('likenum', likeNum, likeCount, categoryMain);
  // console.warn(storeInfo);
  const _setLikeStore = () => {
    const data = {
      mt_id: userInfo.mt_id,
      jumju_id: storeInfo.mb_id,
      jumju_code: storeInfo.mb_jumju_code,
    };
    console.log('data', data);
    mutateSetLikeStore.mutate(data, {
      onSuccess: e => {
        console.log('ee', e);
      },
    });
  };

  const _onPressLike = () => {
    if (like === 'Y') {
      setLike('N');
      setLikeNum(Number(likeNum) - 1);
    }
    if (like === 'N') {
      setLike('Y');
      setLikeNum(Number(likeNum) + 1);
    }
    _setLikeStore();
  };

  const _share = async () => {
    console.log('categoryMain ::', categoryMain);
    console.log('mb_id ::', storeInfo.mb_id);
    console.log('mb_jumju_code ::', storeInfo.mb_jumju_code);
    try {
      const link = await dynamicLinks().buildShortLink({
        link:
          categoryMain === 'lifestyle'
            ? `https://www.dongnaebook.com/mainlife/${categoryMain}/${storeInfo.mb_id}/${storeInfo.mb_jumju_code}/link`
            : `https://www.dongnaebook.com/main/${categoryMain}/${storeInfo.mb_id}/${storeInfo.mb_jumju_code}/link`,
        domainUriPrefix: 'https://dongnaebook.page.link',
        navigation: {forcedRedirectEnabled: true},
        social: {
          title: '동네북',
          descriptionText: storeInfo.mb_company,
          // imageUrl:
          //   'https://conservationaction.co.za/wp-content/uploads/2019/05/Elephant-Botswana-lifts-ban-on-elephant-hunting-800x400.jpg',
          imageUrl: storeInfo.mb_share_img,
        },
        android: {
          packageName: 'com.dmonster.dongnaebook',
        },
        ios: {
          appStoreId: '1643631343',
          bundleId: 'com.dmonster.dongnaebook',
        },
      });

      console.log('Current Store ::', storeInfo);

      console.log('Link::', link);

      const result = await Share.share({
        message: link,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('activityType!');
        } else {
          console.log('Share!');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('dismissed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (storeInfo) setLike(storeInfo.isWish);
  }, [storeInfo]);

  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <Pressable
        hitSlop={10}
        onPress={() => {
          if (!isGuest && userInfo) {
            _onPressLike();
          } else {
            _guestAlert(navigation);
          }
        }}
        style={{flexDirection: 'row', marginRight: 15, alignItems: 'center'}}>
        <Image
          source={
            like === 'Y'
              ? require('~/assets/top_heart_on.png')
              : require('~/assets/top_heart.png')
          }
          style={{width: 30, height: 30}}
        />
        <TextSBold style={{fontSize: 16, color: colors.fontColor2}}>
          {likeNum}
        </TextSBold>
      </Pressable>
      <Pressable
        hitSlop={10}
        onPress={() => {
          if (!isGuest && userInfo) {
            _share();
          } else {
            _guestAlert(navigation);
          }
        }}>
        <Image
          source={require('~/assets/top_share_w.png')}
          style={{width: 30, height: 30, tintColor: 'black'}}
        />
      </Pressable>
    </View>
  );
};

export default LikeShare;
