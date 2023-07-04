import {View, Text, Pressable, Image, useWindowDimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import colors from '../styles/colors';
import TextRegular from './text/TextRegular';
import {useCustomMutation} from '../hooks/useCustomMutation';
import Swiper from 'react-native-swiper';
import {Linking} from 'react-native';
import {useDispatch} from 'react-redux';
import {setIsLifeStyle} from '../store/reducers/CategoryReducer';
import {useSelector} from 'react-redux';

const MainBanner = ({navigation, style, position}) => {
  const {currentLocation} = useSelector(state => state.locationReducer);
  const {mutateGetBannerDistance} = useCustomMutation();
  const [bannerImg, setBannerImg] = useState([]);
  const layout = useWindowDimensions();
  const dispatch = useDispatch();

  const _getBannerDistance = (lat, lon) => {
    const data = {
      bn_position: position !== 'lifestyle' ? position : '동네편의',
      mb_lat: lat ? lat : currentLocation?.lat,
      mb_lng: lon ? lon : currentLocation?.lon,
    };

    //market, food
    // jumju_id: routeData.jumju_id,
    // jumju_code: routeData.jumju_code,
    // jumju_type: routeData.category,

    //lifestyle

    mutateGetBannerDistance.mutate(data, {
      onSettled: e => {
        if (e.result === 'true' && e.data.arrItems.length > 0) {
          console.log('eeee', e.data.arrItems);
          setBannerImg(e.data.arrItems);
        } else {
          // console.log('fail');
          // setBannerImg([]);
        }
      },
    });
  };

  const _onPressBanner = item => {
    switch (item?.bn_link_type) {
      case 'food':
        dispatch(setIsLifeStyle(false));
        return navigation.navigate('MenuDetail2', {
          jumju_id: item.bn_jumju_id,
          jumju_code: item.bn_jumju_code,
          bn_id: item.bn_id,
          category: 'food',
        });
      case 'marekt':
        dispatch(setIsLifeStyle(false));
        return navigation.navigate('MenuDetail2', {
          jumju_id: item.bn_jumju_id,
          jumju_code: item.bn_jumju_code,
          bn_id: item.bn_id,
          category: 'market',
        });
      case 'lifestyle':
        dispatch(setIsLifeStyle(true));
        return navigation.navigate('LifeStyleStoreInfo', {
          jumju_id: item.bn_jumju_id,
          jumju_code: item.bn_jumju_code,
          bn_id: item.bn_id,
          category: 'lifestyle',
        });
      case 'site':
        return Linking.openURL(item.bn_link);
      case 'event':
        return navigation.navigate('EventDetail', {
          data: {wr_id: item.bn_link},
        });
      case 'notice':
        return navigation.navigate('NoticeDetail', {
          data: {wr_id: item.bn_link},
        });
      default:
        return;
    }
  };

  useEffect(() => {
    _getBannerDistance();
    return () => {
      // setBannerImg([]);
    };
  }, []);

  if (bannerImg.length === 0)
    return (
      <View
        style={{
          width: '100%',
          height: 140,
          borderRadius: 10,
          backgroundColor: colors.mainBG3,
          ...style,
        }}></View>
    );

  return (
    <View style={{flex: 1}}>
      <Swiper
        loop
        key={bannerImg.length}
        autoplay
        autoplayDirection={true}
        autoplayTimeout={3.0}
        style={{height: 140}}
        containerStyle={style}
        scrollEnabled={position === '쿠폰북' ? false : true}
        // renderToHardwareTextureAndroid
        removeClippedSubviews={false}
        renderPagination={(index, total, context) => (
          <View
            style={{
              top: 110,
              right: 20,
              width: 44,
              height: 21,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(22, 22, 22, 0.57)',
              position: 'absolute',
            }}>
            <TextRegular style={{color: 'white'}}>
              {index + 1}/{total}
            </TextRegular>
          </View>
        )}>
        {bannerImg.map((item, idx) => (
          <Pressable
            key={idx}
            onPress={() => {
              _onPressBanner(item);
              // console.log('item', item);
              // if(item.)
              // navigation.navigate("")
            }}
            style={{
              flex: 1,
              backgroundColor: colors.mainBG3,
              // borderRadius: 10,
              borderRadius: 0,
              overflow: 'hidden',
            }}>
            <FastImage
              source={{uri: item.bn_img}}
              style={{
                flex: 1,
                // maxWidth: layout.width - 28,
                maxWidth: layout.width,
                maxHeight: 140,
                // borderRadius: 10,
                borderRadius: 0,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </Pressable>
        ))}
      </Swiper>
    </View>
  );
};

export default React.memo(MainBanner);
