import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useCustomMutation} from '../hooks/useCustomMutation';
import colors from '../styles/colors';
import TextNotoR from './text/TextNotoR';
import TextNotoB from './text/TextNotoB';

const Caution = () => {
  const {mutateGetUseInfo} = useCustomMutation();
  const [info, setInfo] = useState([]);

  const _getUseInfo = () => {
    const data = {};
    mutateGetUseInfo.mutate(data, {
      onSuccess: e => {
        console.log('## UseInfo', e);
        if (e.result === 'true') setInfo(e.data.arrItems);
      },
    });
  };

  const _convertTitle = title => {
    switch (title) {
      case 'caution_use':
        return '유의사항';
      case 'order_use':
        return '주의사항';
      case 'coupon_use':
        return '쿠폰사용';
      case 'point_use':
        return '포인트 사용';
      case 'tel_use':
        return '전화 주문';
      case 'etc_use':
        return '주문누락';
      default:
        return title;
    }
  };

  useEffect(() => {
    _getUseInfo();
  }, []);

  return (
    <View>
      {Object.keys(info)?.map((item, index) => (
        <View key={index}>
          {index !== Object.keys(info).length - 1 && (
            <View
              key={index}
              style={{
                paddingHorizontal: 22,
                paddingVertical: 20,
                paddingBottom: 60,
                backgroundColor: colors.inputBoxBG,
              }}
            >
              <TextNotoB
                style={{
                  fontSize: 14,
                  color: colors.fontColor3,
                  includeFontPadding: false,
                  marginBottom: 7,
                }}
              >
                {_convertTitle(item)}
              </TextNotoB>
              {info[`${item}`]?.map((item2, index2) => (
                <TextNotoR
                  key={index2}
                  style={{
                    fontSize: 13,
                    color: colors.fontColor8,
                    includeFontPadding: false,
                  }}
                >
                  {item2}
                </TextNotoR>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default React.memo(Caution);
