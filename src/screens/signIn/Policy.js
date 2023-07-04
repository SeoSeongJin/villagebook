import {View, Text, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import Header from '../../component/Header';
import {useMutation} from 'react-query';
import authAPI from '../../api/modules/authAPI';
import policyConfig from './policyConfig';
import Loading from '../../component/Loading';
import TextRegular from '../../component/text/TextRegular';
import RenderHtml from 'react-native-render-html';

const Policy = ({navigation, route}) => {
  const routeData = route.params?.target;
  const mutatePolicy = useMutation(authAPI._getTermsOfPolicy, {
    onSuccess: e => {
      console.log('policy e', e);
      console.log(mutatePolicy);
    },
  });

  const _init = () => {
    let temp;
    switch (routeData) {
      case policyConfig.target.use:
        temp = 'provision';
        break;
      case policyConfig.target.location:
        temp = 'location';
        break;
      case policyConfig.target.personal:
        temp = 'privacy';
        break;
      default:
        temp = 'provision';
        break;
    }
    const data = {
      co_id: temp,
    };
    mutatePolicy.mutate(data);
  };

  useEffect(() => {
    _init();
  }, [routeData]);

  if (mutatePolicy.isLoading) return <Loading />;

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={routeData} navigation={navigation} />
      <ScrollView>
        <View style={{padding: 22}}>
          <RenderHtml
            source={{
              html: mutatePolicy?.data?.data.arrItems.co_content,
            }}></RenderHtml>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Policy;
