import {View, Text} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import {SectionList} from 'react-native';

const MenuDetailTemp = () => {
  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <SectionList />
    </SafeAreaView>
  );
};

export default MenuDetailTemp;
