import React from 'react';
import {Text} from 'react-native';
import colors from '../../styles/colors';

const TextNotoB = ({children, style}) => {
  return (
    <Text
      style={[
        {
          fontFamily: 'NotoSansKR-Bold',
          color: colors.fontColor6,
          includeFontPadding: false,
        },
        style,
      ]}>
      {children}
    </Text>
  );
};

export default TextNotoB;
