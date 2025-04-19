import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React from 'react';

const ItemSchedule = ({onPress, imageSource, tenKhu, trangThaiTuoi, schedules, hasSchedules}) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.img}>
        <Image style={styles.imgStyle} source={imageSource} />
      </View>
      <View style={styles.content}>
        <Text style={styles.header2}>{tenKhu}</Text>
        <View style={styles.FrameShowSchedule}>
          {hasSchedules ? (
            <>
              {schedules && schedules.slice(0, 2).map(item => (
                <BtnShowSchedule
                  key={item._id}
                  textBtnSchedule={`${item.startTime}/${item.duration} phút`}
                />
              ))}
              {schedules && schedules.length > 2 && <Text style={styles.moreText}>...</Text>}
            </>
          ) : (
            <Text style={styles.noScheduleText}>Chưa có lịch</Text>
          )}
        </View>
        <Text style={styles.textStyle}>{trangThaiTuoi}</Text>
      </View>
    </TouchableOpacity>
  );
};

const BtnShowSchedule = ({textBtnSchedule}) => {
  return (
    <View style={styles.btn}>
      <Text style={styles.textBtn}>{textBtnSchedule}</Text>
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
    height: 'auto',
    width: 'auto',
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
    marginTop: 8,
  },
  FrameShowSchedule: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    minHeight: 30,
    alignItems: 'center',
  },
  btn: {
    height: 25,
    width: 'auto',
    backgroundColor: '#EFEFEF',
    borderRadius: 12,
    justifyContent: 'center',
    marginRight: 5,
    marginBottom: 5,
  },
  textBtn: {
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
    fontSize: 12,
  },
  moreText: {
    fontSize: 20,
    color: '#636363',
    alignSelf: 'center',
  },
  noScheduleText: {
    fontSize: 15,
    color: '#636363',
    fontStyle: 'italic',
  },
  textNumClock: {
    fontSize: 40,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  textTimer: {
    fontSize: 20,
    fontWeight: '500',
    justifyContent: 'center',
  },
});
