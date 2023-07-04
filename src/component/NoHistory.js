import {View, Text} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import TextBold from './text/TextBold';

const NoHistory = () => {
  return (
    <View
      style={{alignItems: 'center', justifyContent: 'center', marginTop: 40}}>
      <TextBold>주문내역이 없습니다</TextBold>
    </View>
  );
};

export default NoHistory;
