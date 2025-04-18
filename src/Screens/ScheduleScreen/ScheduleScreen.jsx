import { StyleSheet, Text, View,FlatList, Dimensions } from 'react-native';
import React from 'react';
import ItemSortSchedule from '../../components/ItemSortSchedule';

const screenWidth = Dimensions.get('window').width;
const itemSpacing = 20;
const itemWidth = (screenWidth - itemSpacing * 3) / 2;

const data = [
  {
    id: '1',
    soLuong: '2',
    iconImg: require('../../../assets/icon/iconLightYellow.png'),
  },
  {
    id: '2',
    soLuong: '5',
    iconImg: require('../../../assets/icon/iconLightYellow.png'),

  },
  {
    id: '3',
    soLuong: '2',
    iconImg: require('../../../assets/icon/iconLightYellow.png'),
  },
  {
    id: '4',
    soLuong: '5',
    iconImg: require('../../../assets/icon/iconLightYellow.png'),

  },
  {
    id: '4',
    soLuong: '5',
    iconImg: require('../../../assets/icon/iconLightYellow.png'),

  },
];

const ScheduleScreen = ({navigation}) => {

  const handleGoToListDevices = item => {
    navigation.navigate('DevicesListScreen', {item});
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
              numColumns={2}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <View style={[styles.itemWrapper, { width: itemWidth }]}>
                  <ItemSortSchedule
                    content={item.soLuong}
                    img={item.iconImg}
                    onPress={() => handleGoToListDevices(item)}
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
    backgroundColor: '#EAEAEA',
    paddingTop: 20,
    alignItems: 'center',
  },

  itemWrapper: {
    alignItems: 'center',
    width: '100%',
  },

  listContainer: {
    paddingBottom: 180,
  },
  itemWrapper: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
});