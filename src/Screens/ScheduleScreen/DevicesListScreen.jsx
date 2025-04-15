import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, FlatList } from 'react-native';
import ItemSchedule from '../../components/ItemSchedule';
import { getAllDevices } from '../../../services/deviceServices';

const DevicesListScreen = ({ navigation, route }) => {
  const controlName = route.params?.controlName
  const [devices, setDevices] = useState([]);
  const idUser = route.params?.idUser || '67f9ff224c36c6ad57e60434'; // Giả định idUser, thay bằng logic thực tế của bạn

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await getAllDevices();
        const allDevices = res?.data || []; // Giả sử API trả về mảng trong `data`

        console.log('Tất cả thiết bị từ API:', allDevices);

        // 🔍 Lọc thiết bị theo idUser, controlName và schedules không rỗng
        const filteredDevices = allDevices
          .filter(device =>
            device.members?.some(member => member.userId === idUser) &&
            device.controls?.some(
              control => 
                control.name === controlName && 
                control.schedules?.length > 0
            )
          )
          .map((device, index) => {
            const waterControl = device.controls.find(c => c.name === controlName);
            return {
              id: device._id,
              tenKhu: device.name_area || `Khu ${index + 1}`,
              trangThaiTuoi: `Trạng thái tưới: ${waterControl?.status ? 'ON' : 'OFF'}`,
              imageSource: { uri: device.img_area } || require('../../../assets/img/1.png'),
              scheduleInfo: waterControl?.schedules?.[0], // Lấy lịch đầu tiên nếu có
              schedules: waterControl?.schedules || [], // Lưu tất cả lịch để dùng nếu cần
            };
          });

        setDevices(filteredDevices);
        console.log('Danh sách thiết bị:', filteredDevices);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách thiết bị:', err.message);
      }
    };

    fetchDevices();
  }, [controlName, idUser]);

  const handleGoToAlarm = item => {
    navigation.navigate('AlarmScreen', { item });
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
          data={devices}
          numColumns={1}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
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

export default DevicesListScreen;

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