import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../../styles/commonStyle';
import TextBold from '../../../component/text/TextBold';
import colors from '../../../styles/colors';
import DividerL from '../../../component/DividerL';
import {replaceString} from '../../../config/utils/Price';
import TextRegular from '../../../component/text/TextRegular';
import Receipt from '../../../component/Receipt';
import TextMedium from '../../../component/text/TextMedium';
import {useSelector} from 'react-redux';

const OrderFinish = ({navigation, route}) => {
  const layout = useWindowDimensions();
  const {orderResult} = useSelector(state => state.paymentReducer);

  const menuData = JSON.parse(
    orderResult.orderResultData.data.arrItems.od_menu_data,
  );
  const orderData = orderResult.orderResultData.data.arrItems;

  console.log('orderResult', orderResult);
  console.log('menuData', menuData);

  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} />
      <SafeAreaView
        edges={['bottom', 'left', 'right']}
        style={{
          ...commonStyles.safeAreaStyle,
          backgroundColor: colors.primary,
        }}>
        <ScrollView style={{backgroundColor: 'white'}}>
          <View
            style={{
              paddingHorizontal: 22,
              paddingTop: 20,
              paddingBottom: 100,
            }}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('~/assets/top_ic_map_on.png')}
                style={{width: 50, height: 50, marginBottom: 20}}
              />
              <TextBold style={{fontSize: 20, color: colors.fontColor2}}>
                주문이 완료되었습니다.
              </TextBold>
              {/* <DividerL style={{width: '100%', marginVertical: 20}} /> */}
              <View
                style={{
                  width: '100%',
                  height: 120,
                  backgroundColor: colors.inputBoxBG,
                  justifyContent: 'center',
                  borderRadius: 10,
                  padding: 10,
                  marginVertical: 10,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={{uri: orderData.store_logo}}
                    style={{width: 80, height: 80, borderRadius: 10}}
                  />
                  <View
                    style={{marginLeft: 10, justifyContent: 'space-evenly'}}>
                    <TextBold numberOfLines={1}>
                      {orderData.store_name}
                    </TextBold>
                    <TextRegular
                      style={{color: colors.fontColorA, fontSize: 12}}
                      numberOfLines={2}>
                      {orderData.od_it_name}
                    </TextRegular>
                  </View>
                </View>
              </View>
            </View>
            {menuData.savedItems?.map((item, index) => (
              <View
                key={index}
                style={{
                  borderBottomWidth: 1,
                  borderColor: colors.borderColor,
                  paddingBottom: 10,
                  paddingHorizontal: 10,
                }}>
                <View style={{alignItems: 'center', flex: 1}}>
                  <View style={{marginVertical: 10}}>
                    <TextBold style={{fontSize: 16, color: colors.primary}}>
                      {item.main.menuName}
                    </TextBold>
                  </View>
                  <View style={{flex: 1}}>
                    {item.main.option?.map((item2, index) => (
                      <View key={item2 + '_' + index}>
                        <TextRegular style={{color: colors.fontColorA}}>
                          {item2.name} : {item2.value}{' '}
                          {index + 1 !== item.main.option.length}
                        </TextRegular>
                      </View>
                    ))}
                  </View>
                </View>
                <View
                  style={{
                    marginVertical: 10,
                    alignItems: 'center',
                  }}>
                  <TextRegular style={{color: colors.fontColor2, fontSize: 12}}>
                    {'<추가선택>'}
                  </TextRegular>
                  <View style={{flex: 1}}>
                    {item.sub.length > 0 ? (
                      item.sub.map((item, index) => (
                        <View key={item + '_' + index}>
                          <TextRegular
                            style={{color: colors.fontColorA, fontSize: 12}}>
                            {item.itemCategory} : {item.itemName}
                          </TextRegular>
                        </View>
                      ))
                    ) : (
                      <TextRegular
                        style={{color: colors.fontColorA, fontSize: 12}}>
                        없음
                      </TextRegular>
                    )}
                  </View>
                </View>

                <View style={{marginTop: 10, alignSelf: 'flex-end'}}>
                  <TextBold style={{color: colors.fontColorA}}>
                    {replaceString(item.totalPrice)}원
                  </TextBold>
                </View>
              </View>
            ))}

            <Receipt orderResult={orderResult} />
          </View>
        </ScrollView>
        <View style={{flex: 1}}>
          <Pressable
            onPress={() => {
              navigation.navigate('CategoryView', {
                selectedCategory: 'lifestyle',
              });
              // navigation.navigate('Main');
            }}
            style={{
              height: 50,
              width: layout.width,
              backgroundColor: colors.primary,
              // marginBottom: 20,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 0,
              // top: layout.height - 50,
            }}>
            <TextMedium style={{color: 'white', fontSize: 17}}>
              메인화면으로 이동
            </TextMedium>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
};

export default OrderFinish;
