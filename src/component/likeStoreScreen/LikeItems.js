// import {
//   View,
//   Text,
//   ScrollView,
//   FlatList,
//   useWindowDimensions,
//   Image,
//   Pressable,
// } from 'react-native';
// import React, {useState} from 'react';
// import FastImage from 'react-native-fast-image';
// import TextMedium from '../text/TextMedium';
// import ReviewSimple2 from '../reviews/ReviewSimple2';
// import colors from '../../styles/colors';
// import TextRegular from '../text/TextRegular';
// import Chip from '../Chip';
// import Dot from '../Dot';
// import TextBold from '../text/TextBold';
// import RenderItem from './RenderItem';

// // 2.1 : 1
// const LikeItems = ({data, navigation}) => {
//   return (
//     <View style={{flex: 1}}>
//       <FlatList
//         ListHeaderComponent={() => (
//           <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}></View>
//         )}
//         data={data}
//         re
//         ListEmptyComponent={
//           <View
//             style={{
//               alignItems: 'center',
//               justifyContent: 'center',
//               marginVertical: 25,
//             }}>
//             <TextBold>찜내역이 없습니다.</TextBold>
//           </View>
//         }
//         showsVerticalScrollIndicator={false}
//         renderItem={item => <RenderItem item={item} navigation={navigation} />}
//         keyExtractor={(item, index) => index}
//         onEndReached={() => {}}
//       />
//     </View>
//   );
// };

// export default LikeItems;

{
  /* {remove && (
              <Pressable
                onPress={() => {
                  setRemove(!remove);
                }}
                style={{
                  width: 80,
                  height: 30,
                  backgroundColor: colors.primary,
                  marginRight: 10,
                  marginVertical: 10,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TextRegular style={{color: 'white'}}>선택 삭제</TextRegular>
              </Pressable>
            )} */
}
{
  /* <Pressable
              onPress={() => {
                setRemove(!remove);
              }}
              style={{
                width: 52,
                height: 30,
                backgroundColor: colors.primary,
                marginVertical: 10,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TextRegular style={{color: 'white'}}>
                {remove ? '취소' : '삭제'}
              </TextRegular>
            </Pressable> */
}
