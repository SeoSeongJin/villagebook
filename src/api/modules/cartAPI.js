import {API} from '../API';
import {_reqAPI} from '../apiModule';

export default {
  _saveItemInCart: async data => {
    const result = await _reqAPI('proc_cart_update2.php', data);
    return result;
  },
};
