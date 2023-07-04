import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../component/Header';
import SearchBox from '../../component/mainScreen/SearchBox';
import commonStyles from '../../styles/commonStyle';
import SearchList from './SearchList';

const SearchView = ({navigation, route}) => {
  const routeData = route.params;
  console.log('Search View route', route.params);
  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'검색'} navigation={navigation} />
      <View style={{paddingHorizontal: 22, flex: 1}}>
        <SearchBox
          category={routeData?.category}
          navigation={navigation}
          // onPress={() => navigation.navigate('SearchResult')}
        />
        {/* <SearchList navigation={navigation}/> */}
      </View>
    </SafeAreaView>
  );
};

export default SearchView;
