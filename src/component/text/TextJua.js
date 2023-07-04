import React from 'react';
import {Platform, Text} from 'react-native';
import colors from '../../styles/colors';

const TextJua = ({children, style}) => {
  return (
    <Text
      style={[
        {
          fontFamily: Platform.OS === 'ios' ? 'BMJUAOTF' : 'BMJUA',
          color: colors.fontColor6,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default TextJua;
