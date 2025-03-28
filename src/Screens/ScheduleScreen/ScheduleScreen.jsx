import {Image, StyleSheet, Text, View, FlatList} from 'react-native';
import React from 'react';
import ItemSchedule from '../../components/ItemSchedule';

const ScheduleScreen = ({navigation}) => {
  const data = [
    {
      id: '1',
      tenKhu: 'Khu 1',
      textBtnSchedule: 'Nhiệt độ: 19°C',
      trangThaiTuoi: 'Trạng thái tưới: OFF',
      imageSource: require('../../../assets/img/1.png'),
    },
    {
      id: '2',
      tenKhu: 'Khu 2',
      trangThaiTuoi: 'Trạng thái tưới: ON',
      imageSource: require('../../../assets/img/1.png'),
    },
    {
      id: '3',
      tenKhu: 'Khu 3',
      trangThaiTuoi: 'Trạng thái tưới: OFF',
      imageSource: require('../../../assets/img/1.png'),
    },
    {
      id: '4',
      tenKhu: 'Khu 4',
      trangThaiTuoi: 'Trạng thái tưới: ON',
      imageSource: require('../../../assets/img/1.png'),
    },
    {
      id: '5',
      tenKhu: 'Khu 5',
      trangThaiTuoi: 'Trạng thái tưới: OFF',
      imageSource: require('../../../assets/img/1.png'),
    },
    {
      id: '6',
      tenKhu: 'Khu 6',
      trangThaiTuoi: 'Trạng thái tưới: OFF',
      imageSource: require('../../../assets/img/1.png'),
    },
  ];

  const handleGoToAlarm = item => {
    navigation.navigate('AlarmScreen', {item});
  };
  return (
    <View>
      <View style={styles.header}>
        <View style={styles.header1}>
          <Text style={styles.textHeader}>Vườn tiêu Bình Phước</Text>
        </View>
      </View>
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          numColumns={1}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.itemWrapper}>
              <ItemSchedule
                tenKhu={item.tenKhu}
                trangThaiTuoi={item.trangThaiTuoi}
                imageSource={item.imageSource}
                onPress={() => handleGoToAlarm(item)}
              />
            </View>
          )}
          nestedScrollEnabled={true}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

export default ScheduleScreen;

export const styles = StyleSheet.create({
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
  container: {
    height: 'auto',
    width: '100%',
    flexDirection: 'column',
    marginBottom: 180,
  },
  itemWrapper: {
    alignItems: 'center',
    width: '100%',
  },

  listContainer: {
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
});
