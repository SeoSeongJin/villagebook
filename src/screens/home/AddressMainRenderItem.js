// import {View, Text, Image, Pressable} from 'react-native';
// import React, {useState} from 'react';
// import colors from '../../styles/colors';
// import TextRegular from '../../component/text/TextRegular';
// import {useDispatch, useSelector} from 'react-redux';
// import {
//   setCurrentAdd,
//   setPostData,
//   setTrigger,
// } from '../../store/reducers/AddressReducer';
// import {useCustomMutation} from '../../hooks/useCustomMutation';
// import {customAlert} from '../../component/CustomAlert';
// import TextBold from '../../component/text/TextBold';

// const AddressMainRenderItem = ({data}) => {
//   const dispatch = useDispatch();
//   const {postData, currentAdd, trigger} = useSelector(
//     state => state.addressReducer,
//   );
//   const {userInfo} = useSelector(state => state.authReducer);
//   const {mutateSetMainAddr, mutateDeleteUserAddr} = useCustomMutation();
//   // console.log('postData', postData);
//   // console.log('data', data);

//   return (
//     <Pressable
//       onPress={() => {
//         if (currentAdd.ad_id !== data.ad_id) _setAdd();
//       }}
//       style={{
//         paddingVertical: 10,
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor:
//           currentAdd.ad_id === data.ad_id ? colors.mainBG3 : null,
//         paddingHorizontal: 22,
//       }}>
//       <View style={{marginRight: 20}}>
//         <Image
//           source={require('~/assets/ico_location.png')}
//           style={{width: 20, height: 20}}
//         />
//       </View>
//       <View style={{flex: 1, minHeight: 50, justifyContent: 'space-between'}}>
//         <TextBold style={{fontSize: 13, color: colors.fontColor2}}>
//           [{data.ad_zip}] {data.ad_addr1} {data.ad_addr2} {data.ad_addr3}
//         </TextBold>
//         <TextRegular style={{fontSize: 12, color: colors.fontColor2}}>
//           [{data.ad_zip}] {data.ad_jibeon} {data.ad_addr2} {data.ad_addr3}
//         </TextRegular>
//       </View>
//       {currentAdd?.ad_id !== data?.ad_id && (
//         <Pressable hitSlop={10} onPress={_deleteAddr}>
//           <Image
//             source={require('~/assets/pop_close.png')}
//             style={{width: 20, height: 20}}
//           />
//         </Pressable>
//       )}
//     </Pressable>
//   );
// };

// export default React.memo(AddressMainRenderItem);
