import {StyleSheet, Text, View, Image,TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ItemSortSchedule = ({img,content, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.frame1}>
        <Image
          source={img}
          style={styles.alertIcon}
        />
        <Text style={styles.Content}>Số lượng khu hẹn giờ: {content}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ItemSortSchedule;

const styles = StyleSheet.create({
  container: {
    height: 220,
    width: '100%',
    backgroundColor: '#217E54',
    flexDirection: 'column',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame1: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25,
  },
  alertIcon: {
    height: 100,
    width: 100,
  },
  Content: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
