import {Errorhandler} from '../config/ErrorHandler';
import {API, IAM_API, ImageAPI} from './API';

export const _reqAPI = async (url, data) => {
  const apiResult = await API.post(url, data)
    .then(result => {
      // console.log('## API REQ FINISH ## REQUESTED URL ::', url);
      // console.log('## RES DATA ::', result);
      return result.data;
    })
    .catch(e => {
      Errorhandler(e);
      console.log(`## REQ ERROR URL :: ${url}`);
      console.error(e);
      return e;
    });
  return apiResult;
};

export const _reqImageAPI = async (url, data) => {
  const apiResult = await ImageAPI.post(url, data)
    .then(result => {
      console.log('## IMAGE API REQ FINISH ## REQUESTED URL ::', url);
      console.log('## IMAGE API RES DATA ::', result);
      return result.data;
    })
    .catch(e => {
      Errorhandler(e);
      console.log(`## IMAGE API REQ ERROR URL :: ${url}`);
      console.error(e);
      return e;
    });
  return apiResult;
};

export const _reqGetIAM = async (url, data) => {
  const apiResult = await IAM_API.get(url, data)
    .then(result => {
      console.log('## API _reqGetIAM REQ FINISH ## REQUESTED URL ::', url);
      console.log('## RES DATA ::', result);
      return result.data;
    })
    .catch(e => {
      Errorhandler(e);
      console.log(`## REQ ERROR URL :: ${url}`);
      console.error(e);
      return e;
    });
  return apiResult;
};

export const _reqPostIAM = async (url, data) => {
  const apiResult = await IAM_API.post(url, data)
    .then(result => {
      console.log('## API _reqPostIAM REQ FINISH ## REQUESTED URL ::', url);
      console.log('## RES DATA ::', result);
      return result.data;
    })
    .catch(e => {
      Errorhandler(e);
      console.log(`## REQ ERROR URL :: ${url}`);
      console.error(e);
      return e;
    });
  return apiResult;
};
