import {StyleSheet, Text, View, Image} from 'react-native';
import React, {memo, useState} from 'react';
// import OnOffBtn from '../../components/Button/OnOff';
import {Switch} from 'react-native-paper';

const DetailScreen = ({route}) => {
  const {item} = route.params;
  const [isWatering, setIsWatering] = useState(false);
  const [isFan, setIsFan] = useState(false);

  return (
    <View style={styles.frame}>
      <View style={styles.img}>
        <Image style={styles.imgStyle} source={item.imageSource} />
      </View>
      <View style={styles.content}>
        <Text style={styles.header2}>Khu {item.tenKhu}</Text>
        <View style={styles.content1}>
          <Text style={styles.textStyle}>Nhiệt độ: {item.nhietDo}</Text>
          <Text style={styles.textStyle}>Độ ẩm đất: {item.doAm}</Text>
          <Text style={styles.textStyle}>Ánh sáng: {item.anhSang}</Text>
          <View style={styles.settingOnOff}>
            <View style={styles.frameIconLight}>
              <Image
                style={styles.iconLight}
                source={require('../../../assets/icon/iconLight.png')}
              />
            </View>
            <View style={styles.frameTxtLight}>
              <Text style={styles.txtLightLevel}>
                Cài đặt mức sáng bật/tắt đèn
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.content2}>
          <View style={styles.frameTuoiQuat}>
            <View style={styles.contentTuoiQuat}>
              <Text style={styles.textStyle}>Trạng thái tưới</Text>
            </View>
            <View style={styles.buttonTuoiQuat}>
              <Switch
                value={isWatering}
                onValueChange={newValue => setIsWatering(newValue)}
                trackColor={{false: 'white', true: 'white'}}
                thumbColor={isWatering ? '#63A776' : '#ACACAC'}
                style={{transform: [{scale: 1.5}]}}
              />
            </View>
          </View>
          <View style={styles.frameTuoiQuat}>
            <View style={styles.contentTuoiQuat}>
              <Text style={styles.textStyle}>Trạng thái quạt</Text>
            </View>
            <View style={styles.buttonTuoiQuat}>
              <Switch
                value={isFan}
                onValueChange={newValue => setIsFan(newValue)}
                trackColor={{false: 'white', true: 'white'}}
                thumbColor={isFan ? '#63A776' : '#ACACAC'}
                style={{transform: [{scale: 1.5}]}}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(DetailScreen);

const styles = StyleSheet.create({
  frame: {
    height: '100%',
    width: '100%',
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
  },
  img: {
    height: 263,
    width: '95%',
    backgroundColor: 'red',
    borderRadius: 5,
    marginTop: 10,
  },
  content: {
    height: 400,
    width: '95%',
    marginTop: 15,
  },
  imgStyle: {
    width: '100%',
    height: 263,
    borderRadius: 5,
  },
  header2: {
    color: '#206477',
    fontSize: 32,
    fontWeight: 'bold',
    margin: 10,
  },
  content1: {
    height: 'auto',
    width: '100%',
    padding: 10,
    paddingLeft: 15,
  },
  content2: {
    height: 'auto',
    width: '100%',
    marginTop: 10,
  },
  frameTuoiQuat: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 15,
    marginTop: 5,
  },
  contentTuoiQuat: {
    height: '100%',
    width: '70%',
    justifyContent: 'center',
  },
  buttonTuoiQuat: {
    height: '100%',
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },

  textStyle: {
    color: '#636363',
    fontSize: 23,
    marginTop: 5,
    marginBottom: 5,
  },
  line: {
    height: 2,
    backgroundColor: '#000000',
    marginVertical: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  settingOnOff: {
    flexDirection: 'row',
    width: '100%',
    height: 'auto',
    alignItems: 'center',
  },
  frameIconLight: {
    height: 25,
    width: 25,
  },
  iconLight: {
    height: 25,
    width: 'auto',
  },
  txtLightLevel: {
    color: '#636363',
    fontSize: 18,
    marginLeft: 7,
    // color: '#5787E5',
    textDecorationLine: 'underline',
  },
});
