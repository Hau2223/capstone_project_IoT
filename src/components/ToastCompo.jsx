import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BaseToast } from 'react-native-toast-message';

const ToastCompo = {
  custom_toast: ({ text1, text2 }) => (
    <BaseToast
      style={{ height: 80, borderLeftColor: '#00b894' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1={text1}
      text2={text2}
      text1Style={{ fontSize: 18, fontWeight: 'bold' }}
      text2Style={{ fontSize: 14 }}
    />
  ),
};

export default memo(ToastCompo);