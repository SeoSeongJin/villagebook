import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  Pressable,
  Platform,
} from 'react-native';
import React, {useRef, useState} from 'react';
import colors from '../../styles/colors';
import TextSBold from '../../component/text/TextSBold';
import TextRegular from '../../component/text/TextRegular';
import MainBanner from '../../component/MainBanner';
import BannerList from '../../config/BannerList';
import {useDispatch} from 'react-redux';
import {setCouponBookFilterIndex} from '../../store/reducers/CouponReducer';

const CouponFilterView = ({isSearch, category, navigation, top}) => {
  const layout = useWindowDimensions();
  // 1:추천순, 2:인기순, 3:기간 마감 임박순,4:개수 마감 임박순
  const filterList = [
    '추천순',
    '인기순',
    '기간 마감 임박 순',
    '개수 마감 임박 순',
  ];
  const [filterSub, setFilterSub] = useState('추천순');
  const dispatch = useDispatch();

  const _onPressSub = (item, index) => {
    setFilterSub(item);
    const idx = index + 1;
    dispatch(setCouponBookFilterIndex(idx));
  };

  return (
    <View
      style={{
        // flex: 1,
        zIndex: 1000,
        height: 40,
        marginLeft: 14,
        top: top ? top : 110,
        position: Platform.OS === 'ios' ? 'relative' : 'absolute',
        minWidth: layout.width,
      }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          // marginTop: 10,
          // marginBottom: 10,
          // marginHorizontal: 14,
          height: 25,
        }}
        contentContainerStyle={{height: 40}}>
        {filterList.map((item, index) => (
          <Pressable
            hitSlop={3}
            key={item + index}
            onPress={() => {
              _onPressSub(item, index);
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 15,
              flexDirection: 'row',
            }}>
            {/* <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 6 / 2,
                backgroundColor:
                  item === filterSub ? colors.primary : colors.fontColorA,
                marginRight: 5,
              }}
            /> */}
            {item === filterSub ? (
              <View
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 13,
                  paddingVertical: 5,
                  borderRadius: 20,
                }}>
                <TextSBold
                  style={{
                    color: item === filterSub ? 'white' : colors.fontColorA,
                  }}>
                  {item}
                </TextSBold>
              </View>
            ) : (
              <TextRegular
                style={{
                  color:
                    item === filterSub ? colors.fontColor2 : colors.fontColorA,
                }}>
                {item}
              </TextRegular>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default CouponFilterView;
