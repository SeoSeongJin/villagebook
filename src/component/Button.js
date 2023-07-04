import React from 'react';
import {ActivityIndicator, Pressable} from 'react-native';
import colors from '../styles/colors';
import Loading from './Loading';
import TextRegular from './text/TextRegular';

export const Button = ({
  text,
  borderWidth,
  flex,
  marginTop,
  marginBottom,
  onPress,
  hitSlop,
  isLoading,
}) => {
  return (
    <Pressable
      hitSlop={hitSlop}
      onPress={isLoading ? null : onPress}
      style={{
        flex,
        height: 50,
        width: flex ? null : 100,
        backgroundColor: borderWidth ? 'white' : colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: flex ? 0 : 10,
        marginTop,
        marginBottom,
        borderWidth,
        borderColor: colors.borderColor,
      }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <TextRegular style={{color: borderWidth ? colors.fontColor2 : 'white'}}>
          {text}
        </TextRegular>
      )}
    </Pressable>
  );
};
