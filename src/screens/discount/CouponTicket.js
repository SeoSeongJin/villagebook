import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import TextMedium from '../../component/text/TextMedium';
import TextNotoM from '../../component/text/TextNotoM';
import TextRegular from '../../component/text/TextRegular';
import colors from '../../styles/colors';
import {Modal} from 'react-native';
import TextBold from '../../component/text/TextBold';
import dayjs from 'dayjs';
import {replace} from 'formik';
import {replaceString} from '../../config/utils/Price';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {useDispatch, useSelector} from 'react-redux';
import {customAlert} from '../../component/CustomAlert';
import {
  setStoreCoupon,
  setSystemCoupon,
} from '../../store/reducers/CouponReducer';
import TextSBold from '../../component/text/TextSBold';
import {setIsLifeStyle} from '../../store/reducers/CategoryReducer';

const CouponTicket = ({
  data,
  download,
  storeInfo,
  select,
  type,
  useCoupon,
  navigation,
}) => {
  // const [modal, setModal] = useState({visible: false, data: ''});
  const {mutateDownloadCoupon} = useCustomMutation();
  const {userInfo} = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  const itemInfo = data.item;
  console.log('data ::', download);
  const _calcDate = () => {
    const date1 = dayjs().format('YYYY-MM-DD');
    const date2 = itemInfo.cp_end ?? itemInfo.cz_end;

    const diffDate = dayjs(date2).diff(date1, 'days');
    return diffDate;
  };

  const _convertCpType = () => {
    // 0 : 모두 사용 가능
    // 1 : 포장용 쿠폰
    // 2 : 배달용 쿠폰
    const type = itemInfo.cp_type ?? itemInfo.cz_type;
    // console.warn('info', itemInfo);
    switch (type) {
      case '0':
        return {
          type: '배달/포장/먹고가기',
          color: colors.primary,
          fontColor: 'white',
        };
      case '1':
        return {
          type: '포장용',
          color: colors.mainBG1,
          fontColor: colors.fontMain1,
        };
      case '2':
        return {
          type: '배달용',
          color: colors.mainBG2,
          fontColor: colors.fontMain2,
        };
      case '3':
        return {
          type: '먹고가기용',
          color: colors.mainBG3,
          fontColor: colors.fontMain3,
        };
      default:
        return type;
    }
  };

  const _downloadCoupon = () => {
    const info = {
      jumju_id: storeInfo.mb_id,
      jumju_code: storeInfo.mb_jumju_code,
      mt_id: userInfo.mt_id,
      cz_no: data.item.cz_no,
    };
    // console.log('info', info);
    mutateDownloadCoupon.mutate(info, {
      onSettled: e => {
        if (e.result === 'true')
          customAlert('알림', '쿠폰 다운로드 완료', navigation.goBack());
        else customAlert('알림', '이미 보유한 쿠폰입니다.');
        console.log('download', e);
      },
    });
  };

  const _selectCoupon = () => {
    console.log('select', itemInfo);
    if (type === 'store') {
      dispatch(setStoreCoupon(itemInfo));
      navigation.goBack();
    }
    if (type === 'system') {
      dispatch(setSystemCoupon(itemInfo));
      navigation.goBack();
    }
  };

  return (
    <View
      style={{
        marginBottom: 10,
        marginHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.borderColor,
      }}
    >
      <Pressable
        onPress={() => {
          download && _downloadCoupon();
          select && _selectCoupon();
        }}
        style={{
          height: 140,
          flexDirection: 'row',
          alignItems: 'center',
          overflow: 'hidden',
          paddingLeft: 10,
        }}
      >
        <View style={{flex: 3}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View style={{flex: 1}}>
              <TextBold style={{fontSize: 22, color: colors.primary}}>
                {/* 0: 고정금액 할인 , 1: 퍼센트 할인 */}
                {/* cz type ???? */}
                {console.log('item', itemInfo)}
                {/* 매장 쿠폰 받기 : cz_ ... */}
                {/* 할인함 및 기타 쿠폰 선택 : cp_ ... */}
                {itemInfo.cp_price_type === '0' ||
                itemInfo.cz_price_type === '0'
                  ? replaceString(itemInfo.cp_price ?? itemInfo.cz_price) + '원'
                  : replaceString(itemInfo.cp_price ?? itemInfo.cz_price) + '%'}
              </TextBold>
            </View>

            <View
              style={{
                paddingHorizontal: 10,
                height: 24,
                borderRadius: 12,
                backgroundColor: _convertCpType().color,
                marginLeft: 7,
                marginRight: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* 0 : 모두 사용 가능
                1 : 포장용 쿠폰
                2 : 배달용 쿠폰 */}
              <TextNotoM
                style={{
                  fontSize: 12,
                  color: _convertCpType().fontColor,
                }}
              >
                {_convertCpType().type}
              </TextNotoM>
            </View>
          </View>
          <View style={{marginTop: 8}}>
            <TextMedium style={{color: colors.fontColor2}}>
              {itemInfo.cp_subject ?? itemInfo.cz_subject}
            </TextMedium>
          </View>
          <View>
            <TextRegular style={{color: colors.fontColor2}}>
              {itemInfo.cp_start ?? itemInfo.cz_start} ~{' '}
              {itemInfo.cp_end ?? itemInfo.cz_end}
            </TextRegular>
            <TextRegular style={{color: colors.fontColor2}}>
              {itemInfo.cp_gubun === 'system'
                ? '동네북 쿠폰'
                : itemInfo.cp_mb_company}
              {/* {itemInfo.cp_method_txt}) */}
            </TextRegular>
          </View>
        </View>
        <Pressable
          // onPress={() => setModal({data: itemInfo, visible: !modal.visible})}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            borderLeftWidth: 1,
            borderColor: colors.borderColor,
            backgroundColor: colors.couponBG,
          }}
        >
          <TextNotoM style={{color: colors.fontMain3, fontSize: 12}}>
            남은기한
          </TextNotoM>
          <TextNotoM style={{color: colors.fontMain3, fontSize: 20}}>
            {_calcDate()}일
          </TextNotoM>
        </Pressable>
      </Pressable>
      {itemInfo.cp_gubun === 'store' && !useCoupon && (
        <Pressable
          onPress={() => {
            dispatch(setIsLifeStyle(false));
            navigation.navigate('MenuDetail2', {
              jumju_id: itemInfo.cp_jumju_id,
              jumju_code: itemInfo.cp_jumju_code,
              category: itemInfo.cp_jumju_type,
              mb_company: itemInfo?.cp_mb_company,
            });
          }}
          style={{
            height: 55,
            width: '100%',
            borderTopWidth: 1,
            borderColor: colors.borderColor,
            paddingLeft: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextMedium style={{fontSize: 14, color: colors.primary}}>
            가게 바로가기
          </TextMedium>
        </Pressable>
      )}
    </View>
  );
};

export default CouponTicket;
