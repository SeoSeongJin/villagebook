import {View, Text} from 'react-native';
import React from 'react';
import TextSBold from './text/TextSBold';
import TextBold from './text/TextBold';

const ImageCover = ({style, text}) => {
  return (
    <View
      style={[
        {
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 100,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      {text && (
        <TextBold style={{color: 'white', fontSize: 17}}>
          동네사람들을 만날 준비 중이에요!
        </TextBold>
      )}
    </View>
  );
};

export default ImageCover;
