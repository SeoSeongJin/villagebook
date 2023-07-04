import {API} from '../API';
import {_reqAPI, _reqGetIAM, _reqPostIAM} from '../apiModule';

export default {
  _getImporToken: async data => {
    const result = await _reqPostIAM(
      'https://api.iamport.kr/users/getToken',
      data,
    );
    return result;
  },
  _getInfoFromImport: async (data, imp_uid) => {
    const result = await _reqGetIAM(
      `https://api.iamport.kr/payments/${imp_uid}`,
      data,
    );
    return result;
  },
  _finishTransaction: async data => {
    const result = await _reqAPI('proc_order_update.php', data);
    return result;
  },
};
