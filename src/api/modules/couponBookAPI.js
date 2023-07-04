import {API} from '../API';
import {_reqAPI} from '../apiModule';

export default {
  _getCouponBookList: async data => {
    const result = await _reqAPI('proc_couponbook_list.php', data);
    return result;
  },
  _getCouponBookJumju: async data => {
    const result = await _reqAPI('proc_couponbook_jumju.php', data);
    return result;
  },
  _getBarcodeBookJumju: async data => {
    const result = await _reqAPI('proc_barcodebook_jumju.php', data);
    return result;
  },
  _getCpnBookDtl: async data => {
    const result = await _reqAPI('proc_couponbook_detail.php', data);
    return result;
  },
  _getBcnBookDtl: async data => {
    const result = await _reqAPI('proc_barcodebook_detail.php', data);
    return result;
  },
  _getBcnBookCategory: async data => {
    const result = await _reqAPI('proc_barcodebook_category.php', data);
    return result;
  },
  _getCpnBookMyBoxDtl: async data => {
    const result = await _reqAPI('proc_couponbook_box_detail.php', data);
    return result;
  },
  _getCpbMy: async data => {
    const result = await _reqAPI('proc_couponbook_box.php', data);
    return result;
  },
  _useCpb: async data => {
    const result = await _reqAPI('proc_couponbook_use.php', data);
    return result;
  },
  _useBcb: async data => {
    const result = await _reqAPI('proc_barcodebook_use.php', data);
    return result;
  },
  _saveCpn: async data => {
    const result = await _reqAPI('proc_couponbook_download.php', data);
    return result;
  },
  _saveBcn: async data => {
    const result = await _reqAPI('proc_barcodebook_download.php', data);
    return result;
  },
  _getCpnlistOwner: async data => {
    const result = await _reqAPI('proc_lifestyle_coupon_list.php', data);
    return result;
  },
};
