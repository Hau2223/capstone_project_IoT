import {StyleSheet, Text, View,Image,FlatList,TextInput,Button, ScrollView} from 'react-native';
import React, { useState } from 'react';
import ItemHomePage from '../components/ItemHomePage';

const data = [
  { id: '1', tenKhu: 'Khu 1', nhietDo: 'Nhiệt độ: 19°C', doAm: 'Độ ẩm đất: 25%', trangThaiTuoi: 'Trạng thái tưới: OFF', quat: 'Quạt: ON',imageSource: require('../../assets/img/1.png'), },
  { id: '2', tenKhu: 'Khu 2', nhietDo: 'Nhiệt độ: 21°C', doAm: 'Độ ẩm đất: 30%', trangThaiTuoi: 'Trạng thái tưới: ON', quat: 'Quạt: OFF',imageSource: require('../../assets/img/1.png'), },
  { id: '3', tenKhu: 'Khu 3', nhietDo: 'Nhiệt độ: 18°C', doAm: 'Độ ẩm đất: 28%', trangThaiTuoi: 'Trạng thái tưới: OFF', quat: 'Quạt: ON',imageSource: require('../../assets/img/1.png'), },
  { id: '4', tenKhu: 'Khu 4', nhietDo: 'Nhiệt độ: 20°C', doAm: 'Độ ẩm đất: 35%', trangThaiTuoi: 'Trạng thái tưới: ON', quat: 'Quạt: OFF',imageSource: require('../../assets/img/1.png'), },
  { id: '5', tenKhu: 'Khu 5', nhietDo: 'Nhiệt độ: 22°C', doAm: 'Độ ẩm đất: 40%', trangThaiTuoi: 'Trạng thái tưới: OFF', quat: 'Quạt: ON',imageSource: require('../../assets/img/1.png'), },
  { id: '6', tenKhu: 'Khu 6', nhietDo: 'Nhiệt độ: 22°C', doAm: 'Độ ẩm đất: 40%', trangThaiTuoi: 'Trạng thái tưới: OFF', quat: 'Quạt: ON',imageSource: require('../../assets/img/1.png'), },
];



const TestScreen = ({navigation}) => {
    //const [name, setName] = useState("hú");
    const handleGoToDetail = (item) => {
      navigation.navigate('DetailScreen', { item }); // Chuyển dữ liệu sang DetailItem
    };

  return (
  
    <View style={styles.frame}>
      <View style={styles.header}>
        <View style={styles.header1}>
          <Text style={styles.textHeader}>Vườn tiêu Bình Phước</Text>
        </View>
        <View style={styles.header2}>
          <Image source={require('../../assets/icon/canhBao.png')} style={{ width: 30, height: 30, resizeMode:"contain" }} />
        </View>
      </View>
      <View style={styles.container}>
          
        <FlatList
          data={data}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <ItemHomePage
                tenKhu={item.tenKhu}
                nhietDo={item.nhietDo}
                doAm={item.doAm}
                trangThaiTuoi={item.trangThaiTuoi}
                quat={item.quat}
                imageSource={item.imageSource}
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


export const styles = StyleSheet.create({
    frame: {
      height:'auto',
      width:"100%",
      backgroundColor:"#EAEAEA"
    },
    header: {
      height:70,
      width:  "100%",
      flexDirection:"row",
      marginTop: 20
    },
    header1: {
      height:70,
      width:  "80%",
      justifyContent: "center"
    },
    textHeader: {
      color:"#000000",
      fontSize:32,
      fontWeight:"bold",
      marginLeft:20
    },
    header2: {
      height:70,
      width:  "20%",
      justifyContent:"center",
      alignItems:"center"
    },
    container: {  
      height:"auto",
      width:"100%",
      flexDirection:"row",
      alignItems:"center",
      marginBottom:180
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

export default TestScreen;


