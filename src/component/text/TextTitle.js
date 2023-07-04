import React from 'react';
import {Text} from 'react-native';
import colors from '../../styles/colors';

const TextEBold = ({children, style, numberOfLines}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontFamily: 'Pretendard-Bold',
          color: colors.fontColor2,
          fontSize: 20,
        },
        style,
      ]}>
      {children}
    </Text>
  );
};

export default TextEBold;
