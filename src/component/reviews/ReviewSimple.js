import {View, Text, Image} from 'react-native';
import React from 'react';
import TextRegular from '../text/TextRegular';

const ReviewSimple = ({star, review}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: 70,
        justifyContent: 'flex-end',
      }}>
      <Image
        source={require('~/assets/ico_star_on.png')}
        style={{width: 17, height: 17}}
        resizeMode="contain"
      />
      <TextRegular>
        {star}({Number(review) > 999 ? '999' : review})
      </TextRegular>
    </View>
  );
};

export default ReviewSimple;
