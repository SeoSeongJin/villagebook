import {View, Text} from 'react-native';
import React from 'react';
import {useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';

const AddressShow = () => {
  useCallback(
    useFocusEffect(() => {
      console.log('FOCUSED !!!!');
      return () => {};
    }, []),
  );

  return (
    <View>
      <Text>AddressShow</Text>
    </View>
  );
};

export default AddressShow;
