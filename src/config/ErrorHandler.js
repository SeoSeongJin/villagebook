const {Alert} = require('react-native');

export const Errorhandler = err => {
  switch (err) {
    default:
      Alert.alert('알림', `${err}`);
      break;
  }
};
