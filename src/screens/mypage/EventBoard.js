import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  FlatList,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import commonStyles from '../../styles/commonStyle';
import Header from '../../component/Header';
import colors from '../../styles/colors';
import {render} from 'react-dom';
import Divider from '../../component/Divider';
import TextRegular from '../../component/text/TextRegular';
import TextBold from '../../component/text/TextBold';
import DividerL from '../../component/DividerL';
import dayjs from 'dayjs';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import Loading from '../../component/Loading';
import {useRef} from 'react';

const EventBoard = ({navigation}) => {
  const [input, setInput] = useState();
  const {mutateBoardList} = useCustomMutation();
  const [boardList, setBoardList] = useState([]);

  const limitItem = useRef(0);

  const _getMore = () => {
    limitItem.current += 40;

    const data = {
      bo_table: 'event',
      item_count: limitItem.current,
      limit_count: 40,
    };
    mutateBoardList.mutate(data, {
      onSuccess: e => {
        if (e.result === 'true' && e.data.arrItems.length > 0) {
          const temp = e.data.arrItems;
          let origin = JSON.parse(JSON.stringify(boardList));
          console.log('originnnnn', origin);
          origin = origin.concat(temp);
          console.warn('origin', origin);
          setBoardList(origin);
        }
        console.log('e', e);
      },
    });
  };

  const _getBoardList = () => {
    const data = {
      bo_table: 'event',
      item_count: 0,
      limit_count: 40,
    };
    mutateBoardList.mutate(data, {
      onSuccess: e => {
        if (e.result === 'true' && e.data.arrItems.length > 0) {
          setBoardList(e.data.arrItems);
          console.log('original', e.data.arrItems);
        } else setBoardList([]);
      },
    });
  };

  const renderItem = item => {
    const data = item.item;

    return (
      <Pressable
        onPress={() => {
          navigation.navigate('EventDetail', {data});
        }}
        style={{
          height: 70,
          paddingHorizontal: 22,
          paddingVertical: 10,
          justifyContent: 'space-between',
        }}>
        <TextBold style={{color: colors.fontColor2}}>{data.subject}</TextBold>
        <TextRegular style={{fontSize: 11, color: colors.fontColorA2}}>
          {data.datetime}
        </TextRegular>
      </Pressable>
    );
  };

  useEffect(() => {
    _getBoardList();
  }, []);

  // if (mutateBoardList.isLoading) return <Loading />;

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'이벤트'} navigation={navigation} showCart={true} />
      <FlatList
        data={boardList}
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 22,
            }}>
            <TextRegular>이벤트가 등록되지 않았습니다.</TextRegular>
          </View>
        }
        ListHeaderComponent={() => (
          <>
            {/* <View
              style={{
                paddingHorizontal: 22,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TextInput
                placeholder="제목으로 검색해주세요"
                style={{
                  flex: 1,
                  height: 50,
                  borderWidth: 1,
                  borderColor: colors.borderColor,
                  borderRadius: 7,
                  paddingLeft: 20,
                  paddingRight: 40,
                }}></TextInput>
              <Image
                source={require('~/assets/ico_search.png')}
                style={{
                  position: 'absolute',
                  right: 36,
                  width: 20,
                  height: 20,
                  tintColor: colors.fontColor2,
                }}
              />
            </View>
            <DividerL /> */}
          </>
        )}
        ItemSeparatorComponent={() => (
          <View style={{height: 1, backgroundColor: colors.borderColor}}></View>
        )}
        renderItem={item => renderItem(item)}
        keyExtractor={(item, index) => index}
        onEndReached={() => {
          if (boardList.length % 40 === 0) _getMore();
        }}
      />
    </SafeAreaView>
  );
};

export default EventBoard;
