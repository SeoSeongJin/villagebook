import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import {Shadow} from 'react-native-shadow-2';
import {SectionList} from 'react-native';

const Test = () => {
  const [temp, setTemp] = useState();
  const [temp2, setTemp2] = useState();
  const arr = [1, 2, 3, 4];

  return (
    <View style={{flex: 1}}>
      <SectionList />
      {arr.map((item, index) => (
        <Shadow
          // offset={[3, 10]}

          containerStyle={{
            margin: 20,
            shadowRadius: 1,
          }}
          key={index}>
          <Pressable
            style={{
              width: 100,
              height: 50,
              // margin: 20,
              backgroundColor: temp === index ? 'teal' : 'tomato',
            }}
            onPress={() => {
              setTemp(index);
            }}></Pressable>
        </Shadow>
      ))}
    </View>
  );
};

export default Test;
