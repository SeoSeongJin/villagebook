import {View, Text} from 'react-native';
import React from 'react';
import TextLight from '../text/TextLight';
import Divider from '../Divider';
import colors from '../../styles/colors';
import {Image} from 'react-native';

const ReviewSimple2 = ({info}) => {
  console.log('info', info);
  return (
    <View
      style={{
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Image
        source={require('~/assets/ico_star_on.png')}
        style={{width: 15, height: 15}}
      />
      <TextLight style={{fontSize: 15, color: colors.fontColorA2}}>
        {' '}
        {info.stars ? info.stars : 0}
      </TextLight>
      <Divider style={{marginHorizontal: 8}} />
      <TextLight style={{fontSize: 15, color: colors.fontColorA2}}>
        최근 리뷰 {info.store_review}
      </TextLight>

      <Divider style={{marginHorizontal: 8}} />
      <TextLight style={{fontSize: 15, color: colors.fontColorA2}}>
        최근 사장님댓글 {info.store_comment}
      </TextLight>
    </View>
  );
};

export default ReviewSimple2;
