import React, {useEffect, useRef, useState} from 'react';
import {Keyboard} from 'react-native';
import {Image, Modal, Pressable, TextInput, View} from 'react-native';
import {useQueryClient} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {
  setIsLoading,
  setResultCount,
  setSearchResult,
  setType,
} from '../../store/reducers/SearchReducer';
import {
  setKeywordSub,
  setResultCountSub,
} from '../../store/reducers/SearchReducerSub';
import colors from '../../styles/colors';
import {customAlert} from '../CustomAlert';
import Loading from '../Loading';
import TextBold from '../text/TextBold';

const SearchBox = ({
  onPress,
  isMain,
  isSub,
  navigation,
  category,
  route,
  style,
}) => {
  const dispatch = useDispatch();
  const sStore = useSelector(state => state.searchReducerSub);
  const {keyword} = useSelector(state => state.searchReducerSub);

  // console.warn('key', sStore);
  const [searchWord, setSearchWord] = useState(keyword);
  const {mutateSearch, mutateSearchLifeStyle} = useCustomMutation();
  const {currentLocation} = useSelector(state => state.locationReducer);
  const search = useSelector(state => state.searchReducer);
  const list = ['lifestyle', 'food', 'market'];

  // const _pressSearch = () => {
  //   if (!isMain && !isSub) setModal(true);
  // };
  // console.log('props,', isSub, category);
  const limitItem = useRef(0);

  const _getResult = async (data, index) => {
    let result;
    if (index === 0) {
      result = await mutateSearchLifeStyle.mutateAsync(data, {
        onSettled: e => {
          if (e.result === 'true') {
            console.log('mutateSearchLifeStyle', e);
            // console.warn(e.data.resultItem.countItem);
            if (e.data.resultItem?.countItem)
              dispatch(setResultCountSub(e.data.resultItem.countItem));
          }
        },
      });
      let temp = result.data.arrItems;
      if (temp) {
        temp = temp.filter(item => item !== null);
      }
      return temp;
    } else {
      result = await mutateSearch.mutateAsync(data, {
        onSettled: e => {
          if (e.result === 'true') {
            console.log('mutateSearch', e);
            if (e.data.resultItem?.countItem)
              dispatch(setResultCountSub(e.data.resultItem.countItem));
          }
        },
      });
      let temp = result.data.arrItems;
      if (temp) {
        temp = temp.filter(item => item !== null);
      }
      return temp;
    }
  };

  const _search = type => {
    if (!searchWord.trim()) return customAlert('알림', '검색어를 입력해주세요');
    dispatch(setIsLoading(true));
    dispatch(setType({type: type}));
    dispatch(setKeywordSub({keyword: searchWord}));
    list.map(async (item, index) => {
      const data = {
        item_count: limitItem.current,
        limit_count: 20,
        stx: searchWord,
        mb_jumju_type: item,
        mb_lat: currentLocation.lat,
        mb_lng: currentLocation.lon,
      };
      console.log('ITEM:::::', item);
      // console.warn(data);
      let temp = await _getResult(data, index);
      console.log('_search :::::', temp);
      dispatch(setSearchResult({type: item, item: temp}));
    });
    console.log('route', route);
    navigation.navigate('SearchResult', {isSub: isSub, category: category});
  };

  useEffect(() => {
    if (isSub) setSearchWord('');
    if (mutateSearch.isLoading) dispatch(setIsLoading(true));
    else dispatch(setIsLoading(false));
    return () => {
      if (isMain || isSub) setSearchWord('');
    };
  }, [mutateSearch.isLoading]);

  return (
    <>
      <Pressable
        // onPress={() => (onPress ? onPress() : _search())}
        style={{
          width: '100%',
          height: 50,
          flexDirection: 'row',
          borderWidth: 2,
          borderColor: colors.primary,
          borderRadius: 10,
          alignItems: 'center',
        }}>
        <TextInput
          // editable={isMain || isSub ? false : true}
          style={{
            flex: 1,
            // backgroundColor: colors.inputBoxBG,
            paddingHorizontal: 15,
            borderRadius: 10,
            marginRight: 8,
            height: 50,
          }}
          value={searchWord}
          // defaultValue={keyword}
          onChangeText={setSearchWord}
          onSubmitEditing={() => (onPress ? onPress() : _search())}
          placeholder={'동네북을 펼쳐주세요.'}
        />
        {/* <Pressable
          onPress={() => {
            setModal(!modal);
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius:10,
            backgroundColor: colors.mainBG1,
          }}></Pressable>
           */}
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            onPress ? onPress() : _search();
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            right: 5,
            // backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('~/assets/ico_search.png')}
            style={{width: 23, height: 23, tintColor: colors.primary}}
          />
        </Pressable>
      </Pressable>
    </>
  );
};

export default SearchBox;

{
  /* <Modal
        transparent
        onRequestClose={() => setModal(!modal)}
        visible={modal}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 300,
              height: 300,
              backgroundColor: 'white',
              ...Platform.select({
                ios: {
                  shadowColor: '#00000029',
                  shadowOpacity: 0.6,
                  shadowRadius: 50 / 2,
                  shadowOffset: {
                    height: 12,
                    width: 0,
                  },
                },
                android: {
                  elevation: 5,
                },
              }),
            }}>
            <Pressable
              onPress={() => {
                setModal(!modal);
                _search('food');
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TextBold style={{fontSize: 17}}>맛집 검색</TextBold>
            </Pressable>
            <Pressable
              onPress={() => {
                setModal(!modal);
                _search('market');
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: colors.borderColor,
              }}>
              <TextBold style={{fontSize: 17}}>마켓 검색</TextBold>
            </Pressable>
            <Pressable
              onPress={() => {
                setModal(!modal);
                _search('lifestyle');
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TextBold style={{fontSize: 17}}>편의 검색</TextBold>
            </Pressable>
          </View>
        </View>
      </Modal> */
}
