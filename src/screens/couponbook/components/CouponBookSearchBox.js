import {View, Text} from 'react-native';
import React from 'react';
import {Pressable} from 'react-native';
import {Image} from 'react-native';
import colors from '../../../styles/colors';
import {TextInput} from 'react-native';
import {useState} from 'react';

const CouponBookSearchBox = ({navigation, searchWord, setSearchWord}) => {
  return (
    <View
      style={{
        width: '100%',
        height: 67,
        backgroundColor: 'white',
        backgroundColor: `rgba(255,255,255,0)`,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderColor: colors.borderColor,
        marginBottom: 10,
      }}>
      <Pressable hitSlop={10} onPress={() => navigation.goBack()}>
        <Image
          source={require('~/assets/top_ic_history.png')}
          style={{
            height: 30,
            width: 30,
            marginRight: 10,
          }}
          resizeMode={'contain'}
        />
      </Pressable>

      <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderWidth: 2,
            borderColor: colors.primary,
            borderRadius: 18,
            paddingHorizontal: 17,
            paddingRight: 33,
            borderRadius: 10,
            marginRight: 8,
          }}
          value={searchWord}
          autoCapitalize={'none'}
          // defaultValue={keyword}
          onChangeText={setSearchWord}
          onSubmitEditing={() => {}}
          autoFocus
          // placeholder={'검새.'}
        />
        <Pressable
          hitSlop={10}
          onPress={() => {
            setSearchWord('');
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            right: 10,
            position: 'absolute',
            // backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('~/assets/pop_close.png')}
            style={{width: 23, height: 23, tintColor: colors.primary}}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default CouponBookSearchBox;
