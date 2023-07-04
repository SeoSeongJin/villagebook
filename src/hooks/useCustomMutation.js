import {Alert} from 'react-native';
import {useMutation} from 'react-query';
import authAPI from '../api/modules/authAPI';
import cartAPI from '../api/modules/cartAPI';
import couponBookAPI from '../api/modules/couponBookAPI';
import mainAPI from '../api/modules/mainAPI';
import paymentAPI from '../api/modules/paymentAPI';
import storeAPI from '../api/modules/storeAPI';
import {customAlert} from '../component/CustomAlert';

export const useCustomMutation = () => {
  //Main
  const mutateSignIn = useMutation(authAPI._submitForm, {
    onSettled: e => {
      // Alert.alert('알림', `인증번호가 발송 되었습니다.`);
      console.log('mutateSignIn', e);
      return e;
    },
  });

  const mutateGetLifeStyle = useMutation(mainAPI._getLifeStyleList, {
    onSettled: e => {
      console.log('mutateGetLifeStyle', e);
      // customAlert('')
      return e;
    },
  });

  const mutateGetLifeStyleStoreInfo = useMutation(
    mainAPI._getLifeStyleStoreInfo,
    {
      onSettled: e => {
        console.log('mutateGetLifeStyleStoreInfo', e);
        // customAlert('')
        return e;
      },
    },
  );

  const mutateOrderHistory = useMutation(mainAPI._getOrderHistory, {
    onSettled: e => {
      console.log('mutateOrderHistory', e);
      return e;
    },
  });

  const mutateOrderDetail = useMutation(mainAPI._getOrderDetail, {
    onSettled: e => {
      console.log('mutateOrderDetail', e);
      return e;
    },
  });

  const mutateWriteReveiw = useMutation(mainAPI._writeReview, {
    onSettled: e => {
      console.log('mutateWriteReveiw', e);
      return e;
    },
  });

  const mutateInsertMainAddr = useMutation(mainAPI._insertMainAddr, {
    onSettled: e => {
      console.log('mutateInsertMainAddr', e);
      return e;
    },
  });

  const mutateSetMainAddr = useMutation(mainAPI._setMainAddr, {
    onSettled: e => {
      console.log('mutateSetMainAddr', e);
      return e;
    },
  });

  const mutateBoardList = useMutation(mainAPI._getBoardList, {
    onSettled: e => {
      console.log('mutateBoardList', e);
      return e;
    },
  });

  const mutateBoardDetail = useMutation(mainAPI._getBoardDetail, {
    onSettled: e => {
      console.log('mutateBoardDetail', e);
      return e;
    },
  });

  const mutateGetMyReview = useMutation(mainAPI._getMyReview, {
    onSettled: e => {
      console.log('mutateGetMyReview', e);
      return e;
    },
  });

  const mutateGetCompanyInfo = useMutation(mainAPI._getCompanyInfo, {
    onSettled: e => {
      console.log('mutateGetCompanyInfo', e);
      return e;
    },
  });

  const mutateCheckNickName = useMutation(authAPI._checkNickName, {
    onSettled: e => {
      console.log('mutateCheckNickName', e);
      return e;
    },
  });

  const mutateGetFaqList = useMutation(mainAPI._getFaqList, {
    onSettled: e => {
      console.log('mutateGetFaqList', e);
      return e;
    },
  });

  const mutateGetFaqDetail = useMutation(mainAPI._getFaqDetail, {
    onSettled: e => {
      console.log('mutateGetFaqDetail', e);
      return e;
    },
  });

  const mutatePostFaq = useMutation(mainAPI._postFqa, {
    onSettled: e => {
      console.log('mutatePostFaq', e);
      return e;
    },
  });

  const mutateNotification = useMutation(mainAPI._setNotification, {
    onSettled: e => {
      console.log('mutateNotification', e);
      return e;
    },
  });

  const mutateLikeLifeStyle = useMutation(storeAPI._getLikeLifeStyle, {
    onSettled: e => {
      console.log('mutateNotification', e);
      return e;
    },
  });

  //Auth
  const mutateSNSlogin = useMutation(authAPI._snsLogin, {
    onSettled: e => {
      console.log('e', e);
    },
  });

  const mutateFindId = useMutation(authAPI._findId, {
    onSettled: e => {
      if (e.result === 'false') {
        Alert.alert('알림', `${e.msg}`);
        return e;
      } else {
        Alert.alert(
          '아이디 찾기',
          `회원님의 아이디는\n"${e.data.arrItems.mt_id}" 입니다`,
        );
        return e;
      }
    },
  });

  const mutateSendCode = useMutation(authAPI._sendCode, {
    onSettled: e => {
      if (e.result === 'false') {
        Alert.alert('알림', `${e.msg}`);
        return e;
      } else {
        Alert.alert(
          '알림',
          `인증번호가 발송 되었습니다.\n받은 번호를 입력 후 인증확인을 해주세요.`,
        );
        return e;
      }
    },
  });

  //Store
  const mutateTopMenu = useMutation(storeAPI._getTopMenu, {
    onSettled: e => {
      console.log('mutateTopMenu', e);
      // customAlert('')
      return e;
    },
  });

  const mutateAllMunu = useMutation(storeAPI._getAllMenu, {
    onSettled: e => {
      console.log('mutateAllMunu', e);
      // customAlert('')
      return e;
    },
  });

  const mutateStoreInfo = useMutation(storeAPI._getStoreInfo, {
    onSettled: e => {
      console.log('mutateStoreInfo', e);
      return e;
    },
  });

  const mutateServiceTime = useMutation(storeAPI._getServiceTime, {
    onSettled: e => {
      console.log('mutateServiceTime', e);
      return e;
    },
  });

  const mutateMenuDetail = useMutation(storeAPI._getMenuDetail, {
    onSettled: e => {
      console.log('mutateMenuDetail', e);
      return e;
    },
  });

  const mutateDeliveryFee = useMutation(storeAPI._getDeliveryFee, {
    onSettled: e => {
      console.log('mutateDeliveryFee', e);
      return e;
    },
  });

  const mutateFinishTransaction = useMutation(paymentAPI._finishTransaction, {
    onSettled: e => {
      console.log('mutateFinishTransaction', e);
      return e;
    },
  });

  const mutateSaveItemInCart = useMutation(cartAPI._saveItemInCart, {
    onSettled: e => {
      console.log('mutateSaveItemInCart', e);
      return e;
    },
  });

  const mutateGetLikeList = useMutation(storeAPI._getLikeList, {
    onSettled: e => {
      console.log('mutateGetLikeList', e);
      return e;
    },
  });

  const mutateSetLikeStore = useMutation(storeAPI._setLikeStore, {
    onSettled: e => {
      console.log('mutateSetLikeStore', e);
      return e;
    },
  });

  const mutateGetCoupon = useMutation(mainAPI._getCoupon, {
    onSettled: e => {
      console.log('mutateGetCoupon', e);
      return e;
    },
  });

  const mutateGetUseInfo = useMutation(mainAPI._getUseInfo, {
    onSettled: e => {
      console.log('mutateGetUseInfo', e);
      return e;
    },
  });

  const mutateGetReview = useMutation(mainAPI._getStoreReview, {
    onSettled: e => {
      console.log('mutateGetReview', e);
      return e;
    },
  });

  const mutateGetAddress = useMutation(mainAPI._getAddress, {
    onSettled: e => {
      console.log('mutateGetAddress', e);
      return e;
    },
  });

  const mutateGetRecentAddress = useMutation(mainAPI._getRecentAddress, {
    onSettled: e => {
      console.log('mutateGetReview', e);
      return e;
    },
  });

  const mutateGetCouponPoint = useMutation(mainAPI._getCouponPoint, {
    onSettled: e => {
      console.log('mutateGetCouponPoint', e);
      return e;
    },
  });
  const mutateGetStoreCoupon = useMutation(storeAPI._getStoreCoupon, {
    onSettled: e => {
      console.log('mutateGetCouponPoint', e);
      return e;
    },
  });
  const mutateGetDeliveryFeeInfo = useMutation(
    storeAPI._getStoreDeliveryFeeInfo,
    {
      onSettled: e => {
        console.log('mutateGetDeliveryFeeInfo', e);
        return e;
      },
    },
  );
  const mutateGetBanner = useMutation(storeAPI._getBanner, {
    onSettled: e => {
      console.log('mutateGetBanner', e);
      return e;
    },
  });
  const mutateGetBannerDistance = useMutation(storeAPI._getBannerDistance, {
    onSettled: e => {
      console.log('mutateGetBannerDistance', e);
      return e;
    },
  });
  const mutateGetCouponBanner = useMutation(storeAPI._getCouponBookBanner, {
    onSettled: e => {
      console.log('mutateGetCouponBanner', e);
      return e;
    },
  });
  const mutateGetStoreService = useMutation(storeAPI._getStoreService, {
    onSettled: e => {
      console.log('mutateGetStoreService', e);
      return e;
    },
  });
  const mutateGetStoreList = useMutation(mainAPI._getStoreList, {
    onSettled: e => {
      console.log('mutateGetStoreList', e);
      return e;
    },
  });
  const mutateDownloadCoupon = useMutation(storeAPI._downloadCoupon, {
    onSettled: e => {
      console.log('mutateDownloadCoupon', e);
      return e;
    },
  });
  const mutateUpdateUserInfo = useMutation(mainAPI._updataUserInfo, {
    onSettled: e => {
      console.log('mutateUpdateUserInfo', e);
      return e;
    },
  });
  const mutateUpdatePhone = useMutation(mainAPI._updatePhone, {
    onSettled: e => {
      console.log('mutateUpdatePhone', e);
      return e;
    },
  });
  const mutateSearch = useMutation(mainAPI._searchStore, {
    onSettled: e => {
      console.log('mutateSearch', e);
    },
  });
  const mutateSearchLifeStyle = useMutation(mainAPI._searchLifestyle, {
    onSettled: e => {
      console.log('mutateSearchLifeStyle', e);
    },
  });
  const mutateDeleteUserAddr = useMutation(mainAPI._deleteUserAddr, {
    onSettled: e => {
      console.log('mutateDeleteUserAddr', e);
    },
  });
  const mutateGetPushList = useMutation(mainAPI._getPushList, {
    onSettled: e => {
      console.log('mutateGetPushList', e);
    },
  });

  //쿠폰북 api 추가
  const mutateGetCouponBookList = useMutation(
    couponBookAPI._getCouponBookList,
    {
      onSettled: e => {
        console.log('mutateGetCouponBookList', e);
      },
    },
  );
  const mutateGetCouponBookJumju = useMutation(
    couponBookAPI._getCouponBookJumju,
    {
      onSettled: e => {
        console.log('mutateGetCouponBookList', e);
      },
    },
  );
  const mutateGetBarcodeBookJumju = useMutation(
    couponBookAPI._getBarcodeBookJumju,
    {
      onSettled: e => {
        console.log('mutateGetCouponBookList', e);
      },
    },
  );
  const mttCpnBookDtl = useMutation(couponBookAPI._getCpnBookDtl, {
    onSettled: e => {
      console.log('mttCpnBookDtl', e);
    },
  });
  const mttBcnBookDtl = useMutation(couponBookAPI._getBcnBookDtl, {
    onSettled: e => {
      console.log('mttBcnBookDtl', e);
    },
  });
  const mttBcnBookCatetory = useMutation(couponBookAPI._getBcnBookCategory, {
    onSettled: e => {
      console.log('mttBcnBookCategory', e);
    },
  });
  const mttCpnBookMyBoxDtl = useMutation(couponBookAPI._getCpnBookMyBoxDtl, {
    onSettled: e => {
      console.log('mttCpnBookMyBoxDtl', e);
    },
  });

  const mttCpbMy = useMutation(couponBookAPI._getCpbMy, {
    onSettled: e => {
      console.log('mttCpbMy', e);
    },
  });

  const mttBcbMy = useMutation(couponBookAPI._getBcbMy, {
    onSettled: e => {
      console.log('mttBcbMy', e);
    },
  });

  const mttCpbUse = useMutation(couponBookAPI._useCpb, {
    onSettled: e => {
      console.log('mttCpbUse', e);
    },
  });

  const mttBcbUse = useMutation(couponBookAPI._useBcb, {
    onSettled: e => {
      console.log('mttBcbUse', e);
    },
  });

  const mttCpbSave = useMutation(couponBookAPI._saveCpn, {
    onSettled: e => {
      console.log('mttCpbSave', e);
    },
  });

  const mttBcbSave = useMutation(couponBookAPI._saveBcn, {
    onSettled: e => {
      console.log('mttBcbSave', e);
    },
  });

  const mttCpbListOwner = useMutation(couponBookAPI._getCpnlistOwner, {
    onSettled: e => {
      console.log('mttCpbListOwner', e);
    },
  });

  return {
    mttCpbListOwner,
    mttCpbSave,
    mttCpbUse,
    mttCpbMy,
    mttBcbSave,
    mttBcbUse,
    mttBcbMy,
    mttCpnBookMyBoxDtl,
    mutateGetCouponBookList,
    mutateGetCouponBookJumju,
    mutateGetBarcodeBookJumju,
    mttCpnBookDtl,
    mttBcnBookDtl,
    mttBcnBookCatetory,
    mutateSignIn,
    mutateSNSlogin,
    mutateFindId,
    mutateSendCode,
    mutateTopMenu,
    mutateStoreInfo,
    mutateAllMunu,
    mutateServiceTime,
    mutateMenuDetail,
    mutateDeliveryFee,
    mutateFinishTransaction,
    mutateSaveItemInCart,
    mutateOrderHistory,
    mutateOrderDetail,
    mutateSetLikeStore,
    mutateGetLikeList,
    mutateGetCoupon,
    mutateGetUseInfo,
    mutateGetReview,
    mutateGetLifeStyle,
    mutateGetLifeStyleStoreInfo,
    mutateWriteReveiw,
    mutateGetRecentAddress,
    mutateSetMainAddr,
    mutateInsertMainAddr,
    mutateGetAddress,
    mutateGetCouponPoint,
    mutateBoardList,
    mutateGetMyReview,
    mutateGetStoreCoupon,
    mutateGetDeliveryFeeInfo,
    mutateGetBanner,
    mutateGetBannerDistance,
    mutateGetCouponBanner,
    mutateGetCompanyInfo,
    mutateGetStoreService,
    mutateGetStoreList,
    mutateDownloadCoupon,
    mutateCheckNickName,
    mutateUpdateUserInfo,
    mutateGetFaqList,
    mutatePostFaq,
    mutateNotification,
    mutateSearch,
    mutateGetFaqDetail,
    mutateLikeLifeStyle,
    mutateSearchLifeStyle,
    mutateDeleteUserAddr,
    mutateBoardDetail,
    mutateUpdatePhone,
    mutateGetPushList,
  };
};
