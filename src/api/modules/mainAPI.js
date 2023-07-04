import {_reqAPI, _reqImageAPI} from '../apiModule';

export default {
  _getStoreList: async data => {
    const result = await _reqAPI('proc_store_list.php', data);
    return result;
  },
  _getLifeStyleList: async data => {
    const result = await _reqAPI('proc_lifestyle_list.php', data);
    return result;
  },
  _getLifeStyleStoreInfo: async data => {
    const result = await _reqAPI('proc_lifestyle_view.php', data);
    return result;
  },
  _getCategory: async data => {
    const result = await _reqAPI('proc_category_list.php', data);
    return result;
  },
  _getOrderHistory: async data => {
    const result = await _reqAPI('proc_order_list.php', data);
    return result;
  },
  _getOrderDetail: async data => {
    const result = await _reqAPI('proc_order_detail.php', data);
    return result;
  },
  _getCoupon: async data => {
    const result = await _reqAPI('proc_coupon_list.php', data);
    return result;
  },
  _getUseInfo: async data => {
    const result = await _reqAPI('proc_info_use.php', data);
    return result;
  },
  _getStoreReview: async data => {
    const result = await _reqAPI('proc_store_review_list.php', data);
    return result;
  },
  _writeReview: async data => {
    const result = await _reqImageAPI('proc_review_input.php', data);
    return result;
  },
  _getAddress: async data => {
    const result = await _reqAPI('proc_address.php', data);
    return result;
  },
  _getRecentAddress: async data => {
    const result = await _reqAPI('proc_address_list.php', data);
    return result;
  },
  _insertMainAddr: async data => {
    const result = await _reqAPI('proc_address_insert.php', data);
    return result;
  },
  _setMainAddr: async data => {
    const result = await _reqAPI('proc_address_change.php', data);
    return result;
  },
  _getCouponPoint: async data => {
    const result = await _reqAPI('proc_coupon_count_list.php', data);
    return result;
  },
  _getBoardList: async data => {
    const result = await _reqAPI('proc_board_list.php', data);
    return result;
  },
  _getBoardDetail: async data => {
    const result = await _reqAPI('proc_board_detail.php', data);
    return result;
  },
  _getMyReview: async data => {
    const result = await _reqAPI('proc_review_list.php', data);
    return result;
  },
  _getCompanyInfo: async data => {
    const result = await _reqAPI('proc_site_config.php', data);
    return result;
  },
  _updataUserInfo: async data => {
    const result = await _reqImageAPI('proc_member_update.php', data);
    return result;
  },
  _updatePhone: async data => {
    const result = await _reqAPI('proc_member_hp_change.php', data);
    return result;
  },
  _getFaqList: async data => {
    const result = await _reqAPI('proc_inquiry_list.php', data);
    return result;
  },
  _postFqa: async data => {
    const result = await _reqImageAPI('proc_inquiry_input.php', data);
    return result;
  },
  _getFaqDetail: async data => {
    const result = await _reqAPI('proc_inquiry_detail.php', data);
    return result;
  },
  _getCommunityList: async data => {
    const result = await _reqAPI('proc_community_list.php', data);
    return result;
  },
  _getCommunity: async data => {
    const result = await _reqAPI('proc_community_input.php', data);
    return result;
  },
  _getCommunityDetail: async data => {
    const result = await _reqAPI('proc_community_detail.php', data);
    return result;
  },
  _setNotification: async data => {
    const result = await _reqAPI('proc_alarm_setup.php', data);
    return result;
  },
  _searchStore: async data => {
    const result = await _reqAPI('proc_store_search_list.php', data);
    return result;
  },
  _searchLifestyle: async data => {
    const result = await _reqAPI('proc_lifestyle_search_list.php', data);
    return result;
  },
  _deleteUserAddr: async data => {
    const result = await _reqAPI('proc_address_delete.php', data);
    return result;
  },
  _getPushList: async data => {
    const result = await _reqAPI('proc_allim_list.php', data);
    return result;
  },
};
