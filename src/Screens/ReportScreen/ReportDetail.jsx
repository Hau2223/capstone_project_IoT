import { StyleSheet, TouchableOpacity, Text, View, Animated } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { LineChart } from 'react-native-gifted-charts';
import DateTimePicker from '@react-native-community/datetimepicker';

const getWeekday = dateString => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date(dateString).getDay()];
};

const getWeekRange = selectedDate => {
  let startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));
  let endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return { startOfWeek, endOfWeek };
};

const dataSoLanTuoi = [
  { date: '2025-01-01', value: 14 },
  { date: '2025-01-02', value: 15 },
  { date: '2025-01-03', value: 15 },
  { date: '2025-01-04', value: 12 },
  { date: '2025-01-05', value: 12 },
  { date: '2025-01-06', value: 7 },
  { date: '2025-01-07', value: 13 },
  { date: '2025-01-08', value: 17 },
  { date: '2025-01-09', value: 13 },
  { date: '2025-01-10', value: 15 },
  { date: '2025-01-11', value: 17 },
  { date: '2025-01-12', value: 13 },
  { date: '2025-01-13', value: 14 },
  { date: '2025-01-14', value: 12 },
  { date: '2025-01-15', value: 18 },
  { date: '2025-01-16', value: 19 },
  { date: '2025-01-17', value: 15 },
  { date: '2025-01-18', value: 10 },
  { date: '2025-01-19', value: 12 },
  { date: '2025-01-20', value: 14 },
  { date: '2025-01-21', value: 13 },
  { date: '2025-01-22', value: 10 },
  { date: '2025-01-23', value: 9 },
  { date: '2025-01-24', value: 12 },
  { date: '2025-01-25', value: 13 },
  { date: '2025-01-26', value: 15 },
  { date: '2025-01-27', value: 14 },
  { date: '2025-01-28', value: 12 },
  { date: '2025-01-29', value: 10 },
  { date: '2025-01-30', value: 9 },
  { date: '2025-01-31', value: 11 },
  { date: '2025-02-01', value: 13 },
  { date: '2025-02-02', value: 14 },
  { date: '2025-02-03', value: 12 },
  { date: '2025-02-04', value: 10 },
  { date: '2025-02-05', value: 9 },
  { date: '2025-02-06', value: 11 },
  { date: '2025-02-07', value: 13 },
  { date: '2025-02-08', value: 12 },
  { date: '2025-02-09', value: 10 },
  { date: '2025-02-10', value: 11 },
  { date: '2025-02-11', value: 13 },
  { date: '2025-02-12', value: 14 },
  { date: '2025-02-13', value: 15 },
  { date: '2025-02-14', value: 13 },
  { date: '2025-02-15', value: 12 },
  { date: '2025-02-16', value: 10 },
  { date: '2025-02-17', value: 11 },
  { date: '2025-02-18', value: 12 },
  { date: '2025-04-01', value: 12 },
  { date: '2025-04-02', value: 7 },
  { date: '2025-04-03', value: 3 },
  { date: '2025-04-04', value: 7 },
  { date: '2025-04-05', value: 3 },
  { date: '2025-04-06', value: 14 },
  { date: '2025-04-07', value: 17 },
  { date: '2025-04-08', value: 18 },
  { date: '2025-04-09', value: 14 },
  { date: '2025-04-10', value: 11 },
  { date: '2025-04-11', value: 6 },
  { date: '2025-04-12', value: 7 },
  { date: '2025-04-13', value: 2 },
  { date: '2025-04-14', value: 9 },
  { date: '2025-04-15', value: 10 },
].map(record => ({...record, label: getWeekday(record.date)}));

const dataSoLanDen = [
  { date: '2025-01-01', value: 8 }, 
  { date: '2025-01-02', value: 10 },
  { date: '2025-01-03', value: 12 },
  { date: '2025-01-04', value: 14 },
  { date: '2025-01-05', value: 13 },
  { date: '2025-01-06', value: 7 },
  { date: '2025-01-07', value: 11 },
  { date: '2025-01-08', value: 10 },
  { date: '2025-01-09', value: 9 },
  { date: '2025-01-10', value: 12 },
  { date: '2025-01-11', value: 15 },
  { date: '2025-01-12', value: 11 },
  { date: '2025-01-13', value: 13 },
  { date: '2025-01-14', value: 10 },
  { date: '2025-01-15', value: 8 },
  { date: '2025-01-16', value: 9 },
  { date: '2025-01-17', value: 11 },
  { date: '2025-01-18', value: 10 },
  { date: '2025-01-19', value: 12 },
  { date: '2025-01-20', value: 14 },
  { date: '2025-01-21', value: 13 },
  { date: '2025-01-22', value: 10 },
  { date: '2025-01-23', value: 9 },
  { date: '2025-01-24', value: 12 },
  { date: '2025-01-25', value: 13 },
  { date: '2025-01-26', value: 15 },
  { date: '2025-01-27', value: 14 },
  { date: '2025-01-28', value: 12 },
  { date: '2025-01-29', value: 10 },
  { date: '2025-01-30', value: 9 },
  { date: '2025-01-31', value: 11 },
  { date: '2025-02-01', value: 13 },
  { date: '2025-02-02', value: 14 },
  { date: '2025-02-03', value: 12 },
  { date: '2025-02-04', value: 10 },
  { date: '2025-02-05', value: 9 },
  { date: '2025-02-06', value: 11 },
  { date: '2025-02-07', value: 13 },
  { date: '2025-02-08', value: 12 },
  { date: '2025-02-09', value: 10 },
  { date: '2025-02-10', value: 11 },
  { date: '2025-02-11', value: 13 },
  { date: '2025-02-12', value: 14 },
  { date: '2025-02-13', value: 15 },
  { date: '2025-02-14', value: 13 },
  { date: '2025-02-15', value: 12 },
  { date: '2025-02-16', value: 10 },
  { date: '2025-02-17', value: 11 },
  { date: '2025-02-18', value: 12 },
  { date: '2025-04-01', value: 13 },
  { date: '2025-04-02', value: 14 },
  { date: '2025-04-03', value: 15 },
  { date: '2025-04-04', value: 13 },
  { date: '2025-04-05', value: 12 },
  { date: '2025-04-06', value: 10 },
  { date: '2025-04-07', value: 11 },
  { date: '2025-04-08', value: 12 },
  { date: '2025-04-09', value: 11 },
  { date: '2025-04-10', value: 12 },
  { date: '2025-04-11', value: 11 },
  { date: '2025-04-12', value: 12 },
  { date: '2025-04-13', value: 12 },
  { date: '2025-04-14', value: 11 },
  { date: '2025-04-15', value: 12 },
].map(record => ({...record, label: getWeekday(record.date)}));

const WeekSelector = ({ onSelectWeek }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleDateChange = (_, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      // Add press animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        })
      ]).start();

      setDate(selectedDate);
      onSelectWeek(getWeekRange(selectedDate));
    }
  };

  return (
    <View style={styles.containerData}>
      <View style={styles.weekSelectorContainer}>
        <Text style={styles.chartTitle}>📊 Thống kê số lần tưới & bật đèn</Text>
        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setShow(true)}
        activeOpacity={0.7}
      >
        <Animated.Text 
          style={[
            styles.weekText,
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          Tuần: {getWeekRange(date).startOfWeek.toDateString()} -{' '}
          {getWeekRange(date).endOfWeek.toDateString()}
        </Animated.Text>
      </TouchableOpacity>
      <View style={styles.detailLine}>
        <View style={styles.detail}>
          <View style={styles.detailColor1} />
          <Text style={styles.txtDetail}>Số lần tưới</Text>
        </View>
        <View style={styles.detail}>
          <View style={styles.detailColor2} />
          <Text style={styles.txtDetail}>Số lần bật đèn</Text>
        </View>
      </View>
    </View>
  );
};

const LineChartComponent = ({ data1, data2 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  }, [data1, data2]);

  console.log('Data1 (Số lần tưới):', data1);
  console.log('Data2 (Số lần bật đèn):', data2);
  return (
    <Animated.View 
      style={[
        styles.chartContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <LineChart
        data={data1}
        data2={data2}
        color="#25A4FF"
        color2="#FF5733"
        thickness={3}
        thickness2={3}
        showDataPoints
        dataPointsColor="#25A4FF"
        dataPointsColor2="#FF5733"
        dataPointsRadius={5}
        yAxisColor="#333"
        xAxisColor="#333"
        adjustToWidth={false}
        width={330}
        spacing={48}
        areaChart
        scrollEnabled={false}
        startFillColor="#25A4FF"
        endFillColor="#25A4FF"
        startOpacity={0.4}
        endOpacity={0}
        startFillColor2="#FF5733"
        endFillColor2="#FF5733"
        startOpacity2={0.4}
        endOpacity2={0}
        animateOnDataChange={true}
        animationDuration={500}
        
        pointerConfig={{
          pointerStripHeight: 160,
          pointerStripWidth: 2,
          pointerStripColor: '#888',
          pointerColor: '#000',
          radius: 6,
          pointerLabelWidth: 100,
          pointerLabelHeight: 60,
          activatePointersOnLongPress: true, // Giữ true, sẽ thử false nếu cần
          autoAdjustPointerLabelPosition: true,
          pointer1: { color: '#25A4FF' }, // Pointer cho đường số lần tưới
          pointer2: { color: '#FF5733' }, // Pointer cho đường số lần bật đèn
          pointerLabelComponent: items => {
            console.log('Full items object:', items);
        
            // Lấy date từ items (giả sử items[0] là điểm được nhấn)
            const selectedDate = items[0]?.date; // Date của điểm được nhấn
            console.log('Selected Date:', selectedDate);
        
            // Tìm index trong data1 và data2 dựa trên date
            const index = data1.findIndex(item => item.date === selectedDate);
            console.log('Resolved Index:', index);
            console.log('Data1 at index:', data1[index]);
            console.log('Data2 at index:', data2[index]);
        
            // Nếu không tìm thấy index, fallback về 0
            const finalIndex = index !== -1 ? index : 0;
        
            const value1 = data1[finalIndex]?.value || 0;
            const value2 = data2[finalIndex]?.value || 0;
        
            return (
              <View style={styles.pointerLabel}>
                <Text style={styles.pointerText}>Tưới: {value1}</Text>
                <Text style={styles.pointerText}>Đèn: {value2}</Text>
              </View>
            );
          },
        }}
      />
    </Animated.View>
  );
};

const ReportDetail = () => {
  const [weekRange, setWeekRange] = useState(null);
  const [filteredData1, setFilteredData1] = useState([]);
  const [filteredData2, setFilteredData2] = useState([]);

  const handleSelectDate = range => {
    setWeekRange(range);
    let weekDays = Array.from({ length: 7 }, (_, i) => {
      let date = new Date(range.startOfWeek);
      date.setDate(date.getDate() + i);
      let dateString = date.toISOString().split('T')[0];
      return { date: dateString, label: getWeekday(dateString) };
    });

    setFilteredData1(
      weekDays.map(day => ({
        ...day,
        value: dataSoLanTuoi.find(d => d.date === day.date)?.value ?? 0,
      })),
    );
    setFilteredData2(
      weekDays.map(day => ({
        ...day,
        value: dataSoLanDen.find(d => d.date === day.date)?.value ?? 0,
      })),
    );
  };

  // Tự động đổ dữ liệu tuần hiện tại khi vào trang
  useEffect(() => {
    const currentDate = new Date('2025-04-07'); // Ngày hiện tại theo hệ thống
    const currentWeek = getWeekRange(currentDate); // Sử dụng getWeekRange toàn cục
    handleSelectDate(currentWeek);
  }, []);

  return (
    <View style={styles.frame}>
      <View style={styles.header}>
        <View style={styles.header1}>
          <Text style={styles.textHeader}>Phân tích dữ liệu</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.frameTable}>
          <WeekSelector onSelectWeek={handleSelectDate} />
          {weekRange ? (
            <LineChartComponent data1={filteredData1} data2={filteredData2} />
          ) : (
            <Text style={styles.noDataText}>⏳ Vui lòng chọn một tuần để xem dữ liệu</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default ReportDetail;

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
  container: {
    alignItems: 'center',
    marginTop: 30,
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
  frameTable: {
    width: '95%',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    borderColor: '#D1D1D1',
    borderWidth: 2,
    overflow: 'hidden',
  },
  containerData: {
    width: '100%',
    marginTop: 20,
  },
  weekSelectorContainer: {
    width: '100%',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    width: 'auto',
    height: 'auto',
  },
  weekText: {
    textAlign: 'center',
    margin: 15,
    color: '#5787E5',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  chartContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginTop: 20,
    marginBottom: 20,
  },
  detailLine: {
    height: 50,
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  detailColor1: {
    width: 40,
    height: 3,
    backgroundColor: '#25A4FF',
    transform: [{ rotate: '-30deg' }],
  },
  detailColor2: {
    width: 40,
    height: 3,
    backgroundColor: '#FF5733',
    transform: [{ rotate: '-30deg' }],
  },
  txtDetail: {
    fontSize: 17,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  pointerLabel: {
    backgroundColor: '#333',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
  },
  pointerText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});