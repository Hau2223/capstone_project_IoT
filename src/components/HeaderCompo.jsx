import {StyleSheet, Text, View} from 'react-native';
import React, { memo } from 'react';
import IconOni from 'react-native-vector-icons/Ionicons';
import colors from '../../assets/common/colorCss';

const HeaderCompo = ({name, isPress, color, bgcolor, height}) => {
  return (
    <View style={[styles.container, {backgroundColor: bgcolor || colors.white, height: height || 60,}]}>
      <IconOni
        name="chevron-back"
        size={24}
        color={color || colors.black}
        style={styles.iconHeader}
        onPress={isPress}
      
      />
      <Text style={[styles.txtHeader, {color: color || colors.black}]}>{name}</Text>
    </View>
  );
};

export default memo(HeaderCompo);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconHeader: {
    position: 'absolute',
    left: 10,
    padding: 5,
  },
  txtHeader: {
    fontSize: 27,
    fontWeight: 'bold',
  },
});
