import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';

const getBorderColor = (
  nhietDo,
  doAm,
  tempThreshold = {min: 10, max: 25},
  humidityThreshold = {min: 10, max: 25},
) => {
  const isTempInRange =
    nhietDo >= tempThreshold.min && nhietDo <= tempThreshold.max;
  const isHumidityInRange =
    doAm >= humidityThreshold.min && doAm <= humidityThreshold.max;

  // return isTempInRange ? 'green' : 'red';
  return isTempInRange && isHumidityInRange ? 'green' : 'red';
};

const ItemHomePage = ({
  name_area,
  temperature,
  moisture,
  water,
  wind,
  img_area,
  luminosity,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.item,
        {
          borderWidth: 2,
          borderColor: getBorderColor(temperature, moisture),
        },
      ]}
      onPress={onPress}>
      <FastImage
        style={styles.imgStyle}
        source={{
          uri: img_area,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.content}>
        <Text style={styles.header2} numberOfLines={1}>
          {name_area}
        </Text>
        <Text style={styles.textStyle}>Nhiệt độ: {temperature}°C</Text>
        <Text style={styles.textStyle}>Độ ẩm: {moisture}%</Text>
        <Text style={styles.textStyle}>Trạng thái tưới: {water}</Text>
        <Text style={styles.textStyle}>Quạt: {wind}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ItemHomePage;

const styles = StyleSheet.create({
  item: {
    height: 300,
    width: '100%',
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
    overflow: 'hidden', // Giúp ảnh và content bo tròn theo borderRadius
  },
  imgStyle: {
    width: '100%',
    height: 130,
  },
  content: {
    height: 170,
    width: '95%',
    justifyContent: 'center',
    paddingLeft: 10,
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
