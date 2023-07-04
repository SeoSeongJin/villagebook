import {_reqAPI} from '../apiModule';

export default {
  _getStoreInfo: async data => {
    const result = await _reqAPI('proc_store_view.php', data);
    return result;
  },
  _getAllMenu: async data => {
    const result = await _reqAPI('proc_item_list.php', data);
    return result;
  },
  _getTopMenu: async data => {
    const result = await _reqAPI('proc_item_list_main.php', data);
    return result;
  },
  _getServiceTime: async data => {
    const result = await _reqAPI('proc_store_service_time.php', data);
    return result;
  },
  _getMenuDetail: async data => {
    const result = await _reqAPI('proc_item_detail.php', data);
    return result;
  },
  _getDeliveryFee: async data => {
    const result = await _reqAPI('proc_cart_send_cost.php', data);
    return result;
  },
  _getLikeList: async data => {
    const result = await _reqAPI('proc_wish_store_list.php', data);
    return result;
  },
  _getLikeLifeStyle: async data => {
    const result = await _reqAPI('proc_wish_lifestyle_list.php', data);
    return result;
  },
  _setLikeStore: async data => {
    const result = await _reqAPI('proc_wish_store_input.php', data);
    return result;
  },
  _getStoreCoupon: async data => {
    const result = await _reqAPI('proc_store_service_couponzone.php', data);
    return result;
  },
  _getStoreDeliveryFeeInfo: async data => {
    const result = await _reqAPI('proc_store_delivery.php', data);
    return result;
  },
  _getBanner: async data => {
    const result = await _reqAPI('proc_banner_list.php', data);
    return result;
  },
  _getBannerDistance: async data => {
    const result = await _reqAPI('proc_banner_list_distance.php', data);
    return result;
  },
  _getCouponBookBanner: async data => {
    const result = await _reqAPI('proc_couponbook_banner_list.php', data);
    return result;
  },
  _getStoreService: async data => {
    const result = await _reqAPI('proc_store_service.php', data);
    return result;
  },
  _downloadCoupon: async data => {
    const result = await _reqAPI('proc_coupon_download.php', data);
    return result;
  },
};
