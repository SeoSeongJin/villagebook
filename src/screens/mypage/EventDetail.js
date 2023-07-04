import {View, Image, ScrollView, useWindowDimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../component/Header';
import commonStyles from '../../styles/commonStyle';
import TextBold from '../../component/text/TextBold';
import TextRegular from '../../component/text/TextRegular';
import colors from '../../styles/colors';
import dayjs from 'dayjs';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import Loading from '../../component/Loading';

const EventDetail = ({navigation, route}) => {
  const [HEIGHT, setHEIGHT] = useState({height: 0, rate: 0});
  const {mutateBoardDetail} = useCustomMutation();
  const [boardData, setBoardData] = useState();
  const routeData = route.params.data;
  const layout = useWindowDimensions();

  const _getBoardDetail = () => {
    const data = {
      bo_table: 'event',
      wr_id: routeData.wr_id,
    };
    mutateBoardDetail.mutate(data, {
      onSettled: e => {
        setBoardData(e.data.arrItems);
      },
    });
  };

  useEffect(() => {
    _getBoardDetail();
  }, []);

  //if (!boardData) return <Loading />;

  if(!boardData){
    return (
      <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
        <Header title={'이벤트'} navigation={navigation} showCart={true} />
        <ScrollView>
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                marginTop: '30%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TextRegular>이벤트가 등록되지 않았습니다.</TextRegular>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'이벤트'} navigation={navigation} showCart={true} />
      <ScrollView>
        <View
          style={{
            flex: 1,
            height: 70,
            paddingHorizontal: 22,
            paddingVertical: 10,
            justifyContent: 'space-between',
          }}>
          <TextBold style={{color: colors.fontColor2}}>
            {boardData.subject}
          </TextBold>
          <TextRegular style={{fontSize: 11, color: colors.fontColorA2}}>
            {boardData.datetime}
          </TextRegular>
        </View>
        {boardData?.pic.map((item, index) => (
          <Image
            key={index}
            source={{uri: item.file}}
            onLoad={e => {
              setHEIGHT({
                height: e.nativeEvent.source.height,
                rate: layout.width / e.nativeEvent.source.width,
              });
            }}
            style={{
              width: layout.width,
              height: HEIGHT.height ? HEIGHT.height * HEIGHT.rate : 100,
            }}
            resizeMode="contain"
          />
        ))}
        <View style={{paddingHorizontal: 22, paddingTop: 22}}>
          <TextRegular>{boardData.content}</TextRegular>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventDetail;
