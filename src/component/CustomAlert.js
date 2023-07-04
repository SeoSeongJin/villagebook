import {Alert} from 'react-native';

export const customAlert = (
  title,
  text,
  onPress,
  btnTitle,
  btnPress,
  btnSubTitle,
  btnSubPress,
) => {
  Alert.alert(
    title,
    text,
    btnTitle || btnSubTitle
      ? [
          {text: btnTitle, onPress: btnPress},
          {text: btnSubTitle, onPress: btnSubPress},
        ]
      : [{text: '확인', onPress: onPress ? onPress : () => {}}],
  );
};
