import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import React, {useState} from 'react';
import {LineChart} from 'react-native-gifted-charts';
import DateTimePicker from '@react-native-community/datetimepicker';

const getWeekday = dateString => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date(dateString).getDay()];
};

const dataRecords = [
  {value: 120, date: '2025-01-01'},
  {value: 80, date: '2025-01-02'},
  {value: 90, date: '2025-01-03'},
  {value: 70, date: '2025-01-04'},
  {value: 35, date: '2025-01-05'},
  {value: 20, date: '2025-01-06'},
  {value: 70, date: '2025-01-07'},
  {value: 110, date: '2025-01-08'},
  {value: 60, date: '2025-01-09'},
  {value: 80, date: '2025-01-10'},
  {value: 45, date: '2025-01-11'},
  {value: 25, date: '2025-01-12'},
  {value: 95, date: '2025-01-13'},
  {value: 130, date: '2025-01-14'},
  {value: 75, date: '2025-01-15'},
  {value: 85, date: '2025-01-16'},
  {value: 30, date: '2025-01-17'},
  {value: 60, date: '2025-01-18'},
  {value: 120, date: '2025-01-19'},
  {value: 50, date: '2025-01-20'},
  {value: 70, date: '2025-01-21'},
  {value: 110, date: '2025-01-22'},
  {value: 90, date: '2025-01-23'},
  {value: 100, date: '2025-01-24'},
  {value: 55, date: '2025-01-25'},
  {value: 40, date: '2025-01-26'},
  {value: 85, date: '2025-01-27'},
  {value: 115, date: '2025-01-28'},
  {value: 60, date: '2025-01-29'},
  {value: 90, date: '2025-01-30'},
  {value: 35, date: '2025-01-31'},
  {value: 50, date: '2025-02-01'},
  {value: 70, date: '2025-02-02'},
  {value: 100, date: '2025-02-03'},
  {value: 80, date: '2025-02-04'},
  {value: 95, date: '2025-02-05'},
  {value: 60, date: '2025-02-06'},
  {value: 75, date: '2025-02-07'},
  {value: 130, date: '2025-02-08'},
  {value: 90, date: '2025-02-09'},
  {value: 55, date: '2025-02-10'},
  {value: 70, date: '2025-02-11'},
  {value: 85, date: '2025-02-12'},
  {value: 120, date: '2025-02-13'},
  {value: 110, date: '2025-02-14'},
  {value: 95, date: '2025-02-15'},
  {value: 80, date: '2025-02-16'},
  {value: 65, date: '2025-02-17'},
  {value: 100, date: '2025-02-18'},
].map(record => ({...record, label: getWeekday(record.date)}));

const WeekSelector = ({onSelectWeek}) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const getWeekRange = selectedDate => {
    let startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(
      startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7),
    );
    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return {startOfWeek, endOfWeek};
  };

  const handleDateChange = (_, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
      onSelectWeek(getWeekRange(selectedDate));
    }
  };

  return (
    <View style={styles.weekSelectorContainer}>
      <View>
        <Text style={styles.chartTitle}>📊 Thống kê theo tuần</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => setShow(true)}>
          <Text style={styles.buttonText}>📅</Text>
        </TouchableOpacity>
      </View>
      
      
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Text style={styles.weekText}>
        Tuần: {getWeekRange(date).startOfWeek.toDateString()} -{' '}
        {getWeekRange(date).endOfWeek.toDateString()}
      </Text>
    </View>
  );
};

const LineChartComponent = ({data}) => {
  return (
    <View style={styles.chartContainer}>
      
      <LineChart
        data={data}
        color="green"
        thickness={3}
        showDataPoints
        dataPointRadius={4}
        dataPointColor="green"
        yAxisColor="green"
        xAxisColor="green"
        areaChart // Kích hoạt chế độ tô nền  
  startFillColor="rgba(27, 120, 47, 0.4)" // Màu bắt đầu của nền  / Màu kết thúc (mờ dần)  
  startOpacity={1} // Độ đậm phần trên nền  
  endOpacity={0}
      />
    </View>
  );
};

const ReportDetail = () => {
  const [weekRange, setWeekRange] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const handleSelectDate = range => {
    setWeekRange(range);
    let weekDays = Array.from({length: 7}, (_, i) => {
      let date = new Date(range.startOfWeek);
      date.setDate(date.getDate() + i);
      let dateString = date.toISOString().split('T')[0];
      return {date: dateString, label: getWeekday(dateString), value: null};
    });

    setFilteredData(
      weekDays.map(day => ({
        ...day,
        value: dataRecords.find(d => d.date === day.date)?.value ?? null,
      })),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.hi1}>
        <WeekSelector onSelectWeek={handleSelectDate} />
        {weekRange ? (
          filteredData.every(d => d.value !== null) ? (
            <LineChartComponent data={filteredData} />
          ) : (
            <Text style={styles.noDataText}>
              ⚠️ Dữ liệu tuần này chưa được tổng hợp
            </Text>
          )
        ) : (
          <Text style={styles.noDataText}>
            ⏳ Vui lòng chọn một tuần để xem dữ liệu
          </Text>
        )}
      </View>
    </View>
  );
};

export default ReportDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hi1:{
    width:'95%',
    height:'auto',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white',
    padding:30,
    borderRadius:20,
    borderColor:'#D1D1D1',
    borderWidth:2
  },
  weekSelectorContainer:{
    width:'100%',
    height:'auto',
    backgroundColor:'green'
  },
  button: {
    backgroundColor: '#1B3278',
    width:'auto',
    height:'auto'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginTop: 20,
  },
});
