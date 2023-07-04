import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import colors from '../styles/colors';

export const Input = ({
  flex,
  marginTop,
  marginBottom,
  secureTextEntry,
  placeholder,
  formik,
  value,
  keyboardType,
  editable,
}) => {
  return (
    <TextInput
      editable={editable}
      autoCapitalize="none"
      value={formik.values[value]}
      onChangeText={
        e => {
          if (value === 'mt_id') formik.setFieldValue('mt_idChecked', false);
          if (value === 'mt_nickname')
            formik.setFieldValue('mt_nickNameChecked', false);
          formik.setFieldValue(value, e);
          // formik.handleChange(value, e);
        }
        // val.replace(/\s/g, '');
      }
      onBlur={formik.handleBlur(value)}
      error={formik.errors}
      style={{
        ...styles.input,
        flex: flex,
        marginTop,
        marginBottom,
      }}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType ?? null}
      numberOfLines={1}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
  },
});
