// import {View, Text, Image} from 'react-native';
// import React from 'react';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import commonStyles from '../../styles/commonStyle';
// import {useEffect} from 'react';
// import {useIsFocused} from '@react-navigation/native';
// import {useCustomMutation} from '../../hooks/useCustomMutation';
// import {useSelector} from 'react-redux';
// import {useState} from 'react';
// import TextEBold from '../../component/text/TextEBold';
// import colors from '../../styles/colors';
// import {Pressable} from 'react-native';
// import {_guestAlert} from '../../config/utils/modules';
// import {ScrollView} from 'react-native';
// import TextRegular from '../../component/text/TextRegular';
// import TextSBold from '../../component/text/TextSBold';
// import {FlatList} from 'react-native';
// import TextBold from '../../component/text/TextBold';
// import {Platform} from 'react-native';
// import {Shadow} from 'react-native-shadow-2';
// import TextLight from '../../component/text/TextLight';
// import TextMedium from '../../component/text/TextMedium';
// import {useWindowDimensions} from 'react-native';
// import {Alert} from 'react-native';

// // onPress={() => {
// //     if (!isGuest && userInfo) {
// //       navigation.navigate('AddressMain');
// //     } else {
// //       _guestAlert(navigation);
// //     }
// //   }}

// const CouponBookMain = ({navigation, route}) => {
//   const {mutateGetAddress} = useCustomMutation();
//   const {userInfo, isGuest} = useSelector(state => state.authReducer);
//   const isFocused = useIsFocused();

//   const [addr, setAddr] = useState();
//   const [filterCate, setFilterCate] = useState('전체');
//   const [filterSub, setFilterSub] = useState('추천순');
//   const [isOpen, setIsOpen] = useState(false);
//   const [cateList, setCateList] = useState([]);
//   const [couponList, setCouponList] = useState([
//     '카페 드 비니',
//     '주니뷰티',
//     '백색소음',
//     '개미상회',
//     '카페 드 비니',
//     '주니뷰티',
//     '백색소음',
//     '개미상회',
//     '카페 드 비니',
//     '주니뷰티',
//     '백색소음',
//     '개미상회',
//   ]);

//   const data = route.params?.data;

//   const filterList = [
//     '추천순',
//     '인기순',
//     '기간 마감 임박 순',
//     '개수 마감 임박 순',
//   ];

//   const _getAddr = () => {
//     const data = {
//       mt_id: userInfo.mt_id,
//     };

//     mutateGetAddress.mutate(data, {
//       onSuccess: e => {
//         if (e.result === 'true') {
//           let tempAddr =
//             e.data.arrItems[0].ad_addr1 +
//             e.data.arrItems[0].ad_addr2 +
//             e.data.arrItems[0].ad_addr3;
//           setAddr(tempAddr);
//         } else setAddr('주소설정');
//         console.log('mutateGetAddress', e);
//       },
//     });
//   };

//   const _onPressCate = item => {
//     console.log('item', item);
//     setFilterCate(item.ca_name);
//   };

//   const _onPressSub = item => {
//     setFilterSub(item);
//   };

//   const _openFilter = () => {
//     setIsOpen(!isOpen);
//   };

//   const renderItem = item => {
//     return (
//       <Shadow distance={5} offset={[0, 2]} style={{width: '100%'}}>
//         <View
//           style={{
//             borderWidth: 1,
//             borderColor: colors.primary,
//             borderRadius: 10,
//             height: 100,
//             backgroundColor: 'white',
//             marginBottom: 15,
//             flexDirection: 'row',
//             paddingVertical: 10,
//             // alignItems: 'center',
//             paddingHorizontal: 10,
//           }}>
//           <Image
//             source={require('~/assets/no_use_img.png')}
//             style={{height: 80, width: 80}}
//             resizeMode="contain"
//           />
//           <View
//             style={{
//               flex: 1,
//               marginLeft: 10,
//               justifyContent: 'space-between',
//             }}>
//             <TextMedium style={{color: colors.fontColor3}}>
//               {item.item}
//             </TextMedium>
//             <TextBold
//               style={{fontSize: 16, color: colors.fontColor2}}
//               numberOfLines={2}>
//               {item.item} 50% 할인쿠폰
//             </TextBold>
//             <TextLight style={{color: colors.fontColorA}}>
//               {'2022년 12월 31일까지'}
//             </TextLight>
//           </View>
//           <View
//             style={{
//               width: 1,
//               height: 60,
//               backgroundColor: colors.primary,
//               alignSelf: 'center',
//               marginRight: 5,
//             }}
//           />
//           <View style={{justifyContent: 'center', alignItems: 'center'}}>
//             <Image
//               source={require('~/assets/down_coupon.png')}
//               style={{width: 45, height: 45}}
//               resizeMode="contain"
//             />
//             <TextLight style={{fontSize: 12}}>
//               {item.index + 1}개 남음
//             </TextLight>
//           </View>
//         </View>
//       </Shadow>
//     );
//   };

//   const layout = useWindowDimensions();
//   const WIDTH = layout.width - 28;
//   const num = data.length % 4;
//   const convert = index => {
//     // if(index > data.length - 4)    )
//     if (num !== 0) {
//       return layout.width / 5 / 5;
//       // if (data.length - index < 4 && data.length - index > 0) {
//       // }
//     }
//   };
//   const _popData = () => {
//     let temp = data;
//     if (temp.length > 1 && filterCate) {
//       temp.pop();
//       temp.pop();
//     }
//     return temp;
//   };

//   useEffect(() => {
//     setCateList(data);
//   }, []);

//   const renderOpenItem = item => {
//     const items = item.item;
//     // console.log('items', items);
//     return (
//       <Pressable
//         hitSlop={3}
//         onPress={() => {
//           _onPressCate(items);
//         }}
//         style={{
//           // flex: windo,
//           width: layout.width / 4.6,
//           height: 25,
//           alignItems: 'center',
//           justifyContent: 'center',
//           paddingHorizontal: 3,
//           borderWidth: 1,
//           borderColor:
//             items.ca_name === filterCate ? colors.primary : colors.colorE3,
//           backgroundColor:
//             items.ca_name === filterCate ? colors.primary : 'white',
//           borderRadius: 30,
//           marginRight: 7,
//         }}>
//         <TextRegular
//           style={{
//             color: items.ca_name === filterCate ? 'white' : colors.fontColor2,
//             fontSize: 13,
//           }}>
//           {items.ca_name}
//         </TextRegular>
//       </Pressable>
//     );
//   };

//   useEffect(() => {
//     _getAddr();
//   }, [isFocused]);

//   return (
//     <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
//       {/*
//         쿠폰북 헤더
//         */}
//       <View
//         style={{
//           borderBottomWidth: 1,
//           paddingBottom: 15,
//           borderColor: colors.borderColor,
//         }}>
//         <View
//           style={{
//             marginTop: 15,
//             marginHorizontal: 14,
//             flexDirection: 'row',
//             alignItems: 'center',
//           }}>
//           <Image
//             source={require('~/assets/ico_location.png')}
//             style={{
//               width: 19,
//               height: 19,
//               marginRight: 8,
//               tintColor: colors.primary,
//             }}
//           />
//           <Pressable
//             hitSlop={10}
//             onPress={() => {
//               if (!isGuest && userInfo) {
//                 navigation.navigate('AddressMain');
//               } else {
//                 _guestAlert(navigation);
//               }
//             }}
//             style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
//             <View style={{marginLeft: 0, marginRight: 3}}>
//               <TextEBold
//                 numberOfLines={1}
//                 style={{
//                   fontSize: 15,
//                   color: colors.fontColor2,
//                 }}>
//                 {addr}
//               </TextEBold>
//             </View>
//             <Image
//               source={require('~/assets/down_arrow.png')}
//               style={{width: 17, height: 17}}
//             />
//           </Pressable>

//           {/* <Pressable
//             hitSlop={10}
//             style={{marginRight: 12}}
//             onPress={() => {
//               Alert.alert('', '아직 준비중입니다!');
//             }}>
//             <Image
//               source={require('~/assets/ico_search.png')}
//               style={{width: 23, height: 23, tintColor: colors.primary}}
//             />
//           </Pressable>

//           <Pressable
//             hitSlop={10}
//             onPress={() => {
//               Alert.alert('', '아직 준비중입니다!');
//             }}>
//             <Image
//               source={require('~/assets/bar.png')}
//               style={{width: 27, height: 27, tintColor: colors.primary}}
//             />
//           </Pressable> */}
//         </View>
//       </View>
//       {/*
//         END 쿠폰북 헤더
//         */}
//       {/*
//        카테고리 필터 스크롤
//         */}
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           zIndex: Platform.OS === 'ios' ? 1000 : undefined,
//           marginTop: 10,
//         }}>
//         {!isOpen ? (
//           <>
//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{marginHorizontal: 14}}>
//               {data.map(
//                 (item, index) =>
//                   index < data.length - 2 && (
//                     <Pressable
//                       hitSlop={3}
//                       key={item.ca_id}
//                       onPress={() => {
//                         _onPressCate(item);
//                       }}
//                       style={{
//                         height: 25,
//                         borderWidth: 1,
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         paddingHorizontal: 13,
//                         borderColor:
//                           item.ca_name === filterCate
//                             ? colors.primary
//                             : colors.colorE3,
//                         backgroundColor:
//                           item.ca_name === filterCate
//                             ? colors.primary
//                             : 'white',
//                         borderRadius: 30,
//                         marginRight: 10,
//                       }}>
//                       <TextRegular
//                         style={{
//                           color:
//                             item.ca_name === filterCate
//                               ? 'white'
//                               : colors.fontColor2,
//                         }}>
//                         {item.ca_name}
//                       </TextRegular>
//                     </Pressable>
//                   ),
//               )}
//             </ScrollView>
//             <Pressable
//               hitSlop={5}
//               style={{marginRight: 14}}
//               onPress={() => {
//                 _openFilter();
//               }}>
//               <Image
//                 source={require('~/assets/down_arrow.png')}
//                 style={{width: 23, height: 23}}
//                 resizeMode="contain"
//               />
//             </Pressable>
//           </>
//         ) : (
//           <View style={{zIndex: 1000}}>
//             <FlatList
//               data={cateList}
//               keyExtractor={(item, index) => index}
//               renderItem={item => renderOpenItem(item)}
//               numColumns={4}
//               style={{
//                 flex: 1,
//                 position: 'absolute',
//                 backgroundColor: 'white',
//                 width: '100%',
//               }}
//               columnWrapperStyle={{
//                 flex: 1,
//                 marginBottom: 7,
//                 marginLeft: 14,
//                 zIndex: 1000,
//               }}
//               ListFooterComponent={
//                 <Shadow distance={1} offset={[0, 1]} style={{width: '100%'}}>
//                   <Pressable
//                     onPress={() => {
//                       setIsOpen(!isOpen);
//                     }}
//                     style={{
//                       backgroundColor: 'white',
//                       width: '100%',
//                       height: 60,
//                       marginBottom: 10,
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       borderTopWidth: 1,
//                       borderBottomWidth: 1,
//                       borderColor: colors.borderColor,
//                       flexDirection: 'row',
//                     }}>
//                     <TextSBold style={{color: colors.fontColor2, fontSize: 16}}>
//                       접어두기
//                     </TextSBold>
//                     <Image
//                       source={require('~/assets/down_arrow.png')}
//                       style={{
//                         width: 26,
//                         height: 26,
//                         transform: [{rotate: '180deg'}],
//                       }}
//                       resizeMode="contain"
//                     />
//                   </Pressable>
//                 </Shadow>
//               }
//             />
//           </View>
//         )}
//       </View>

//       {/* <View style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1}}>
//             {data.map((item, index) => (
//               <View
//                 style={{
//                   flex: 1 / 4,
//                   marginRight: 5,
//                   height: 60,
//                   backgroundColor: 'teal',
//                 }}></View>
//             ))}
//           </View> */}
//       {/*
//         END 카테고리 필터 스크롤
//         */}

//       {/*
//       필터 스크롤
//       */}
//       {!isOpen && (
//         <>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={{
//               marginTop: 10,
//               marginBottom: 10,
//               marginHorizontal: 14,
//               height: 25,
//             }}
//             contentContainerStyle={{height: 25}}>
//             {filterList.map((item, index) => (
//               <Pressable
//                 hitSlop={3}
//                 key={item + index}
//                 onPress={() => {
//                   _onPressSub(item);
//                 }}
//                 style={{
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   marginRight: 15,
//                   flexDirection: 'row',
//                 }}>
//                 <View
//                   style={{
//                     width: 6,
//                     height: 6,
//                     borderRadius: 6 / 2,
//                     backgroundColor:
//                       item === filterSub ? colors.primary : colors.fontColorA,
//                     marginRight: 5,
//                   }}
//                 />
//                 {item === filterSub ? (
//                   <TextSBold
//                     style={{
//                       color:
//                         item === filterSub
//                           ? colors.fontColor2
//                           : colors.fontColorA,
//                     }}>
//                     {item}
//                   </TextSBold>
//                 ) : (
//                   <TextRegular
//                     style={{
//                       color:
//                         item === filterSub
//                           ? colors.fontColor2
//                           : colors.fontColorA,
//                     }}>
//                     {item}
//                   </TextRegular>
//                 )}
//               </Pressable>
//             ))}
//           </ScrollView>
//         </>
//       )}

//       <FlatList
//         data={[]}
//         overScrollMode={'never'}
//         keyExtractor={(item, index) => index}
//         showsVerticalScrollIndicator={false}
//         renderItem={item => renderItem(item)}
//         contentContainerStyle={{
//           paddingTop: 10,
//           paddingHorizontal: 14,
//           paddingBottom: 20,
//         }}
//         ListEmptyComponent={
//           !isOpen && (
//             <View style={{alignItems: 'center', marginBottom: '60%'}}>
//               <Image
//                 source={require('~/assets/no_coupon.png')}
//                 style={{height: layout.width * 0.7}}
//                 resizeMode="contain"
//               />
//               {/* <TextBold style={{fontSize: 33}}>아직 준비중입니다!</TextBold> */}
//             </View>
//           )
//         }
//       />
//       {/* <Shadow
//         distance={4}
//         offset={[0, 1]}
//         style={{width: 90, height: 40}}
//         containerStyle={{position: 'absolute', bottom: 30, right: 14}}>
//         <Pressable
//           hitSlop={5}
//           onPress={() => {
//             Alert.alert('', '아직 준비중입니다!');
//           }}
//           style={{
//             borderRadius: 40,
//             width: 90,
//             height: 40,
//             backgroundColor: colors.primary,
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//           <TextRegular style={{color: 'white', fontSize: 17}}>
//             지도보기
//           </TextRegular>
//         </Pressable>
//       </Shadow> */}
//       {/*
//       END 필터 스크롤
//       */}
//     </SafeAreaView>
//   );
// };

// export default CouponBookMain;
