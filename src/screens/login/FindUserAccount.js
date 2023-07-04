import {View, Text} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import TextBold from '../../component/text/TextBold';
import Header from '../../component/Header';
import {Input} from '../../component/Input';
import {Button} from '../../component/Button';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useMutation} from 'react-query';
import authAPI from '../../api/modules/authAPI';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {Errorhandler} from '../../config/ErrorHandler';
import loginConfig from './loginConfig';

const FindUserAccount = ({navigation, route}) => {
  const {mutateFindId, mutateSendCode} = useCustomMutation();

  const routeData = route.params?.target;

  const fm = useFormik({
    initialValues: {
      mt_hp: '',
      mt_code: '',
    },
    validationSchema: yup.object({
      mt_hp: yup
        .number('올바른 휴대폰 번호를 입력해주세요.')
        .integer('올바른 휴대폰 번호를 입력해주세요.')
        .min(13, '올바른 휴대폰 번호를 입력해주세요.')
        .required('휴대폰번호를 입력해주세요.'),
      mt_code: yup.string().required('인증번호를 입력해주세요.'),
      // mt_pwd: yup.string().required('비밀번호를 입력해주세요.'),
    }),
    onSubmit: info => handleSubmit(info),
  });

  const handleSubmit = e => {
    setLoading(true);
    _login(e);
  };

  const _findId = () => {
    const data = {
      mt_level: '2',
      mt_hp: fm.values.mt_hp,
    };
    if (!data.mt_hp.trim() || fm.errors.mt_hp)
      Errorhandler('올바른 휴대폰 번호를 입력해주세요.');
    else mutateFindId.mutate(data);
  };

  const _sendCode = () => {
    const data = {
      mt_level: '2',
      mt_hp: fm.values.mt_hp,
    };
    if (!data.mt_hp.trim() || fm.errors.mt_hp)
      Errorhandler('올바른 휴대폰 번호를 입력해주세요.');
    else mutateSendCode.mutate(data);
  };

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={routeData} navigation={navigation} />
      <View style={{paddingHorizontal: 22}}>
        <TextBold>휴대폰 번호 입력</TextBold>
        <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 7}}>
          <Input
            flex={1}
            formik={fm}
            value={'mt_hp'}
            placeholder={'휴대폰 번호를 입력해주세요.'}
          />
          {routeData === loginConfig.target.findPW && (
            <Button
              borderWidth={1}
              text="인증번호"
              onPress={() => _sendCode()}
            />
          )}
        </View>

        {routeData === loginConfig.target.findPW && (
          <Input
            formik={fm}
            value={'mt_code'}
            placeholder={'인증번호를 입력해주세요.'}
          />
        )}

        <View style={{height: 50, marginTop: 30}}>
          <Button
            flex={1}
            text={'다음'}
            onPress={
              () => _findId()
              // navigation.navigate('ResetAccount', {target: routeData})
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FindUserAccount;
