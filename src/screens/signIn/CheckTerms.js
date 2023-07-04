import {View, Text, ScrollView, Image, Pressable, Alert} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import TextBold from '../../component/text/TextBold';
import colors from '../../styles/colors';
import Header from '../../component/Header';
import TextRegular from '../../component/text/TextRegular';
import policyConfig from './policyConfig';

const CheckTerms = ({navigation}) => {
  const [policy, setPolicy] = useState({
    checkAll: false,
    checkUse: false,
    checkPersonal: false,
    checkLocation: false,
  });

  const _setPolicy = prop => {
    setPolicy(prev => {
      let temp = {...prev};
      if (prop === 'checkAll') {
        let arr = Object.keys(policy);

        for (let i = 0; i < Object.keys(policy).length; i++) {
          temp[arr[i]] = !policy.checkAll;
        }

        return temp;
      } else {
        temp[prop] = !prev[prop];
        return temp;
      }
    });
  };

  const PolicyDetail = ({target}) => {
    return (
      <Pressable
        hitSlop={5}
        onPress={() => {
          navigation.navigate('Policy', {
            target: target,
          });
        }}
        style={{marginLeft: 'auto'}}>
        <TextRegular style={{color: colors.fontColorA}}>자세히</TextRegular>
      </Pressable>
    );
  };

  const _vaildation = () => {
    if (!policy.checkLocation || !policy.checkPersonal || !policy.checkUse)
      Alert.alert('약관 동의 필요', '필수 약관에 동의하셔야 합니다.', [
        {text: '확인'},
      ]);
    else navigation.navigate('SignForm');
  };

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'회원가입'} navigation={navigation} />
      <ScrollView>
        <View style={{paddingHorizontal: 22, paddingTop: 50}}>
          <TextBold style={{color: colors.fontColor2, fontSize: 20}}>
            서비스 이용을 위해
          </TextBold>
          <TextBold style={{color: colors.fontColor2, fontSize: 20}}>
            약관에 동의해 주세요.
          </TextBold>

          <View style={{marginTop: 30}}>
            <Pressable
              hitSlop={10}
              onPress={() => {
                _setPolicy('checkAll');
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={
                  policy.checkAll
                    ? require('~/assets/top_ic_map_on.png')
                    : require('~/assets/top_ic_map_off.png')
                }
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <TextBold>전체 약관에 동의합니다.</TextBold>
            </Pressable>
          </View>

          <View style={{marginTop: 20}}>
            <Pressable
              hitSlop={10}
              onPress={() => {
                _setPolicy('checkUse');
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={
                  policy.checkUse
                    ? require('~/assets/top_ic_map_on.png')
                    : require('~/assets/top_ic_map_off.png')
                }
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <TextRegular>이용약관 (필수)</TextRegular>
              <PolicyDetail target={policyConfig.target.use} />
            </Pressable>
          </View>

          <View style={{marginTop: 20}}>
            <Pressable
              hitSlop={10}
              onPress={() => {
                _setPolicy('checkPersonal');
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={
                  policy.checkPersonal
                    ? require('~/assets/top_ic_map_on.png')
                    : require('~/assets/top_ic_map_off.png')
                }
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <TextRegular>개인정보 처리방침 (필수)</TextRegular>
              <PolicyDetail target={policyConfig.target.personal} />
            </Pressable>
          </View>

          <View style={{marginTop: 20}}>
            <Pressable
              hitSlop={10}
              onPress={() => {
                _setPolicy('checkLocation');
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={
                  policy.checkLocation
                    ? require('~/assets/top_ic_map_on.png')
                    : require('~/assets/top_ic_map_off.png')
                }
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <TextRegular>위치기반서비스 약관 (필수)</TextRegular>
              <PolicyDetail target={policyConfig.target.location} />
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              _vaildation();
            }}
            style={{marginTop: 80}}>
            <View
              style={{
                height: 50,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <TextBold style={{color: 'white'}}>다음</TextBold>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckTerms;
