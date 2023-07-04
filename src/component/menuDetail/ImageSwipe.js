import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';

const ImageSwipe = ({images, imageStyle}) => {
  const layout = useWindowDimensions();
  // console.log('images', images);
  return (
    <View style={{flex: 1}}>
      <Swiper
        loop
        autoplay
        autoplayTimeout={1.5}
        autoplayDirection={true}
        showsPagination={false}
        removeClippedSubviews={false}
        style={{height: 300}}
      >
        {images.map((item, index) => (
          <View style={{flex: 1}} key={index}>
            <FastImage
              source={{uri: item}}
              // source={require('~/assets/no_use_img.png')}
              style={{flex: 1, maxWidth: layout.width, maxHeight: 300}}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

export default ImageSwipe;

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
