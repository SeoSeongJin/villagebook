import {View, Text, Image} from 'react-native';
import React, {useState} from 'react';
import colors from '../../styles/colors';
import {Pressable} from 'react-native';
import TextRegular from '../../component/text/TextRegular';
import {replaceString} from '../../config/utils/Price';
import {useDispatch, useSelector} from 'react-redux';
import {
  removeSubMenu,
  setMainRequired,
  setSubMenu,
} from '../../store/reducers/CartReducer';
import Loading from '../../component/Loading';

const OptionRenderItem = ({item, data}) => {
  const cartStore = useSelector(state => state.cartReducer);
  const [check, setCheck] = useState(false);
  const dispatch = useDispatch();
  const item2 = item.item;
  // console.log('item2,', item2);
  // console.log('item', item);
  // console.log('cartStore requiredCount', cartStore.requiredCount);
  // console.log('cartStore selected', cartStore.selectedMainOption);

  // return <Loading />;
  return (
    <View
      style={{
        borderColor: colors.borderColor,
        marginVertical: 15,
      }}>
      <View
        style={{
          paddingHorizontal: 22,
        }}>
        <Pressable
          hitSlop={10}
          onPress={() => {
            setCheck(!check);
            if (item.section.required) {
              {
                // console.log('cartStore', cartStore);
                dispatch(
                  setMainRequired({
                    index: item.section.option_idx - 1,
                    data: {
                      idx: item2.idx,
                      name:
                        item.section.option_subject ||
                        item.section.supply_subject,
                      value: item2.pst_value || item2.pot_value,
                      price: Number(item2.pot_price || item2.pst_price),
                    },
                  }),
                );
              }
            } else {
              //체크 시
              if (!check)
                dispatch(
                  setSubMenu({
                    itemCategory:
                      item.section.option_subject ||
                      item.section.supply_subject,
                    itemCode: item2.idx,
                    itemName: item2.pst_value || item2.pot_value,
                    // itemCount: 1,
                    itemPrice: Number(item2.pst_price ?? item2.pot_price),
                  }),
                );

              //체크 해제 시
              if (check)
                dispatch(
                  removeSubMenu({
                    itemCode: item2.idx,
                    itemPrice: Number(item2.pst_price ?? item2.pot_price),
                  }),
                );
            }
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={
                item.section.required
                  ? cartStore.selectedMainOption[item.section.option_idx - 1]
                      ?.idx === item2.idx
                    ? require('~/assets/top_ic_map_on.png')
                    : require('~/assets/top_ic_map_off.png')
                  : check
                  ? require('~/assets/top_ic_map_on.png')
                  : require('~/assets/top_ic_map_off.png')
              }
              style={{width: 20, height: 20, marginRight: 10}}
            />
            <TextRegular>{item2.pot_value ?? item2.pst_value}</TextRegular>
          </View>

          <TextRegular>
            +{replaceString((item2.pot_price || item2.pst_price) ?? 0)}원
          </TextRegular>
        </Pressable>
      </View>
    </View>
  );
};

export default React.memo(OptionRenderItem);
