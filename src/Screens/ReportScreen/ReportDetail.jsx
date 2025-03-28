import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {LineChart} from 'react-native-gifted-charts';

// Dữ liệu gồm 2 đường biểu đồ
const monthlyData = [
  {
    month: 1, // Tháng 1
    weeks: [
      {
        week: 1,
        data1: [
          {value: 120, label: 'Mon'},
          {value: 80, label: 'Tue'},
          {value: 90, label: 'Wed'},
          {value: 70, label: 'Thu'},
          {value: 35, label: 'Fri'},
          {value: 20, label: 'Sat'},
          {value: 70, label: 'Sun'},
        ],
        data2: [
          {value: 100, label: 'Mon'},
          {value: 60, label: 'Tue'},
          {value: 80, label: 'Wed'},
          {value: 50, label: 'Thu'},
          {value: 25, label: 'Fri'},
          {value: 10, label: 'Sat'},
          {value: 50, label: 'Sun'},
        ],
      },
      {
        week: 2,
        data1: [
          {value: 40, label: 'Mon'},
          {value: 60, label: 'Tue'},
          {value: 100, label: 'Wed'},
          {value: 80, label: 'Thu'},
          {value: 10, label: 'Fri'},
          {value: 30, label: 'Sat'},
          {value: 40, label: 'Sun'},
        ],
        data2: [
          {value: 30, label: 'Mon'},
          {value: 50, label: 'Tue'},
          {value: 90, label: 'Wed'},
          {value: 70, label: 'Thu'},
          {value: 15, label: 'Fri'},
          {value: 20, label: 'Sat'},
          {value: 30, label: 'Sun'},
        ],
      },
    ],
  },
  {
    month: 2, // Tháng 2
    weeks: [
      {
        week: 1,
        data1: [
          {value: 60, label: 'Mon'},
          {value: 50, label: 'Tue'},
          {value: 80, label: 'Wed'},
          {value: 70, label: 'Thu'},
          {value: 10, label: 'Fri'},
          {value: 30, label: 'Sat'},
          {value: 20, label: 'Sun'},
        ],
        data2: [
          {value: 80, label: 'Mon'},
          {value: 45, label: 'Tue'},
          {value: 20, label: 'Wed'},
          {value: 65, label: 'Thu'},
          {value: 35, label: 'Fri'},
          {value: 25, label: 'Sat'},
          {value: 15, label: 'Sun'},
        ],
      },
      {
        week: 2,
        data1: [
          {value: 70, label: 'Mon'},
          {value: 90, label: 'Tue'},
          {value: 60, label: 'Wed'},
          {value: 50, label: 'Thu'},
          {value: 30, label: 'Fri'},
          {value: 20, label: 'Sat'},
          {value: 10, label: 'Sun'},
        ],
        data2: [
          {value: 65, label: 'Mon'},
          {value: 85, label: 'Tue'},
          {value: 55, label: 'Wed'},
          {value: 45, label: 'Thu'},
          {value: 25, label: 'Fri'},
          {value: 15, label: 'Sat'},
          {value: 5, label: 'Sun'},
        ],
      },
    ],
  },
];

const ReportDetail = () => {
  const [monthIndex, setMonthIndex] = useState(0);
  const [weekIndex, setWeekIndex] = useState(0);

  const currentMonth = monthlyData[monthIndex];
  const currentWeek = currentMonth.weeks[weekIndex];

  const handlePrevMonth = () => {
    if (monthIndex > 0) {
      setMonthIndex(monthIndex - 1);
      setWeekIndex(0); // Reset tuần khi đổi tháng
    }
  };

  const handleNextMonth = () => {
    if (monthIndex < monthlyData.length - 1) {
      setMonthIndex(monthIndex + 1);
      setWeekIndex(0);
    }
  };

  const handlePrevWeek = () => {
    if (weekIndex > 0) setWeekIndex(weekIndex - 1);
  };

  const handleNextWeek = () => {
    if (weekIndex < currentMonth.weeks.length - 1) setWeekIndex(weekIndex + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Báo cáo & Thống kê</Text>
      </View>

      <View style={styles.frameReport}>
        {/* Chọn Tháng */}
        <View style={styles.selectionRow}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.button}>
            <Text style={styles.buttonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text
            style={styles.selectionText}>{`Tháng ${currentMonth.month}`}</Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.button}>
            <Text style={styles.buttonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Chọn Tuần */}
        <View style={styles.selectionRow}>
          <TouchableOpacity onPress={handlePrevWeek} style={styles.button}>
            <Text style={styles.buttonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.selectionText}>{`Tuần ${currentWeek.week}`}</Text>
          <TouchableOpacity onPress={handleNextWeek} style={styles.button}>
            <Text style={styles.buttonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <LineChart
          data={currentWeek.data1}
          data2={currentWeek.data2}
          color="#1B3278"
          color2="#FF5733"
          thickness={3}
          thickness2={3}
          areaChart={false}
          showDataPoints
          dataPointsColor="#1B3278"
          dataPointsColor2="#FF5733"
          dataPointsRadius={5}
          adjustToWidth
          width={300}
          animationDuration={1000}
          isAnimated
          showTextOnPress={false}
        />

        <View style={styles.detailLine}>
          <View style={styles.detail}>
            <View style={styles.detailColor1}></View>
            <Text style={styles.txtDetail}>Số lần tưới</Text>
          </View>
          <View style={styles.detail}>
            <View style={styles.detailColor2}></View>
            <Text style={styles.txtDetail}>Số lần bật đèn</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReportDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5FA',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  textHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1A5276',
  },
  frameReport: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
    alignItems:'center'
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  selectionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 15,
  },

  detailLine: {
    height: 50,
    width: '100%',
    marginTop:30,
    flexDirection:'row',
  },
  detail: {
    height: 50,
    width: "50%",
    flexDirection:'row',
    alignItems:'center'
  },
  detailColor1:{
    width:40,
    height:3,
    backgroundColor:"#1B3278",
    transform: [{ rotate: "-30deg" }]
  },
  txtDetail:{
    fontSize:17,
    marginLeft:10,
    fontWeight:'bold'
  },
  detailColor2:{
    width:40,
    height:3,
    backgroundColor:"#FF5733",
    transform: [{ rotate: "-30deg" }]
  },
  detail: {
    height: 50,
    width: "50%",
    flexDirection:'row',
    alignItems:'center'
  },

});
