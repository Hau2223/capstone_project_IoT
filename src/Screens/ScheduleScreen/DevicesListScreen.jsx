import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, FlatList } from 'react-native';
import ItemSchedule from '../../components/ItemSchedule';
import { getAllDevices } from '../../../services/deviceServices';

const DevicesListScreen = ({ navigation, route }) => {
  const controlName = route.params?.controlName;
  const [devices, setDevices] = useState([]);
  const idUser = route.params?.idUser;

  useEffect(() => {
    const fetchDevices = async () => {
      if (!idUser) return;

      try {
        const res = await getAllDevices();
        const allDevices = res?.data || [];

        console.log('Tất cả thiết bị từ API:', allDevices);

        const filteredDevices = allDevices
          .filter(device => device.members?.some(member => member.userId === idUser))
          .map((device, index) => {
            const control = device.controls.find(c => c.name === controlName);
            const hasSchedules = control?.schedules && control.schedules.length > 0;
            
            // Sort schedules by time if they exist
            const sortedSchedules = hasSchedules ? [...control.schedules].sort((a, b) => {
              // First sort by time
              const timeA = a.startTime.split(':').map(Number);
              const timeB = b.startTime.split(':').map(Number);
              
              if (timeA[0] !== timeB[0]) {
                return timeA[0] - timeB[0];
              }
              if (timeA[1] !== timeB[1]) {
                return timeA[1] - timeB[1];
              }
              
              // If times are equal, sort by days
              const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
              const firstDayA = a.repeat[0] || '';
              const firstDayB = b.repeat[0] || '';
              
              return daysOrder.indexOf(firstDayA) - daysOrder.indexOf(firstDayB);
            }) : [];

            // Determine status text based on control type and schedule existence
            let statusText = 'Chưa có thiết bị';
            if (control) {
              if (hasSchedules) {
                statusText = `Trạng thái ${controlName === 'water' ? 'tưới' : controlName === 'light' ? 'đèn' : 'quạt'}: ${control.status ? 'ON' : 'OFF'}`;
              } else {
                statusText = `Trạng thái: - - -`;
              }
            }

            return {
              id: device._id,
              id_esp: device.id_esp,
              controlName: controlName,
              tenKhu: device.name_area || `Khu ${index + 1}`,
              trangThaiTuoi: statusText,
              imageSource: { uri: device.img_area } || require('../../../assets/img/1.png'),
              scheduleInfo: sortedSchedules[0] || null,
              schedules: sortedSchedules,
              hasSchedules: hasSchedules
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
                onPress={() => handleGoToAlarm(item)}
                imageSource={item.imageSource}
                tenKhu={item.tenKhu}
                trangThaiTuoi={item.trangThaiTuoi}
                schedules={item.schedules}
                hasSchedules={item.hasSchedules}
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