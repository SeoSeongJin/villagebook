import {View, Text, Image} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../../styles/commonStyle';
import Header from '../../../component/Header';

const Cart = ({navigation}) => {
  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'카트'} navigation={navigation} />
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Image
          source={require('~/assets/no_cart.png')}
          style={{width: 300, height: 300}}
        />
      </View>
    </SafeAreaView>
  );
};

export default Cart;
