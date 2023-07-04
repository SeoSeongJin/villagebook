import {View, Text, Pressable} from 'react-native';
import React, {useEffect} from 'react';
import IMP from 'iamport-react-native';
import Loading from '../../component/Loading';
import axios from 'axios';
import {IAM_API_KEY, IAM_SECRET} from '@env';
import {Errorhandler} from '../../config/ErrorHandler';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {useDispatch, useSelector} from 'react-redux';
import PaymentList from '../../config/PaymentList';
import OrderFinish from '../menu/orderDetail/OrderFinish';
import {API} from '../../api/API';
import {resetSavedItem} from '../../store/reducers/CartReducer';
import {
  resetPayment,
  setOrderResult,
} from '../../store/reducers/PaymentReducer';
import {resetCoupon} from '../../store/reducers/CouponReducer';
import AuthStorageModuel from '../../store/localStorage/AuthStorageModuel';
import {setDeliveryType} from '../../store/reducers/DeliveryInfoReducer';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';

const PaymentMain = ({navigation, route}) => {
  const deliveryType = route.params?.deliveryType;
  const orderForm = route.params?.orderForm;
  const totalSellPrice = route.params?.totalSellPrice;
  const totalOrderPrice = route.params?.totalOrderPrice;
  const dispatch = useDispatch();

  const {mutateFinishTransaction} = useCustomMutation();
  const cartStore = useSelector(state => state.cartReducer);
  const paymentStore = useSelector(state => state.paymentReducer);
  const {userInfo} = useSelector(state => state.authReducer);
  // const {deliveryType} = useSelector(state => state.deliveryReducer);
  console.log('userinfo', userInfo);
  console.log('orderForm', orderForm);
  console.log('route data', route.params);
  console.log('store', cartStore);
  const _deleteCount = () => {
    return {savedItems: cartStore.savedItem.savedItems};
  };

  const _getMethod = () => {
    let method = paymentStore.paymentMethod;
    if (method === PaymentList.card) return 'card';
    else {
      if (method === PaymentList.offlineCard) return 'card-face';
      if (method === PaymentList.offlineCash) return 'cash';
    }
  };

  const _resetItem = async () => {
    await AuthStorageModuel._removeCartData(() => {});
  };
  const _getDeliveryType = () => {
    switch (deliveryType) {
      case 0:
        return 'delivery';
      case 1:
        return 'wrap';
      case 2:
        return 'forhere';
      default:
        return;
    }
  };

  const _finishTransaction = paymentForm => {
    const method = _getMethod();
    const menuData = _deleteCount();
    const data = {
      jumju_id: cartStore.savedItem?.savedStoreCode.jumju_id,
      jumju_code: cartStore.savedItem?.savedStoreCode.code,
      mt_id: userInfo.mt_id,
      mt_name: orderForm.mt_name,
      od_method: _getDeliveryType(),
      od_forhere_num: orderForm.od_forhere_num,
      od_pay_method: method, // 결제방법 선택시 선택된 값을 넘김 (카트, 만나서 카드 or 현금) [card, card-face, cash]
      od_zip: orderForm.od_zip ?? '',
      od_addr1: orderForm.od_addr1 ?? '',
      od_addr2: orderForm.od_addr2 ?? '',
      od_addr3: orderForm.od_addr3 ?? '',
      od_addr_jibeon: orderForm.od_addr_jibeon ?? '',

      od_hp: orderForm.od_hp,
      od_to_officer: orderForm.od_to_officer,
      od_to_seller: orderForm.od_to_seller,
      od_no_spoon: orderForm.od_no_spoon,
      od_safety_chk: orderForm.od_safety_chk,
      od_send_cost: orderForm.od_send_cost,
      od_send_cost2: orderForm.od_send_cost2,

      od_receipt_point: orderForm.od_receipt_point,
      od_takeout_discount: orderForm.od_takeout_discount,
      od_for_here_discount: orderForm.od_for_here_discount,

      od_coupon_id_system: '',
      od_coupon_id_store: '',
      od_coupon_price_system: orderForm.od_coupon_price_system,
      od_coupon_price_store: orderForm.od_coupon_price_store,
      od_total_sell_price: totalSellPrice,
      od_total_order_price: totalOrderPrice,

      od_pg_data: method === 'card' ? JSON.stringify(paymentForm) : null,
      od_menu_data: JSON.stringify(menuData),
    };
    console.log('_finishTransaction data Obj', data);

    API.post('proc_order_update.php', data)
      .then(result => {
        console.log('Result :::', result);
        dispatch(
          setOrderResult({orderResultData: result.data, summitedData: data}),
        );
        navigation.reset({
          routes: [{name: 'OrderFinish'}],
        });
        _resetItem();
        dispatch(resetSavedItem());
        dispatch(resetCoupon());
        dispatch(resetPayment());
        dispatch(setDeliveryType(0));
      })
      .catch(e => {
        Errorhandler(e);
        console.error(e);
      });
    // mutateFinishTransaction.mutate(data);
  };

  const _getIamInfo = async res => {
    try {
      const {imp_uid, merchant_uid} = res;

      const getToken = await axios.post(
        'https://api.iamport.kr/users/getToken',
        {
          imp_key: IAM_API_KEY,
          imp_secret: IAM_SECRET,
        },
        {headers: {'Content-Type': 'application/json'}},
      );

      const {access_token} = getToken.data.response;
      console.log('getToken data', getToken.data);

      const getPaymentData = await axios.get(
        `https://api.iamport.kr/payments/${imp_uid}`,
        {
          headers: {Authorization: access_token},
        },
      );

      const paymentData = getPaymentData.data.response; // 조회한 결제 정보

      console.log('paymentData', paymentData);

      const paymentForm = {
        od_pg_imp_uid: imp_uid,
        od_pg_merchant_uid: merchant_uid,
        od_pg_tid: paymentData.pg_tid,
        od_pg_apply_num: paymentData.apply_num,
        od_pg_card_name: paymentData.card_name,
        // od_pay_method: paymentData.pay_method, //pg 에서 받은 값 대신 별도의 값으로 대체(결제 방법창에서 선택한 방법으로)
        od_pg_card_code: paymentData.card_code,
        od_pg_card_number: paymentData.card_number,
      };
      console.log('paymentForm', paymentForm);
      _finishTransaction(paymentForm);
    } catch (e) {
      Errorhandler(e);
      console.error('PaymentMain', e);
    }
  };

  const data = {
    pg: 'html5_inicis',
    pay_method: 'card',
    name:
      cartStore.savedItem.savedItems.length === 1
        ? cartStore.mainCount.menuName
        : cartStore.savedItem.savedItems[0].main.menuName +
          '외 ' +
          (cartStore.savedItem.savedItems.length - 1) +
          '건',
    merchant_uid: `mid_${new Date().getTime()}`,
    amount: totalOrderPrice,
    buyer_name: orderForm.mt_name,
    buyer_tel: orderForm.od_hp,
    buyer_email: userInfo.mt_email,
    buyer_addr: orderForm.od_addr1 + orderForm.od_addr2 + orderForm.od_addr3,
    buyer_postcode: orderForm.od_zip,
    app_scheme: 'example',
    // [Deprecated v1.0.3]: m_redirect_url
  };

  const _callback = res => {
    console.log('res', res);
    if (res.imp_success === 'false') {
      navigation.goBack();
    } else _getIamInfo(res);
    // navigation.navigate('OrderFinish', res);
  };

  if (_getMethod() !== 'card') {
    useEffect(() => {
      _finishTransaction();
    }, []);
    return <Loading />;
  } else {
    return (
      <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
        <IMP.Payment
          userCode={'imp72538339'} // 가맹점 식별코드
          //tierCode={'AAA'} // 티어 코드: agency 기능 사용자에 한함
          loading={<Loading />} // 로딩 컴포넌트
          data={data} // 결제 데이터
          callback={_callback} // 결제 종료 후 콜백
        />
      </SafeAreaView>
    );
  }

  // return (
  //   <View style={{flex: 1}}>
  //     <Pressable
  //       onPress={() => {
  //         _finishTransaction();
  //       }}
  //       style={{
  //         height: 60,
  //         width: '100%',
  //         backgroundColor: 'teal',
  //       }}></Pressable>
  //   </View>
  // );
};

export default PaymentMain;
