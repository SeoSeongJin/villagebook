import {View, Text, Image} from 'react-native';
import React from 'react';
import TextRegular from '../../component/text/TextRegular';
import TextBold from '../../component/text/TextBold';
import colors from '../../styles/colors';
import {Slider} from '@miblanchard/react-native-slider';

const ReviewScore = ({review, isLifeStyle}) => {
  const _showRateAvg = avg => {
    if (avg % 1 === 0) {
      return avg + '.0';
    } else return avg ?? 0.0;
    // console.log('avg', avg % 1);
  };

  const _setRating = (isTotal, userRate) => {
    const temp = 5;
    let count = userRate ?? 0;
    let temp2 = [];

    for (let i = 0; i < temp; i++) {
      temp2.push(
        <Image
          key={i}
          source={
            count
              ? count > i
                ? require('~/assets/ico_star_on.png')
                : require('~/assets/ico_star_off.png')
              : require('~/assets/ico_star_off.png')
          }
          style={{width: isTotal ? 20 : 16, height: isTotal ? 20 : 16}}
          resizeMode="contain"
        />,
      );
    }

    return temp2;
  };
  const _setSlider = () => {
    let temp2 = [];
    // console.log('re@@@@@@@@@@@', review);
    for (let i = 0; i < 5; i++) {
      temp2.push(
        <View key={i} style={{flexDirection: 'row'}}>
          <Slider
            value={
              review?.rate[`rating_per` + (i - 5) * -1]
                ? review?.rate[`rating_per` + (i - 5) * -1]
                : '0'
            }
            maximumValue={1}
            disabled
            minimumTrackTintColor={colors.primary}
            trackStyle={{
              backgroundColor: 'white',
              height: 5,
              padding: 0,
              margin: 0,
            }}
            containerStyle={{width: 87, height: 20}}
            renderThumbComponent={() => <></>}
          />
          <Text style={{marginLeft: 10}}>{`${(i - 5) * -1}점 (${
            review?.rate[`rating_cnt` + (i - 5) * -1]
          })`}</Text>
        </View>,
      );
    }

    return temp2;
  };

  return (
    <>
      <View style={{paddingHorizontal: 22, paddingVertical: 0}}>
        <TextRegular style={{fontSize: 15}}>
          {/* {review?.notice.noticeContent} */}
        </TextRegular>
      </View>

      <View
        style={{
          height: 227,
          backgroundColor: '#F5F5F5',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 22,
        }}>
        <View style={{flexDirection: 'row'}}>
          <TextBold style={{fontSize: 15}}>
            {isLifeStyle ? '이 가게에' : '이 상품에'}{' '}
          </TextBold>
          <TextBold style={{fontSize: 15, color: colors.primary}}>
            {review.rate?.total_cnt ? review.rate?.total_cnt : '0'}명
          </TextBold>
          <TextBold style={{fontSize: 15}}>이</TextBold>
        </View>

        <TextBold style={{fontSize: 15}}>
          소중한 리뷰를 남겨주었습니다.
        </TextBold>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <TextBold style={{fontSize: 44, color: colors.primary}}>
              {_showRateAvg(review.rate?.avg ? review.rate?.avg : 0)}
            </TextBold>
            <View style={{flexDirection: 'row'}}>
              {_setRating(true, review.rate?.avg ? review.rate?.avg : 0)}
            </View>
          </View>
          <View style={{marginLeft: 30}}>{_setSlider()}</View>
        </View>
      </View>
    </>
  );
};

export default React.memo(ReviewScore);
