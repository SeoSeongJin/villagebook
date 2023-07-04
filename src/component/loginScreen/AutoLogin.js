import React, {useState} from 'react';
import {Image} from 'react-native';
import {Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setAutoLogin} from '../../store/reducers/AuthReducer';
import TextRegular from '../text/TextRegular';

const AutoLogin = () => {
  const dispatch = useDispatch();
  const {autoLogin} = useSelector(state => state.authReducer);
  return (
    <Pressable
      onPress={() => dispatch(setAutoLogin(!autoLogin))}
      style={{
        // marginBottom: 63,
        // alignSelf: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
      }}
      hitSlop={10}>
      {autoLogin ? (
        <Image
          source={require('../../assets/top_ic_map_on.png')}
          style={{width: 23, height: 23}}
        />
      ) : (
        <Image
          source={require('../../assets/top_ic_map_off.png')}
          style={{width: 23, height: 23}}
        />
      )}
      <TextRegular style={{marginLeft: 7}} includeFontPadding={false}>
        자동로그인
      </TextRegular>
    </Pressable>
  );
};

export default AutoLogin;
