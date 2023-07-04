import React from 'react';
import {Text} from 'react-native';
import colors from '../../styles/colors';

const TextLight = ({children, style}) => {
  return (
    <Text
      style={[
        {fontFamily: 'Pretendard-Light', color: colors.fontColor6},
        style,
      ]}>
      {children}
    </Text>
  );
};

export default TextLight;
