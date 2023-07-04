import {View, Text} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native';
import commonStyles from '../../styles/commonStyle';

const PointCoupon = ({navigation}) => {
  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Text>PointCoupon</Text>
    </SafeAreaView>
  );
};

export default PointCoupon;
