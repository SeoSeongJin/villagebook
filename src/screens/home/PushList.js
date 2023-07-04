import dayjs from 'dayjs';
import React from 'react';
import {useEffect} from 'react';
import {useRef, useState} from 'react';
import {FlatList, Pressable, Text} from 'react-native';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import Header from '../../component/Header';
import TextBold from '../../component/text/TextBold';
import TextMedium from '../../component/text/TextMedium';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyle';
import PushLIstRenderItem from './PushLIstRenderItem';

const PushList = ({navigation}) => {
  const {userInfo} = useSelector(state => state.authReducer);
  const {mutateGetPushList} = useCustomMutation();
  const [pushList, setPushList] = useState([]);
  const [canMore, setCanMore] = useState(true);
  const count = useRef(0);

  const _getPushList = more => {
    if (more) {
      count.current += 30;
    }

    const data = {
      mt_id: userInfo.mt_id,
      item_count: count.current,
      limit_count: 30,
    };

    mutateGetPushList.mutate(data, {
      onSettled: res => {
        if (res.result === 'true') {
          const items = res.data.arrItems;
          // let temp = JSON.parse(JSON.stringify(pushList));
          // temp = temp.concat(items);
          // console.log('items', temp);
          setPushList(prev => prev.concat(items));
        } else setCanMore(!canMore);
      },
    });
  };

  useEffect(() => {
    _getPushList();
  }, []);

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'알림함'} navigation={navigation} />

      <FlatList
        data={pushList}
        keyExtractor={(item, idx) => idx}
        renderItem={item => <PushLIstRenderItem data={item.item} />}
        ListEmptyComponent={
          <View style={{padding: 22, alignItems: 'center'}}>
            <TextBold>알림이 없습니다</TextBold>
          </View>
        }
        onEndReached={() => {
          if (canMore) _getPushList(true);
        }}
        onEndReachedThreshold={0}
      />
    </SafeAreaView>
  );
};

export default PushList;
