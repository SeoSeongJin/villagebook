import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useRef} from 'react';
import {FlatList, Text} from 'react-native';
import {Animated} from 'react-native';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import Header from '../../component/Header';
import FilterView from '../home/CategoryStore/FilterView';
import React from 'react';
import commonStyles from '../../styles/commonStyle';
import Category from '../../config/Category';
import StoreItems from '../home/CategoryStore/StoreItems';
import colors from '../../styles/colors';
import {
  setcurrentCategory,
  setcurrentFilter,
} from '../../store/reducers/CategoryReducer';
import CouponList from './CouponList';
import CouponFilterView from './CouponFilterView';
import {Pressable} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {Image} from 'react-native';
import {useState} from 'react';
import {Shadow} from 'react-native-shadow-2';
import TextSBold from '../../component/text/TextSBold';
import TextRegular from '../../component/text/TextRegular';
import {NavigationContainer} from '@react-navigation/native';
import {naviRef} from '../../navigator/MainStackNavigator';
import MainBanner from '../../component/MainBanner';
import BannerList from '../../config/BannerList';
import {useSelector} from 'react-redux';
import TextMedium from '../../component/text/TextMedium';

const Tab = createMaterialTopTabNavigator();

const CouponBookMy = ({navigation, route}) => {
  const {couponbookData} = useSelector(state => state.couponReducer);
  const data = couponbookData;
  const [tabIndex, setTabIndex] = useState('1');
  const tabRef = useRef(0);

  const layout = useWindowDimensions();

  const [filterCate, setFilterCate] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const _onPressCate = item => {
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
        <Header navigation={navigation} title="내 쿠폰함" />
      </View>
      <View
        style={{
          flexDirection: 'row',
          height: 40,
          borderBottomWidth: 1,
          borderColor: colors.borderColor,
        }}>
        <Pressable
          onPress={() => {
            setTabIndex('1');
          }}
          style={{
            flex: 1,
            backgroundColor: tabIndex === '1' ? colors.primary : 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TextMedium
            style={{
              color: tabIndex === '1' ? 'white' : colors.fontColorA2,
              fontSize: 15,
            }}>
            보유쿠폰
          </TextMedium>
        </Pressable>
        <Pressable
          onPress={() => {
            setTabIndex('2');
          }}
          style={{
            flex: 1,
            backgroundColor: tabIndex === '2' ? colors.primary : 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TextMedium
            style={{
              color: tabIndex === '2' ? 'white' : colors.fontColorA2,
              fontSize: 15,
            }}>
            완료 쿠폰
          </TextMedium>
        </Pressable>
      </View>

      {tabIndex === '1' ? (
        <>
          {/* 보유쿠폰 선택시
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
            </SafeAreaView>
          ) : (
            <CouponFilterView navigation={navigation} top={150} />
          )} */}

          {/* {isOpen && (
            <View style={{zIndex: 1000, marginTop: 10}}>
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
                      <TextSBold
                        style={{color: colors.fontColor2, fontSize: 16}}>
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
          )} */}
          {/* <SafeAreaView style={{position: 'absolute', zIndex: 300}}>
            <Pressable
              onPress={() => setIsOpen(!isOpen)}
              style={{
                top: 100,
                // right: 0,
                left: layout.width - 30,
                width: 30,
                height: 45,
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
          </SafeAreaView> */}
          <Tab.Navigator
            backBehavior="none"
            sceneContainerStyle={{
              flex: 1,
              backgroundColor: 'white',
              paddingTop: 45,
              // paddingHorizontal: 14,
              marginTop: 5,
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
                  if (props.state.index <= value.value)
                    tabRef.current = props.state.index;
                });
                let arr = [];
                const index = props.state.index;
                const tabWidth = props.getTabWidth(index);
                const _getWidth = idx => {
                  return props.getTabWidth(idx);
                };
                props.state.routes.map((item, idx) => {
                  if (idx === 0) arr.push(0);
                  else arr.push(_getWidth(idx - 1));
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
                // initialParams={{cate: 'lifestyle'
                // cate: item.ca_name,
                // ca_code: item.ca_code,
                // category: category,}}
              />
            ))}
          </Tab.Navigator>
        </>
      ) : (
        <>
          {/* 완료 쿠폰 선택시 */}
          {Platform.OS === 'ios' ? (
            <SafeAreaView
              style={{
                // flex: 1,
                position: 'absolute',
                // 헤더 버튼보다 낮도록 설정
                zIndex: 200,
                // width: 100,
                // height: 100,
              }}></SafeAreaView>
          ) : (
            <></>
          )}
          {isOpen && (
            <View style={{zIndex: 1000, marginTop: 10}}>
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
                      <TextSBold
                        style={{color: colors.fontColor2, fontSize: 16}}>
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
                top: 100,
                // right: 0,
                left: layout.width - 30,
                width: 30,
                height: 45,
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
              paddingTop: 10,
              // paddingHorizontal: 14,
              marginTop: 5,
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
                  if (props.state.index <= value.value)
                    tabRef.current = props.state.index;
                });
                let arr = [];
                const index = props.state.index;
                const tabWidth = props.getTabWidth(index);
                const _getWidth = idx => {
                  return props.getTabWidth(idx);
                };
                props.state.routes.map((item, idx) => {
                  if (idx === 0) arr.push(0);
                  else arr.push(_getWidth(idx - 1));
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
                // initialParams={{cate: 'lifestyle'
                // cate: item.ca_name,
                // ca_code: item.ca_code,
                // category: category,}}
              />
            ))}
          </Tab.Navigator>
        </>
      )}
    </SafeAreaView>
  );
};

export default CouponBookMy;
