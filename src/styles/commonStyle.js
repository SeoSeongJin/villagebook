import {StyleSheet} from 'react-native';
import colors from './colors';

const commonStyles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputContainer: {
    width: '100%',
    height: 40,
    backgroundColor: colors.inputBoxBG,
    paddingHorizontal: 17,
    borderRadius: 10,
    marginRight: 8,
  },
});

export default commonStyles;
