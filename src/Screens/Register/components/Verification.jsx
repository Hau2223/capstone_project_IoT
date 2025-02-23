import {StyleSheet, View} from 'react-native';
import React from 'react';
import {IMAGES} from '../../../../utils/constants';
import {OtpInput} from 'react-native-otp-entry';
import colors from '../../../../assets/common/colorCss';

const Verification = () => {
  return (
    <View style={styles.container}>
      <OtpInput
        numberOfDigits={4}
        onTextChange={text => console.log(text)}
        focusColor={colors.green}
        disabled={false}
        theme={{
          pinCodeContainerStyle: {
            backgroundColor: colors.white,
            width: 50,
            height: 50,
            borderRadius: 12,
          },
        }}
      />
    </View>
  );
};

export default Verification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
