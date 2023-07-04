import {View, Text} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import Header from '../../component/Header';
import {Pressable} from 'react-native';
import {Image} from 'react-native';
import {TextInput} from 'react-native';
import colors from '../../styles/colors';
import CouponBookSearchBox from './components/CouponBookSearchBox';
import CouponList from './CouponList';
import {Shadow} from 'react-native-shadow-2';
import TextMedium from '../../component/text/TextMedium';
import TextLight from '../../component/text/TextLight';
import TextBold from '../../component/text/TextBold';
import {FlatList} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {useEffect} from 'react';
import {useState} from 'react';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {useSelector} from 'react-redux';

const CouponBookSearch = ({navigation}) => {
  const layout = useWindowDimensions();
  const [searchWord, setSearchWord] = useState('');
  const [schList, setSchList] = useState([]);
  const {mutateGetCouponBookList} = useCustomMutation();
  const {currentLocation} = useSelector(state => state.locationReducer);

  const _getBookList = () => {
    const data = {
      item_count: schList.length,
      limit_count: 20,
      // ca_code: '',
      // ca_sort: '',
      ca_sch: searchWord,
      mb_lat: currentLocation?.lat,
      mb_lng: currentLocation?.lon,
    };
    console.log('## data', data);
    mutateGetCouponBookList.mutate(data, {
      onSuccess: res => {
        console.log('## res', res.data);
        if (res.data?.arrItems?.length > 0) {
          setSchList(prev => [...prev, ...res.data.arrItems]);
          // setCouponData(res.data.arrItems);
        }
      },
    });
  };

  useEffect(() => {
    if (searchWord) _getBookList();
  }, [searchWord]);

  const renderItem = item => {
    const element = item.item;
    const elementIdx = item.index;
    return (
      <Shadow
        distance={5}
        offset={[0, 2]}
        style={{width: '100%'}}
        containerStyle={{marginTop: elementIdx === 0 ? 14 : 0}}>
        <Pressable
          onPress={() => {
            navigation.navigate('CouponBookDetail', {...element});
          }}
          style={{
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: 10,
            height: 100,
            marginBottom: 15,
            paddingVertical: 10,
            paddingHorizontal: 10,
            flexDirection: 'row',
            backgroundColor: 'white',
          }}>
          <Image
            source={
              element.store_logo
                ? {uri: element.store_logo}
                : require('~/assets/no_img.png')
            }
            style={{height: 80, width: 80}}
            resizeMode="cover"
          />
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextMedium
                style={{color: colors.fontColor3, flex: 1}}
                numberOfLines={1}>
                {element.store_name}
              </TextMedium>
              <TextLight
                style={{
                  color: colors.fontColorA,
                  fontSize: 11,
                  marginRight: 5,
                }}>
                {element.cp_end_txt}
              </TextLight>
            </View>
            <TextBold
              style={{fontSize: 16, color: colors.fontColor2}}
              numberOfLines={2}>
              {element.cp_subject}
            </TextBold>
            <TextBold
              style={{fontSize: 13, color: colors.fontColorA2}}
              numberOfLines={2}>
              {element.cp_memo}
            </TextBold>
          </View>
          <View
            style={{
              width: 1,
              height: 60,
              backgroundColor: colors.primary,
              alignSelf: 'center',
              marginRight: 5,
            }}
          />
          <Pressable
            onPress={() => {
              // _onPressSave(element);
            }}
            style={{width: 55, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('~/assets/down_coupon.png')}
              style={{width: 45, height: 45}}
              resizeMode="contain"
            />
            <TextLight style={{fontSize: 12}}>
              {element?.cp_coupon_download_txt}
            </TextLight>
          </Pressable>
        </Pressable>
      </Shadow>
    );
  };

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <CouponBookSearchBox
        navigation={navigation}
        searchWord={searchWord}
        setSearchWord={setSearchWord}
      />
      <FlatList
        data={schList}
        keyExtractor={(item, index) => index}
        renderItem={item => renderItem(item)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{width: layout.width, paddingHorizontal: 12}}
        onEndReached={() => {
          _getBookList();
        }}
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('~/assets/coupon_ready.png')}
              style={{
                height: (layout.width * 0.8) * 1,
                width: layout.width * 0.8,
                marginTop: '40%',
              }}
              resizeMode="contain"
            />
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default CouponBookSearch;
