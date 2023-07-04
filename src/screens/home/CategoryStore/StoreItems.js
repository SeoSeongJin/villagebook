import {
  FlatList,
  Image,
  Platform,
  Pressable,
  SectionList,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import Chip from '../../../component/Chip';
import Dot from '../../../component/Dot';
import ImageCover from '../../../component/ImageCover';
import ReviewSimple from '../../../component/reviews/ReviewSimple';
import TextBold from '../../../component/text/TextBold';
import TextRegular from '../../../component/text/TextRegular';
import colors from '../../../styles/colors';
import {replaceString} from '../../../config/utils/Price';
import DividerL from '../../../component/DividerL';
import {useCustomMutation} from '../../../hooks/useCustomMutation';
import {Errorhandler} from '../../../config/ErrorHandler';
import {setIsLifeStyle} from '../../../store/reducers/CategoryReducer';
import {customAlert} from '../../../component/CustomAlert';
import Loading from '../../../component/Loading';
import {setCurrentStoreCode} from '../../../store/reducers/CartReducer';
import {Shadow} from 'react-native-shadow-2';
import FilterView from './FilterView';
import {RefreshControl} from 'react-native';
import Divider from '../../../component/Divider';
import TextMedium from '../../../component/text/TextMedium';
import StoreCard from './StoreCard';

// 2.1 : 1
const StoreItems = ({navigation, route}) => {
  const routeData = route.params;
  const dispatch = useDispatch();
  const {currentLocation} = useSelector(state => state.locationReducer);
  const {currentFilter} = useSelector(state => state.categoryReducer);

  const [storeList, setStoreList] = useState([]);
  const {mutateGetLifeStyle, mutateGetStoreList} = useCustomMutation();

  const _fliterList = data => {
    console.log('data', data);
    return data.filter((item, index) => item !== null);
  };

  const itemLimit = useRef(0);

  const _init = () => {
    itemLimit.current = 0;
    const data = {
      mb_ca_code: routeData.ca_code,
      item_count: itemLimit.current,
      limit_count: 20,
      mb_jumju_type: routeData.category,
      mb_ca_sort: currentFilter + 1,
      mb_lat: currentLocation.lat,
      mb_lng: currentLocation.lon,
    };
    console.log('mutateGetStoreList ::', data);

    if (routeData.category === 'lifestyle') {
      mutateGetLifeStyle.mutate(data, {
        onError: e => {
          setStoreList('');
        },
        onSuccess: e => {
          if (e.result === 'true') {
            console.log('ee', e);
            const temp = _fliterList(e.data.arrItems);
            console.log('temp', temp);
            setStoreList(temp);
          } else setStoreList('');
        },
      });
    } else {
      mutateGetStoreList.mutate(data, {
        onSuccess: e => {
          if (e.result === 'true') {
            console.log('mutateGetStoreList2', e.data.arrItems);
            const temp = _fliterList(e.data.arrItems);
            setStoreList(temp);
          }
        },
      });
    }
  };

  const _getMoreStoreList = () => {
    itemLimit.current += 20;
    const data = {
      mb_ca_code: routeData.ca_code,
      item_count: itemLimit.current,
      limit_count: 20,
      mb_jumju_type: routeData.category,
      mb_ca_sort: currentFilter + 1,
      mb_lat: currentLocation.lat,
      mb_lng: currentLocation.lon,
    };
    console.log('itemLImit ::::::::', itemLimit.current);
    if (routeData.category === 'lifestyle') {
      mutateGetLifeStyle.mutate(data, {
        onSuccess: e => {
          if (e.result === 'true') {
            console.log('ee', e);
            console.log('list', storeList);
            const temp = _fliterList(e.data.arrItems);
            console.log('temp3333333333', temp);
            setStoreList(prev => prev.concat(temp));
          } else return;
        },
      });
    } else {
      mutateGetStoreList.mutate(data, {
        onSuccess: e => {
          console.log('life e', e);
          if (!e.data.arrItems[0] && !e.data.arrItems[1]) return;
          if (e.result === 'true' && e.data.arrItems.length > 0) {
            const temp = _fliterList(e.data.arrItems);
            let prev = [...storeList];
            prev[0].data = prev[0].data.concat(temp[0].data);
            console.log('prev', prev);
            setStoreList(prev);
          } else {
            return;
          }
        },
      });
    }
  };

  useEffect(() => {
    _init();
  }, [route.parma, currentFilter]);

  const layout = useWindowDimensions();
  const IMG_CONTAINER = layout.width * 0.66; //레이아웃 높이
  const IMG_HEIGHT = IMG_CONTAINER * 0.64; //이미지

  const renderItem = item => {
    return (
      <StoreCard item={item} routeData={routeData} navigation={navigation} />
    );
  };

  return (
    <View style={{flex: 1}}>
      {console.log('route cate', routeData.category)}
      {routeData.category === 'lifestyle' ? (
        <FlatList
          data={storeList}
          listKey={'list1'}
          keyExtractor={(item, index) => index}
          renderItem={item => renderItem(item)}
          // contentContainerStyle={{flex: 1}}
          ListEmptyComponent={
            mutateGetLifeStyle.isLoading ? (
              <Loading />
            ) : (
              (mutateGetLifeStyle.isError || mutateGetLifeStyle.isSuccess) &&
              storeList.length === 0 && (
                <View
                  style={{
                    flex: 1,
                    marginTop: '30%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('~/assets/no_store.png')}
                    style={{width: 250, height: 250}}
                  />
                </View>
              )
            )
          }
          onEndReached={() => {
            storeList.length % 20 === 0 && _getMoreStoreList();
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <SectionList
          sections={storeList}
          ListEmptyComponent={
            mutateGetStoreList.isLoading ? (
              <Loading />
            ) : (
              (mutateGetStoreList.isError || mutateGetStoreList.isSuccess) &&
              storeList.length === 0 && (
                <View
                  style={{
                    flex: 1,
                    marginTop: '30%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('~/assets/no_store.png')}
                    style={{width: 250, height: 250}}
                  />
                </View>
              )
            )
          }
          keyExtractor={(item, index) => item + index}
          renderItem={item => renderItem(item)}
          renderSectionHeader={({section: {isOpen}}) =>
            !isOpen && (
              <View>
                <DividerL style={{marginVertical: 15}} />
              </View>
            )
          }
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            _getMoreStoreList();
          }}
        />
      )}
    </View>
  );
};

export default StoreItems;
