import {View, Text, Alert} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import TextBold from '../../component/text/TextBold';
import {Button} from '../../component/Button';
import colors from '../../styles/colors';
import {Input} from '../../component/Input';
import Header from '../../component/Header';
import loginConfig from './loginConfig';

const ResetAccount = ({navigation, route}) => {
  const routeData = route.params?.target;

  const ResultId = () => {
    return (
      <>
        <View style={{alignItems: 'center', marginTop: '40%'}}>
          <TextBold style={{fontSize: 20, color: colors.fontColor2}}>
            ID : {'USER001'}
          </TextBold>
        </View>
        <View style={{height: 50, marginTop: '20%', paddingHorizontal: 22}}>
          <Button
            flex={1}
            text={'로그인 화면으로 이동'}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </>
    );
  };

  const ResultPW = () => {
    return (
      <>
        <View style={{paddingHorizontal: 22, paddingTop: 20}}>
          <TextBold>새로운 비밀번호 입력</TextBold>
          <Input marginTop={10} marginBottom={20} secureTextEntry />
          <TextBold>새로운 비밀번호 확인</TextBold>
          <Input marginTop={10} secureTextEntry />
          <View style={{height: 50, marginTop: 40}}>
            <Button
              flex={1}
              text={'설정완료'}
              onPress={() => {
                Alert.alert(
                  '설정 완료',
                  '비밀번호가 재설정 되었습니다.\n새로운 비밀번호로 로그인 해주세요.',
                  [{text: '확인', onPress: () => navigation.navigate('Login')}],
                );
              }}
            />
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      {routeData === loginConfig.target.findId ? <ResultId /> : <ResultPW />}
    </SafeAreaView>
  );
};

export default ResetAccount;
