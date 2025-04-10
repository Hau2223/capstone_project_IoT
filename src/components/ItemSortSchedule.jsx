import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ItemSortSchedule = ({img,content}) => {
  return (
    <View style={styles.container}>
      <View style={styles.frame1}>
        <Image
          source={img}
          style={styles.alertIcon}
        />
        <Text style={styles.Content}>Số lượng khu hẹn giờ: {content}</Text>
      </View>
    </View>
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

  },
  frame1: {
    height: '100%',
    width: '100',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25,
    
  },
  frame2: {
    height: '30%',
    width: '100',
    backgroundColor: 'red',
  },
  alertIcon: {
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Content: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
