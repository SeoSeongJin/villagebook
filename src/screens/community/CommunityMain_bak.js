import {View, Text} from 'react-native';
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

  const limitItem = useRef(0);

  const renderItem = item => {
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
      bo_table: 'notice',
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
      bo_table: 'notice',
      item_count: 0,
      limit_count: 40,
    };
    mutateBoardList.mutate(data, {
      onSuccess: e => {
        if (e.result === 'true' && e.data.arrItems.length > 0)
          setBoardList(e.data.arrItems);
        else setBoardList([]);
        console.log('e', e);
      },
    });
  };

  const renderItemDetail = item => {
    const data = item.item;
    return (
      <Pressable
        onPress={() => {
          navigation.navigate('NoticeDetail', {data});
        }}
        style={{
          height: 45,
          paddingHorizontal: 15,
          paddingVertical: 10,
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
                borderRadius: 12,
                backgroundColor: colors.primary,

                height: 20,
                width: 40,
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
                HOT
              </TextRegular>
            </View>
            <View style={{flex: 1}}>
              <TextBold
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: colors.fontColor2,
                  fontSize: 13,
                  marginLeft: 5,
                }}>
                {data.subject}
              </TextBold>
            </View>

            <TextBold style={{fontSize: 12, color: colors.fontColorA}}>
              120
            </TextBold>
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
          renderItem={item => renderItem(item)}
          contentContainerStyle={{
            paddingHorizontal: 14,
            marginTop: 15,
          }}
          keyExtractor={(item, index) => index}
          style={{height: 0}}
        />
      </View>

      <View style={{height: 195, marginTop: 10}}>
        <FlatList
          data={boardList}
          ListEmptyComponent={
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <TextRegular>게시글이 등록되지 않았습니다.</TextRegular>
            </View>
          }
          ListHeaderComponent={() => (
            <View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 22,
                  paddingVertical: 10,
                }}>
                <TextTitle>인기게시물</TextTitle>
              </View>
              <View
                style={{height: 1, backgroundColor: colors.borderColor}}></View>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{height: 1, backgroundColor: colors.borderColor}}></View>
          )}
          renderItem={item => renderItemDetail(item)}
          keyExtractor={(item, index) => index}
          onEndReached={() => {
            if (boardList.length % 40 === 0) {
              _getMore();
            }
          }}
        />
      </View>
      <DividerL />
      <View
        style={{height: '100%', paddingHorizontal: 15, paddingVertical: 15}}>
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
                      사직동
                    </TextBold>
                  </View>

                  <TextBold style={{fontSize: 12, color: colors.fontColorA}}>
                    5분전
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
            <FastImage
              style={{
                width: '100%',
                height: 200,
                borderRadius: 5,
                marginBottom: 10,
              }}
              source={{uri: 'https://unsplash.it/400/400?image=1'}}
              resizeMode={FastImage.resizeMode.cover}
            />

            <Text>미스트 10개 공구 같이하실분?????</Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}>
            <Text style={{color: colors.fontColorA}}>댓글 6</Text>
            <Text style={{paddingLeft: 20, color: colors.fontColorA}}>
              좋아요 38
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CommunityMain;
