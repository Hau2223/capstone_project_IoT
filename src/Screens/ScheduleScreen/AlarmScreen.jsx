import {StyleSheet, Text, View,FlatList} from 'react-native';
import {React, useState} from 'react';
import {Switch} from 'react-native-paper';

const AlarmScreen = ({route,navigation}) => {

  const [data, setData] = useState([
    { id: '1', numbClock: '06:00', timer: '30 phút', calendar: 'T.3, T.5, T.7', isWatering: true },
    { id: '2', numbClock: '07:30', timer: '45 phút', calendar: 'T.2, T.4, T.6', isWatering: true },
    { id: '3', numbClock: '08:15', timer: '60 phút', calendar: 'C.N, T.5', isWatering: true },
  ]);

  const {item} = route.params;

  const toggleSwitch = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, isWatering: !item.isWatering } : item
      )
    );
  };

  const handleGoToSetTimer = (item) => {
    navigation.navigate('SetTimerScreen', { item });}
  return (
    <View>
      <View style={styles.header}>
        <View style={styles.header1}>
          <Text style={styles.textHeader}>{item.tenKhu}</Text>
        </View>
      </View>
      <View style={styles.itemAlarm}>
        <FlatList
            data={data}
            numColumns={1}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.itemWrapper}>
                <ItemAlarm
                  numbClock={item.numbClock}
                  timer={item.timer}
                  calendar={item.calendar}
                  isWatering={item.isWatering}
                  toggleSwitch={() => toggleSwitch(item.id)}
                  onPress={() => handleGoToSetTimer(item)}
                />
              </View>
            )}
          />
      </View>
    </View>
  );
};

const ItemAlarm = ({ isWatering,toggleSwitch,numbClock,timer,calendar }) => {

  return (
    <View style={styles.frameItem} onPress={() => handleGoToSetTimer(item)}>
      <View style={styles.content1}>
        <View style={styles.textNumClock}>
          <Text style={styles.txtNumClock}>{numbClock}</Text>
        </View>
        <View style={styles.textTimer}>
          <Text style={styles.txtTimer}>{timer}</Text>
        </View>
      </View>
      <View style={styles.content2}>
          <View style={styles.txtLich}>
            <Text style={styles.txtTimer}>{calendar}</Text>
          </View>
          <View style={styles.btnWatering}>
            <Switch
              value={isWatering}
              onValueChange={toggleSwitch}
              trackColor={{false: 'white', true: 'white'}}
              thumbColor={isWatering ? '#63A776' : '#ACACAC'}
              style={{transform: [{scale: 1.7}]}}
            />
          </View>
      </View>
    </View>
  );
};

export default AlarmScreen;

const styles = StyleSheet.create({
  header: {
    height: 70,
    width: '100%',
    marginTop: 20,
  },
  header1: {
    height: 70,
    width: '100%',
    justifyContent: 'center',
  },
  textHeader: {
    color: '#000000',
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  itemAlarm: {
    height: "auto",
    width: '100%',
    alignItems: 'center',
    marginTop:10
  },

  //css ItemAlarm
  frameItem: {
    height: 90,
    width: '95%',
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#C8BFBF',
    marginBottom:10
  },
  content1: {
    height: 'auto',
    width: '50%',
    flexDirection: 'column',
  },

  textNumClock: {
    height: '50%',
    width: '100%',
    flexDirection: 'row',
  },
  textTimer: {
    height: '50%',
    width: '100%',
  },
  txtNumClock: {
    fontSize: 35,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  txtTimer: {
    fontSize: 18,
    fontWeight: '500',
    justifyContent: 'center',
  },

  content2: {
    height: 'auto',
    width: '50%',
    flexDirection:'row',
  },
  txtLich:{
    height:'100%',
    width:'50%',
    alignItems:'flex-end',
    justifyContent:'center',
  },
  btnWatering: {
    height: '100%',
    width: '50%',
    alignItems:'center',
    justifyContent:'center',
    
  },

  itemWrapper: {
    alignItems: 'center',
    width: '100%',
  },
});
