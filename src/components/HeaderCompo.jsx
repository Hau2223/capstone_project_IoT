import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import IconOni from 'react-native-vector-icons/Ionicons';
import colors from '../../assets/common/colorCss';

const HeaderCompo = ({name, isPress}) => {
  return (
    <View style={styles.container}>
      <IconOni
        name="chevron-back"
        size={24}
        color={colors.black}
        style={styles.iconHeader}
        onPress={isPress}
      />
      <Text style={styles.txtHeader}>{name}</Text>
    </View>
  );
};

export default HeaderCompo;

const styles = StyleSheet.create({
  container: {
    height: 60,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
  },
});
