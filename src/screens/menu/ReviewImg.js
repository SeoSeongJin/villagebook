import {View, Text} from 'react-native';
import React from 'react';
import {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {useWindowDimensions} from 'react-native';

const ReviewImg = ({review}) => {
  const [HEIGHT, setHEIGHT] = useState({height: 0, rate: 0});
  const layout = useWindowDimensions();

  return (
    <View>
      {review.notice?.noticePic?.map((item, index) => (
        <FastImage
          key={index}
          source={{uri: item}}
          onLoad={e => {
            if (e.nativeEvent.height) {
              setHEIGHT({
                height: e.nativeEvent.height,
                rate: layout.width / e.nativeEvent.width,
              });
            }
          }}
          style={{
            width: layout.width,
            height: HEIGHT.height ? HEIGHT.height * HEIGHT.rate : 100,
          }}
          resizeMode={'contain'}
        />
      ))}
    </View>
  );
};

export default ReviewImg;
