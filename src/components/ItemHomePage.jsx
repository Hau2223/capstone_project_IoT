import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';

const ItemHomePage = ({
  tenKhu,
  nhietDo,
  doAm,
  trangThaiTuoi,
  quat,
  imageSource,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.img}>
        <Image style={styles.imgStyle} source={imageSource} />
      </View>
      <View style={styles.content}>
        <Text style={styles.header2}>{tenKhu}</Text>
        <Text style={styles.textStyle}>{nhietDo}</Text>
        <Text style={styles.textStyle}>{doAm}</Text>
        <Text style={styles.textStyle}>{trangThaiTuoi}</Text>
        <Text style={styles.textStyle}>{quat}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ItemHomePage;

const styles = StyleSheet.create({
  item: {
    height: 300,
    width: 180,
    backgroundColor: 'white',
    flexDirection: 'column',
    borderRadius: 7,
    margin: 13,
    borderColor:'#C96666',
    borderWidth:2,
    overflow: 'hidden',
    justifyContent:'center',
    alignItems:'center'
  },
  img: {
    height: 130,
    width: 180,
  },
  imgStyle: {
    width: 180,
    height: 130,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  content: {
    height: 170,
    width: 180,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  header2: {
    color: '#000000',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textStyle: {
    color: '#636363',
    fontSize: 15,
  },
});
