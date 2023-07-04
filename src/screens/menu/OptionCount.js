import {View, Pressable, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../styles/colors';
import TextBold from '../../component/text/TextBold';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCountDown,
  setCountUp,
  setMainCount,
  setMainCountFromCart,
} from '../../store/reducers/CartReducer';
import Loading from '../../component/Loading';
import {customAlert} from '../../component/CustomAlert';
import AuthStorageModuel from '../../store/localStorage/AuthStorageModuel';

const OptionCount = ({price, isTest, savedItem, index, isSummit}) => {
  const dispatch = useDispatch();
  const cartStore = useSelector(state => state.cartReducer);
  const mainCount = cartStore.mainCount;
  const mainCountNum = cartStore.mainCount.count;
  const mainOptionPrice = cartStore.selectedMainOption;
  const savedMenu = cartStore.savedItem.savedItems;
  const subItems = cartStore.subItems;

  const _calcMenuPrice = down => {
    let optionPrice = 0;
    //메인의 옵션 가격
    if (mainOptionPrice.length > 0) {
      mainOptionPrice.map((item, index) => {
        optionPrice += item.price;
      });
    }

    // 추가메뉴 가격
    let subItemPrice = 0;
    if (subItems.length > 0) {
      subItems.map((item, index) => {
        subItemPrice += item.itemPrice;
      });
    }

    let price = 0;
    if (down) {
      // subItemPrice;subItemPrice
      price =
        cartStore.totalPrice -
        (mainCount.mainPrice + optionPrice) -
        subItemPrice;
    } else {
      subItemPrice *= mainCountNum + 1;
      price =
        (mainCount.mainPrice + optionPrice) * (mainCountNum + 1) + subItemPrice;
    }
    return price;
  };

  const _calcFromCart = down => {
    let savedItem = savedMenu[index];
    let temp = {count: 1, price: 0, index: index};
    temp.count = down ? savedItem.count - 1 : savedItem.count + 1;

    console.log('temp', temp);
    console.log('savedItem', savedItem);
    let temp2 = 0;
    if (savedItem.main.option.length > 0) {
      savedItem.main.option.map((item, index) => {
        temp2 += item.price;
      });
    }
    if (savedItem.sub.length > 0) {
      savedItem.sub.map((item, index) => {
        temp2 += item.itemPrice;
      });
    }
    temp2 = (savedItem.main.mainPrice + temp2) * temp.count;
    temp.price = temp2;

    console.log('temp', temp);
    if (temp.count > 0) dispatch(setMainCountFromCart(temp));
  };

  const _checkRequired = () => {
    if (
      cartStore.requiredCount !==
      Object.keys(cartStore.selectedMainOption).length
    ) {
      customAlert('알림', '필수 옵션을 선택해주세요.');
      return false;
    } else return true;
  };

  const _countUp = () => {
    const result = _checkRequired();
    console.log('index ::', index, isSummit);
    if (result) {
      if (isSummit) {
        _calcFromCart();
      } else {
        dispatch(setCountUp({price: _calcMenuPrice()}));
      }
    }
  };

  const _countDown = () => {
    const result = _checkRequired();
    if (result) {
      console.log('index ::', index, isSummit);
      if (mainCountNum > 1 || savedMenu[index]?.count > 0)
        if (isSummit) {
          _calcFromCart(true);
        } else {
          dispatch(setCountDown({price: _calcMenuPrice(true)}));
        }
    }
  };

  const _cartStorage = async () => {
    let temp = cartStore.savedItem;
    temp = {
      ...temp,
      logo: cartStore.storeLogoUrl,
      // totalPrice,
    };
    await AuthStorageModuel._setCartData(temp);
  };
  useEffect(() => {
    _cartStorage();
  }, [savedItem]);

  return (
    <View
      style={{
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.borderColor,
        width: 150,
        height: 50,
      }}>
      <Pressable
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => {
          _countDown();
        }}>
        <Image
          source={require('~/assets/ico_minus.png')}
          style={{width: 20, height: 20}}
        />
      </Pressable>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: colors.borderColor,
        }}>
        {isSummit ? (
          <TextBold>
            {cartStore.savedItem.savedItems[index].main.count}
          </TextBold>
        ) : (
          <TextBold>{cartStore.mainCount.count}</TextBold>
        )}
      </View>
      <Pressable
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => {
          _countUp();
        }}>
        <Image
          source={require('~/assets/ico_plus.png')}
          style={{width: 20, height: 20}}
        />
      </Pressable>
    </View>
  );
};

export default OptionCount;
