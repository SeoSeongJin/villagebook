import {View, Text} from 'react-native';
import React from 'react';
import colors from '../styles/colors';

const Chip = ({newStore, coupon, takeout}) => {
  return (
    <View style={{flexDirection: 'row', alignSelf: 'flex-end', marginTop: 5}}>
      {newStore && (
        <View
          style={{
            width: 42,
            height: 22,
            borderRadius: 5,
            backgroundColor: 'rgba(252,134,0, 0.1)',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 5,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: colors.chipNew,
            }}>
            신규
          </Text>
        </View>
      )}
      {coupon && (
        <View
          style={{
            width: 42,
            height: 22,
            borderRadius: 5,
            backgroundColor: 'rgba(32,171,200, 0.1)',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 5,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: colors.chipCoupon,
            }}>
            쿠폰
          </Text>
        </View>
      )}

      {/* {takeout && (
        <View
          style={{
            width: 42,
            height: 22,
            borderRadius: 12,
            backgroundColor: '#F8F8F8',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 5,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: colors.chipTakeoutFont,
            }}>
            포장
          </Text>
        </View>
      )} */}
    </View>
  );
};

export default Chip;
