import React from 'react';
import {Text} from 'react-native';
import colors from '../../styles/colors';

const TextSBold = ({children, style}) => {
  return (
    <Text
      style={[
        {fontFamily: 'Pretendard-SemiBold', color: colors.fontColor6},
        style,
      ]}>
      {children}
    </Text>
  );
};

export default TextSBold;
