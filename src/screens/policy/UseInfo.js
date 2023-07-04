import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../component/Header';
import commonStyles from '../../styles/commonStyle';
import TextRegular from '../../component/text/TextRegular';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {setUserInfo} from '../../store/reducers/AuthReducer';
import Loading from '../../component/Loading';
import UseInfoList from '../../config/UseInfoList';
import TextBold from '../../component/text/TextBold';

const UseInfo = ({navigation, route}) => {
  const target = route.params?.target;
  const {mutateGetUseInfo} = useCustomMutation();
  const [useInfo, setUseInfo] = useState();

  const _getUseInfo = () => {
    const data = {};
    mutateGetUseInfo.mutate(data, {
      onSuccess: e => {
        console.log('ee', e);
        if (e.result === 'true' && e.data.arrItems) {
          setUseInfo(e.data.arrItems);
        } else {
          setUserInfo([]);
        }
      },
    });
  };

  const _convertName = key => {
    console.log('key', key);
    switch (key) {
      case UseInfoList.target.caution_use:
        return '주의사항';
      case UseInfoList.target.coupon_use:
        return '쿠폰이용정보';
      case UseInfoList.target.etc_use:
        return '기타사항';
      case UseInfoList.target.order_use:
        return '주문이용정보';
      case UseInfoList.target.point_use:
        return '포인트이용정보';
      case UseInfoList.target.tel_use:
        return '전화주문정보';
      default:
        break;
    }
  };

  useEffect(() => {
    _getUseInfo();
  }, []);

  if (!useInfo) return <Loading />;
  console.log('useinfo', useInfo.coupon_use);

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'이용정보'} navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{padding: 22}}>
          <View style={{marginBottom: 20}}>
            {useInfo[UseInfoList.target.coupon_use].map((item, index) => (
              <View key={index} style={{marginVertical: 5}}>
                {index === 0 && (
                  <View style={{marginBottom: 5}}>
                    <TextBold>{_convertName(target)}</TextBold>
                  </View>
                )}
                <TextRegular>- {item}</TextRegular>
              </View>
            ))}
          </View>

          <View style={{marginBottom: 20}}>
            {target === UseInfoList.target.coupon_use &&
              useInfo[UseInfoList.target.point_use].map((item, index) => (
                <View key={index} style={{marginVertical: 5}}>
                  {index === 0 && (
                    <View style={{marginBottom: 5}}>
                      <TextBold>
                        {_convertName(UseInfoList.target.point_use)}
                      </TextBold>
                    </View>
                  )}
                  <TextRegular>- {item}</TextRegular>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UseInfo;
