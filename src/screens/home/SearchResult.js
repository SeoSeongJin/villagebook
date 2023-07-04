import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../component/Header';
import SearchBox from '../../component/mainScreen/SearchBox';
import commonStyles from '../../styles/commonStyle';
import SearchList from './SearchList';
import colors from '../../styles/colors';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {useSelector} from 'react-redux';
import TextSBold from '../../component/text/TextSBold';
import FilterView from './CategoryStore/FilterView';
import {Platform} from 'react-native';

const SearchResult = ({navigation, route}) => {
  const routeData = route.params;
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const {keyword, resultCount} = useSelector(state => state.searchReducerSub);
  // console.log('Search Route', route.params);
  // console.warn('resultCount', resultCount);
  const FirstRoute = () => (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <SearchList navigation={navigation} JType={'lifestyle'} />
    </View>
  );

  const SecondRoute = () => (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <SearchList navigation={navigation} JType={'food'} />
    </View>
  );

  const ThirdRoute = () => (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <SearchList navigation={navigation} JType={'market'} />
    </View>
  );

  const renderScene = SceneMap(
    routeData?.category === 'lifestyle'
      ? {lifestyle: FirstRoute}
      : routeData?.category === 'food'
      ? {food: SecondRoute}
      : routeData?.category === 'market'
      ? {market: ThirdRoute}
      : {
          lifestyle: FirstRoute,
          food: SecondRoute,
          market: ThirdRoute,
        },
  );

  const [routes] = useState(
    routeData?.category === 'food'
      ? [{key: 'food', title: `맛집`}]
      : routeData?.category === 'market'
      ? [{key: 'market', title: `마켓`}]
      : routeData?.category === 'lifestyle'
      ? [
          {
            key: 'lifestyle',
            title: `동네정보`,
          },
        ]
      : [
          {
            key: 'lifestyle',
            title: `동네정보`,
          },
          {key: 'food', title: `맛집`},
          {key: 'market', title: `마켓`},
        ],
  );

  const _convertCount = title => {
    switch (title) {
      case '맛집':
        return `${resultCount?.countFood ?? ''}`;
      case '마켓':
        return `${resultCount?.countMarket ?? ''}`;
      case '동네정보':
        return `${resultCount?.countLifestyle ?? ''}`;
      default:
        return '-';
    }
  };

  useEffect(() => {
    setIndex(0);
  }, [keyword]);

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header
        title={routeData?.category ? routes[0].title + ' 검색' : '검색'}
        navigation={navigation}
      />

      <View style={{paddingHorizontal: 14}}>
        <SearchBox navigation={navigation} category={routeData.category} />
        {/* {Platform.OS === 'ios' ? (
          <View
            style={{
              // flex: 1,
              position: 'absolute',
              // 헤더 버튼보다 낮도록 설정
              zIndex: 200,
              // width: 100,
              // height: 100,
            }}>
            <FilterView isSearch={true} />
          </View>
        ) : (
          <FilterView isSearch={true} />
        )} */}
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        sceneContainerStyle={{
          padingHorizontal: 22,
          marginVertical: 15,
        }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: routeData?.category
                ? colors.borderColor
                : 'black',
            }}
            tabStyle={{height: routeData?.category ? 10 : null}}
            labelStyle={{
              color: routeData?.category ? 'white' : 'black',
              fontFamily: 'Pretendard-SemiBold',
              fontSize: 14,
            }}
            renderLabel={props =>
              !routeData?.category && (
                <View style={{flexDirection: 'row'}}>
                  {/* {console.warn('props', props)} */}
                  <TextSBold>{props.route.title + ' '}</TextSBold>
                  <TextSBold style={{color: colors.primary}}>
                    {props?.route?.title
                      ? _convertCount(props.route.title)
                      : ''}
                  </TextSBold>
                </View>
              )
            }
            indicatorContainerStyle={{alignItems: 'center'}}
            style={{
              backgroundColor: 'white',
              fontWeight: 'bold',
              shadowOffset: {height: 0, width: 0},
              shadowColor: 'transparent',
            }}
            pressColor={'transparent'}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default SearchResult;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    height: 40,
    marginTop: 13,
  },
  tabItemContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    borderBottomColor: colors.borderColor22,
    width: 70,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 9,
  },
});
