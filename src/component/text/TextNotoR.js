import React from 'react';
import {Text} from 'react-native';
import colors from '../../styles/colors';

const TextNotoR = ({children, style}) => {
  return (
    <Text
      style={[
        {
          fontFamily: 'NotoSansKR-Regular',
          color: colors.fontColor6,
          includeFontPadding: false,
        },
        style,
      ]}>
      {children}
    </Text>
  );
};

export default TextNotoR;
