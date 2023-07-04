import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useRef} from 'react';
import {FlatList, Text} from 'react-native';
import {Animated} from 'react-native';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../component/Header';
import React from 'react';
import commonStyles from '../../styles/commonStyle';
import colors from '../../styles/colors';
import CouponList from './CouponList';
import CouponFilterView from './CouponFilterView';
import {Pressable} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {Image} from 'react-native';
import {useState} from 'react';
import {Shadow} from 'react-native-shadow-2';
import TextSBold from '../../component/text/TextSBold';
import TextRegular from '../../component/text/TextRegular';
import {naviRef} from '../../navigator/MainStackNavigator';
import MainBanner from '../../component/MainBanner';
import BannerList from '../../config/BannerList';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {useEffect} from 'react';

const Tab = createMaterialTopTabNavigator();

const CouponBookMain = ({navigation, route}) => {
  const data = route.params?.data;
  console.log('data', data);

  const tabRef = useRef(0);

  const layout = useWindowDimensions();

  const [filterCate, setFilterCate] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const _onPressCate = item => {
    console.log('item', Tab.na);
    setFilterCate(item.ca_name);
  };

  const renderOpenItem = item => {
    const items = item.item;
    // console.log('items', items);
    return (
      <Pressable
        hitSlop={3}
        onPress={() => {
          _onPressCate(items);
          setIsOpen(!isOpen);
          naviRef.current.navigate(items.ca_name);
          //   setInit(items.ca_name);
        }}
        style={{
          // flex: windo,
          width: layout.width / 4.6,
          height: 25,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 3,
          borderWidth: 1,
          borderColor:
            items.ca_name === filterCate ? colors.primary : colors.colorE3,
          backgroundColor:
            items.ca_name === filterCate ? colors.primary : 'white',
          borderRadius: 30,
          marginRight: 7,
        }}>
        <TextRegular
          style={{
            color: items.ca_name === filterCate ? 'white' : colors.fontColor2,
            fontSize: 13,
          }}>
          {items.ca_name}
        </TextRegular>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      edges={['left', 'right', 'top']}
      style={{...commonStyles.safeAreaStyle}}>
      <View style={{zIndex: 2000}}>
        <Header navigation={navigation} title="쿠폰북" isSearch={true} />
      </View>

      {Platform.OS === 'ios' ? (
        <SafeAreaView
          style={{
            // flex: 1,
            position: 'absolute',
            // 헤더 버튼보다 낮도록 설정
            zIndex: 200,
            // width: 100,
            // height: 100,
          }}>
          <CouponFilterView />
          {/* <MainBanner
            navigation={navigation}
            style={{
              marginBottom: 17,
            }}
            position={BannerList['lifestyle']}
          /> */}
        </SafeAreaView>
      ) : (
        <>
          <CouponFilterView navigation={navigation} />
          {/* <View style={{position: 'absolute', top: 155, zIndex: 200}}>
            <MainBanner
              navigation={navigation}
              style={{
                marginBottom: 17,
              }}
              position={BannerList['lifestyle']}
            />
          </View> */}
        </>
      )}

      {isOpen && (
        <View style={{zIndex: 1000}}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index}
            renderItem={item => renderOpenItem(item)}
            numColumns={4}
            style={{
              flex: 1,
              position: 'absolute',
              backgroundColor: 'white',
              zIndex: 100,
              width: '100%',
            }}
            columnWrapperStyle={{
              flex: 1,
              marginBottom: 7,
              marginLeft: 14,
            }}
            ListFooterComponent={
              <Shadow distance={1} offset={[0, 1]} style={{width: '100%'}}>
                <Pressable
                  onPress={() => setIsOpen(!isOpen)}
                  style={{
                    backgroundColor: 'white',
                    width: '100%',
                    height: 60,
                    marginBottom: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: colors.borderColor,
                    flexDirection: 'row',
                  }}>
                  <TextSBold style={{color: colors.fontColor2, fontSize: 16}}>
                    접어두기
                  </TextSBold>
                  <Image
                    source={require('~/assets/down_arrow.png')}
                    style={{
                      width: 26,
                      height: 26,
                      transform: [{rotate: '180deg'}],
                    }}
                    resizeMode="contain"
                  />
                </Pressable>
              </Shadow>
            }
          />
        </View>
      )}
      <SafeAreaView style={{position: 'absolute', zIndex: 300}}>
        <Pressable
          onPress={() => setIsOpen(!isOpen)}
          style={{
            top: 55,
            // right: 0,
            left: layout.width - 30,
            width: 30,
            height: 50,
            // zIndex: ,
            alignItems: 'center',
            backgroundColor: 'white',
            justifyContent: 'center',
            // position: 'absolute',
          }}>
          <Image
            source={require('~/assets/down_arrow.png')}
            style={{width: 20, height: 20}}
            resizeMode={'contain'}
          />
        </Pressable>
      </SafeAreaView>
      <Tab.Navigator
        backBehavior="none"
        sceneContainerStyle={{
          flex: 1,
          backgroundColor: 'white',
          paddingTop: 45,
          // paddingHorizontal: 14,
          // marginTop: 160,
        }}
        // style={{flex: 1}}
        screenOptions={({route}) => ({
          lazy: true,
          tabBarStyle: {
            paddingLeft: 14,
            paddingRight: 30,
            // marginRight: 40,
          },
          tabBarLabel: props => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                // marginRight: 30,
              }}>
              <Text
                style={{
                  fontFamily: 'Pretendard-Bold',
                  color: props.focused ? colors.primary : colors.fontColor2,
                }}>
                {route.name}
              </Text>
            </View>
          ),
          tabBarScrollEnabled: true,
          tabBarItemStyle: {
            // flexGrow: 2,
            zIndex: 300,
            width: 'auto',
            // marginRight: 30,
          },
          tabBarIndicatorStyle: {
            height: 30,
          },
          tabBarIndicatorContainerStyle: {
            // justifyContent: 'center',
            justifyContent: 'flex-end',
            paddingLeft: 14,
            zIndex: 300,
          },
          tabBarIndicator: props => {
            props.position.addListener(value => {
              if (props.state.index <= value.value) {
                tabRef.current = props.state.index;
              }
            });
            let arr = [];
            const index = props.state.index;
            const tabWidth = props.getTabWidth(index);
            const _getWidth = idx => {
              return props.getTabWidth(idx);
            };
            props.state.routes.map((item, idx) => {
              if (idx === 0) {
                arr.push(0);
              } else {
                arr.push(_getWidth(idx - 1));
              }
            });

            const _getToValue = idx => {
              let temp = 0;
              for (let i = 0; i <= idx; i++) {
                temp += arr[i];
              }
              return temp;
            };
            let animation = new Animated.Value(_getToValue(tabRef.current));
            Animated.spring(animation, {
              toValue: _getToValue(index),
              duration: 800,
              friction: 10,
              tension: 20,
              useNativeDriver: true,
            }).start();
            return (
              <>
                <Animated.View
                  style={{
                    transform: [{translateX: animation}],
                    width: tabWidth * 0.9,
                    marginHorizontal: tabWidth * 0.05,
                    backgroundColor: colors.primary,
                    // height: 25,
                    height: 3,
                    // borderRadius: 20,
                  }}
                />
              </>
            );
          },
        })}>
        {data.map((item, index) => (
          <Tab.Screen
            key={index}
            name={item.ca_name}
            component={CouponList}
            // 코드값으로 불러오기
            initialParams={{
              cate: item.ca_name,
              ca_code: item.ca_code,
              category: 'lifestyle',
              isMain: true,
            }}
          />
        ))}
      </Tab.Navigator>
      <Shadow
        distance={4}
        offset={[0, 1]}
        style={{width: 90, height: 40}}
        containerStyle={{position: 'absolute', bottom: 30, right: 14}}>
        <Pressable
          hitSlop={5}
          onPress={() => {
            navigation.navigate('CouponBookMap');
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
            지도보기
          </TextRegular>
        </Pressable>
      </Shadow>
    </SafeAreaView>
  );
};

export default CouponBookMain;
