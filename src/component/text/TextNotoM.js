import React from 'react';
import {Text} from 'react-native';
import colors from '../../styles/colors';

const TextNotoM = ({children, style}) => {
  return (
    <Text
      style={[
        {
          fontFamily: 'NotoSansKR-Medium',
          color: colors.fontColor6,
          includeFontPadding: false,
        },
        style,
      ]}>
      {children}
    </Text>
  );
};

export default TextNotoM;
