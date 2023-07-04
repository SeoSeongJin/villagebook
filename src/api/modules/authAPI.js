import {API} from '../API';
import {_reqAPI, _reqImageAPI} from '../apiModule';

export default {
  _login: async data => {
    const result = await _reqAPI('proc_member_login.php', data);
    return result;
  },
  _snsLogin: async data => {
    const result = await _reqAPI('proc_member_login_social.php', data);
    return result;
  },
  _autoLogin: async data => {
    const result = await _reqAPI('proc_member_login_chk.php', data);
    return result;
  },
  _submitForm: async data => {
    const result = await _reqImageAPI('proc_member_join.php', data);
    return result;
  },
  _checkId: async data => {
    const result = await _reqAPI('proc_member_id_chk.php', data);
    return result;
  },
  _checkNickName: async data => {
    const result = await _reqAPI('proc_member_nick_chk.php', data);
    return result;
  },
  _sendCode: async data => {
    const result = await _reqAPI('proc_member_sms_send.php', data);
    return result;
  },
  _signOut: async data => {
    const result = await _reqAPI('proc_member_leave.php', data);
    return result;
  },
  _getTermsOfPolicy: async data => {
    const result = await _reqAPI('proc_agree.php', data);
    return result;
  },
  _findId: async data => {
    const result = await _reqAPI('proc_member_find_id.php', data);
    return result;
  },
};
