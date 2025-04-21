import {onPress,TouchableOpacity,FlatList,Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const data = [
  {
    id: '1',
    tenKhu: '1',
    nhietDo: '19°C',
    doAm: '25%',
    trangThaiTuoi: 'OFF',
    quat: 'ON',
    imageSource: require('../../../assets/img/1.png'),
    anhSang: '20%',
  },
  {
    id: '2',
    tenKhu: '2',
    nhietDo: '21°C',
    doAm: '30%',
    trangThaiTuoi: 'ON',
    quat: 'OFF',
    imageSource: require('../../../assets/img/1.png'),
    anhSang: '30%',
  },
  {
    id: '3',
    tenKhu: '3',
    nhietDo: '18°C',
    doAm: '28%',
    trangThaiTuoi: 'OFF',
    quat: 'ON',
    imageSource: require('../../../assets/img/1.png'),
    anhSang: '10%',
  },
  {
    id: '4',
    tenKhu: '4',
    nhietDo: '20°C',
    doAm: '35%',
    trangThaiTuoi: 'ON',
    quat: 'OFF',
    imageSource: require('../../../assets/img/1.png'),
    anhSang: '20%',
  },
  {
    id: '5',
    tenKhu: '5',
    nhietDo: '22°C',
    doAm: '40%',
    trangThaiTuoi: 'OFF',
    quat: 'ON',
    imageSource: require('../../../assets/img/1.png'),
    anhSang: '30%',
  },
  {
    id: '6',
    tenKhu: '6',
    nhietDo: '22°C',
    doAm: '40%',
    trangThaiTuoi: 'OFF',
    quat: 'ON',
    imageSource: require('../../../assets/img/1.png'),
    anhSang: '40%',
  },
];

const ReportScreen = ({navigation}) => {
    const handleGoToDetail = (item) => {
        navigation.navigate('ReportDetail', { item }); // Chuyển dữ liệu sang DetailItem
      };

  return (
    <View style={styles.frame}>
      <View style={styles.header}>
        <View style={styles.header1}>
          <Text style={styles.textHeader}>Phân tích dữ liệu</Text>
        </View>
      </View>
      <View style={styles.container}>
        <FlatList
          data={data}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.itemWrapper}>
              <ItemArea
                nameArea={'Khu ' + item.tenKhu}
                nhietDo={'Nhiệt độ: ' + item.nhietDo}
                doAm={'Độ ẩm: ' + item.doAm}
                trangThaiTuoi={'Trạng thái tưới: ' + item.trangThaiTuoi}
                quat={'Quạt: ' + item.quat}
                imageSource={item.imageSource}
                anhSang={item.anhSang}
                onPress={() => handleGoToDetail(item)}
              />
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

const ItemArea = ({nameArea, imageSource,onPress}) => {
  return (
    <TouchableOpacity style={styles.frameItem} onPress={onPress}>
      <Image
        style={styles.img}
        source={imageSource}
        blurRadius={1}
      />
      <View style={styles.overlay}>
        <Text style={styles.txtArea}>{nameArea}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  frame: {
    height: '100%',
    width: '100%',
    backgroundColor: '#EAEAEA',
  },
  header: {
    height: 70,
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
  },
  header1: {
    height: 70,
    width: '80%',
    justifyContent: 'center',
  },
  textHeader: {
    color: '#206477',
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  container: {
    height: 'auto',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  frameItem: {
    height: 170,
    width: 170,
    borderRadius: 15,
    position: 'relative',
    margin:15
    
  },
  img: {
    height: '100%',
    width: '100%',
    borderRadius: 15,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(131, 120, 120, 0.09)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtArea: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },

  itemWrapper: {
    alignItems: 'center',
    width: '50%',
  },
  listContainer: { 
    paddingHorizontal: 10, 
    paddingVertical: 10 
  },
});
