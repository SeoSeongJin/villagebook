import {
  View,
  Text,
  Image,
  useWindowDimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import Header from '../../component/Header';
import FastImage from 'react-native-fast-image';
import colors from '../../styles/colors';
import {Pressable} from 'react-native';
import TextRegular from '../../component/text/TextRegular';
import TextBold from '../../component/text/TextBold';
import TextTitle from '../../component/text/TextTitle';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {FlatList} from 'react-native';
import {useRef} from 'react';
import Divider from '../../component/Divider';
import DividerL from '../../component/DividerL';
import {Shadow} from 'react-native-shadow-2';

const CommunityMain = ({navigation}) => {
  const dummyTopMenu = [
    '동네모임',
    '동네정보',
    '동네소식',
    '동네모임',
    '동네정보',
    '동네소식',
  ];

  const [input, setInput] = useState();
  const {mutateBoardList} = useCustomMutation();
  const [boardList, setBoardList] = useState([]);
  const [HEIGHT, setHEIGHT] = useState({height: 0, rate: 0});
  const layout = useWindowDimensions();
  const limitItem = useRef(0);

  const renderMenuItem = item => {
    const element = item.item;
    return (
      <View style={{marginRight: 15, alignItems: 'center'}}>
        {/*
        <View
          style={{
            width: 60,
            height: 60,

            borderRadius: 10,
            backgroundColor: colors.borderColor,
          }}></View>
        */}
        <TextRegular
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colors.borderColor,
            borderRadius: 0,
            backgroundColor: colors.borderColorWhite,
          }}>
          {element}
        </TextRegular>
      </View>
    );
  };

  const _getMore = () => {
    limitItem.current += 40;

    const data = {
      bo_table: 'areaboard',
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
      bo_table: 'areaboard',
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
          paddingHorizontal: 15,
          paddingVertical: 15,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            paddingVertical: 2,
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: 10,
            backgroundColor: colors.borderColorWhite,
          }}>
          <View
            style={{
              paddingBottom: 10,
              borderBottomWidth: 1,
              borderColor: colors.borderColor,
            }}>
            <Pressable
              onPress={() => {
                navigation.navigate('NoticeDetail', {data});
              }}
              style={{
                height: 30,
                paddingHorizontal: 10,
                paddingVertical: 0,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  marginRight: 0,
                }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      borderRadius: 5,
                      backgroundColor: colors.primary,
                      height: 20,
                      width: 56,
                    }}>
                    <TextRegular
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 2,
                        marginLeft: 9,
                        fontSize: 11,
                        color: colors.fontColorWhite,
                      }}>
                      동네질문
                    </TextRegular>
                  </View>
                  <View style={{flex: 1}}>
                    <TextBold
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color: colors.fontColorA,
                        fontSize: 13,
                        marginLeft: 5,
                      }}>
                      사직동{data.pic.length}
                    </TextBold>
                  </View>

                  <TextBold style={{fontSize: 12, color: colors.fontColorA}}>
                    {data.datetime_str}
                  </TextBold>
                </View>
              </View>
            </Pressable>
          </View>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              justifyContent: 'space-between',
            }}>
            <Pressable style={{paddingBottom: 10}}>
              {data?.pic.map((item, index) => (
                <FastImage
                  key={index}
                  source={{uri: item}}
                  style={{
                    borderRadius: 10,
                    alignSelf: 'center',
                    width: layout.width - 54,
                    height: 200,
                    //height: HEIGHT.height ? HEIGHT.height * HEIGHT.rate : 120,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ))}
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate('CommunityDetail', {data});
              }}>
              <Text numberOfLines={3} style={{lineHeight: 22}}>
                {data.content}
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}>
            <Text style={{color: colors.fontColorA}}>댓글 {data.wr_hit}</Text>
            <Text style={{paddingLeft: 20, color: colors.fontColorA}}>
              좋아요 {data.wr_good}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  useEffect(() => {
    _getBoardList();
  }, []);

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header navigation={navigation} showLogo={true} />
      <Pressable
        onPress={() => {}}
        style={{
          marginHorizontal: 14,
          height: 50,
          borderWidth: 2,
          borderColor: colors.primary,
          borderRadius: 10,
          justifyContent: 'center',
          paddingHorizontal: 10,
        }}>
        <TextRegular style={{color: '#c7c7c7'}}>
          동네북을 펄쳐주세요
        </TextRegular>
      </Pressable>
      <View
        style={{
          height: 65,
          marginTop: 20,
          backgroundColor: colors.borderColor,
        }}>
        <FlatList
          horizontal={true}
          data={dummyTopMenu}
          ListHeaderComponent={() => <></>}
          renderItem={item => renderMenuItem(item)}
          contentContainerStyle={{
            paddingHorizontal: 14,
            marginTop: 15,
          }}
          keyExtractor={(item, index) => index}
          style={{height: 0}}
        />
      </View>
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

      <Shadow
        distance={4}
        offset={[0, 1]}
        style={{width: 90, height: 40}}
        containerStyle={{position: 'absolute', bottom: 30, right: 14}}>
        <Pressable
          hitSlop={5}
          onPress={() => {
            navigation.navigate('CommunityWrite');
          }}
          style={{
            borderRadius: 40,
            width: 90,
            height: 40,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TextRegular style={{color: 'white', fontSize: 17}}>
            글쓰기
          </TextRegular>
        </Pressable>
      </Shadow>
    </SafeAreaView>
  );
};

export default CommunityMain;
