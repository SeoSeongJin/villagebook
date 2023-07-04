import React from 'react';
import {Text} from 'react-native';
import colors from '../../styles/colors';

const TextBold = ({children, style, numberOfLines, includeFontPadding}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontFamily: 'Pretendard-Bold',
          color: colors.fontColor2,
          includeFontPadding: includeFontPadding,
        },
        style,
      ]}>
      {children}
    </Text>
  );
};

export default TextBold;
