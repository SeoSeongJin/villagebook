import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../styles/commonStyle';
import colors from '../styles/colors';

const Loading = () => {
  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <ActivityIndicator style={{flex: 1}} color={colors.primary} />
    </SafeAreaView>
  );
};

export default Loading;
