import {View, Text} from 'react-native';
import React from 'react';
import colors from '../styles/colors';

const Divider = ({style}) => {
  return (
    <View
      style={[{width: 1, height: 15, backgroundColor: colors.colorE3}, style]}
    />
  );
};

export default Divider;
