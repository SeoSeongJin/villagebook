import {View, Text} from 'react-native';
import React from 'react';
import colors from '../styles/colors';

const DividerL = ({style}) => {
  return (
    <View style={[{height: 10, backgroundColor: colors.dividerL}, style]} />
  );
};

export default DividerL;
