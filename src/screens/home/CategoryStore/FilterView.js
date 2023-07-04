import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  Pressable,
  Platform,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Filter from '../../../config/Filter';
import TextSBold from '../../../component/text/TextSBold';
import TextRegular from '../../../component/text/TextRegular';
import colors from '../../../styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import {setcurrentFilter} from '../../../store/reducers/CategoryReducer';
import {SafeAreaView} from 'react-native-safe-area-context';

const FilterView = ({isSearch, category}) => {
  const layout = useWindowDimensions();
  //   const [selectedFilter, setSelectedFilter] = useState(0);
  const dispatch = useDispatch();
  const {currentFilter} = useSelector(state => state.categoryReducer);
  const {isLifeStyle} = useSelector(state => state.categoryReducer);
  const scrollRef = useRef();
  const filterRef = useRef([]);

  const lifeFilter = [
    ['기본순', 0],
    ['가까운순', 1],
    ['리뷰많은순', 2],
    ['찜많은순', 3],
  ];
  // console.warn(category);
  const Fliter = ({index, item}) => {
    console.log('item', item, index);
    return (
      <Pressable
        ref={filterRef[index]}
        key={index}
        onPress={() => {
          // scrollRef.current.scrollTo();
          dispatch(setcurrentFilter(index));
        }}
        style={{
          height: 30,
          backgroundColor: currentFilter === index ? colors.primary : 'white',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 18,
          paddingHorizontal: 13,
          // marginRight: isSearch ? 13 : null,
        }}>
        {currentFilter === index ? (
          <TextSBold
            style={{
              color: currentFilter === index ? 'white' : colors.fontColorA2,
            }}>
            {item}
          </TextSBold>
        ) : (
          <TextRegular>{item}</TextRegular>
        )}
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        height: 40,
        zIndex: 200,
        marginLeft: 14,
        // backgsroundColor: 'teal',
        top: 110,
        position: Platform.OS === 'ios' ? 'relative' : 'absolute',
        minWidth: layout.width,
      }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        contentContainerStyle={{
          alignItems: 'center',
          paddingRight: 22,
        }}>
        {isLifeStyle
          ? lifeFilter.map((item, index) => (
              <Fliter key={index} item={item[0]} index={item[1]} />
            ))
          : Filter.filter.map((item, index) =>
              isLifeStyle ? (
                index === 0 || index === 4 || index === 7 ? (
                  <Fliter key={index} item={item} index={index} />
                ) : (
                  <View key={index}></View>
                )
              ) : category === 'market' ? (
                index !== 1 ? (
                  <Fliter key={index} item={item} index={index} />
                ) : (
                  <View key={index}></View>
                )
              ) : (
                <Fliter key={index} item={item} index={index} />
              ),
            )}
      </ScrollView>
    </View>
  );
};

export default FilterView;
