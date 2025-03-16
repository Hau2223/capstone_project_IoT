import {StyleSheet, Text, View, TouchableOpacity,Image, FlatList} from 'react-native';
import React from 'react';

const ItemSchedule = ({onPress, imageSource, tenKhu, trangThaiTuoi}) => {
  const dataTimer= [
    {
      id:'1',
      hour:'07:00',
      setTime:'15'
    },
    {
      id:'2',
      hour:'09:00',
      setTime:'15'
    },
    {
      id:'3',
      hour:'08:00',
      setTime:'15'
    }
  ]
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.img}>
        <Image style={styles.imgStyle} source={imageSource} />
      </View>
      <View style={styles.content}>
        <Text style={styles.header2}>{tenKhu}</Text>
        <View style={styles.FrameShowSchedule}>
          {dataTimer.slice(0, 2).map((item) => (
            <BtnShowSchedule
              key={item.id}
              textBtnSchedule={`${item.hour}/${item.setTime} phút`}
            />
          ))}
          {dataTimer.length > 2 && <Text style={styles.moreText}>...</Text>}
        </View>
        <Text style={styles.textStyle}>{trangThaiTuoi}</Text>
      </View>
    </TouchableOpacity>
  );
};

const BtnShowSchedule = ({textBtnSchedule}) => {
  return (
    <View style={styles.btn}>
      <Text style={styles.textBtn}>
        {textBtnSchedule}     
      </Text>
    </View>
  );
};

export default ItemSchedule;

const styles = StyleSheet.create({
  item: {
    height: 120,
    width: '95%',
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 7,
    margin: 7,
    alignItems: 'center',
  },
  img: {
    height: "auto",
    width: "auto",
  },
  imgStyle: {
    width: 105,
    height: 105,
    marginLeft: 7,
    borderRadius: 4,
},
  content: {
    height: 120,
    width: 'auto',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  header2: {
    color: '#000000',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  textStyle: {
    color: '#636363',
    fontSize: 15,
    marginTop:8
  },

  FrameShowSchedule:{
    flexDirection:"row",
    width:"100%",
  },
  btn:{
    height:30,
    width:"auto",
    backgroundColor:"#EFEFEF",
    borderRadius:16,
    justifyContent:"center",
    marginRight:5
  },
  textBtn:{
    textAlign:"center",
    marginLeft:12,
    marginRight:12
  },
  moreText: {
    fontSize: 25,
    color: '#636363',
    
  },
});
