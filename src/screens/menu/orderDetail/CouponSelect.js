import {View, Text} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../../styles/commonStyle';

const CouponSelect = () => {
  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Text>CouponSelect</Text>
    </SafeAreaView>
  );
};

export default CouponSelect;
