import {View, Text, Pressable, Image} from 'react-native';
import React, {useState} from 'react';

const SetRating = ({rating, setRating}) => {
  // const [rating, setRating] = useState(5);

  return (
    <View style={{flexDirection: 'row'}}>
      <Pressable
        onPress={() => {
          setRating(1);
        }}>
        <Image
          source={
            rating >= 1
              ? require('~/assets/ico_star_on.png')
              : require('~/assets/ico_star_off.png')
          }
          style={{width: 40, height: 40, marginHorizontal: 3}}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          setRating(2);
        }}>
        <Image
          source={
            rating >= 2
              ? require('~/assets/ico_star_on.png')
              : require('~/assets/ico_star_off.png')
          }
          style={{width: 40, height: 40, marginHorizontal: 3}}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          setRating(3);
        }}>
        <Image
          source={
            rating >= 3
              ? require('~/assets/ico_star_on.png')
              : require('~/assets/ico_star_off.png')
          }
          style={{width: 40, height: 40, marginHorizontal: 3}}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          setRating(4);
        }}>
        <Image
          source={
            rating >= 4
              ? require('~/assets/ico_star_on.png')
              : require('~/assets/ico_star_off.png')
          }
          style={{width: 40, height: 40, marginHorizontal: 3}}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          setRating(5);
        }}>
        <Image
          source={
            rating >= 5
              ? require('~/assets/ico_star_on.png')
              : require('~/assets/ico_star_off.png')
          }
          style={{width: 40, height: 40, marginHorizontal: 3}}
        />
      </Pressable>
    </View>
  );
};

export default SetRating;
