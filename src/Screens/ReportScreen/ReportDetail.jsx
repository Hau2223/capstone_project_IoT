import { StyleSheet, TouchableOpacity, Text, View, ScrollView } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { LineChart } from 'react-native-gifted-charts';
import DateTimePicker from '@react-native-community/datetimepicker';
import { reportbyIdDevices, reportByDate, reportByWeek, reportByMonth } from '../../../services/reportServices'; // Giả sử bạn đã định nghĩa hàm này trong api/DeviceAPI.js


const getWeekday = dateString => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const jsDay = new Date(dateString).getDay();
  const idx = jsDay === 0 ? 6 : jsDay - 1;
  return days[idx];
};

const getWeekRange = selectedDate => {
  let startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));
  let endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return { startOfWeek, endOfWeek };
};



const DateSelector = ({ mode, onSelect }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const handleChange = (_, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
      if (mode === 'week') {
        onSelect(getWeekRange(selectedDate));
      } else if (mode === 'day') {
        onSelect(selectedDate);
      } else if (mode === 'month') {
        onSelect(selectedDate);
      }
    }
  };

  let label = '';
  if (mode === 'week') {
    const range = getWeekRange(date);
    label = `Tuần: ${range.startOfWeek.toLocaleDateString()} - ${range.endOfWeek.toLocaleDateString()}`;
  } else if (mode === 'day') {
    label = `Ngày: ${date.toLocaleDateString()}`;
  } else if (mode === 'month') {
    label = `Tháng: ${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  return (
    <View style={styles.containerData}>
      <View style={styles.weekSelectorContainer}>
        <Text style={styles.chartTitle}>📊 Thống kê số lần tưới</Text>
        {show && (
          <DateTimePicker
            value={date}
            mode={'date'}
            display="default"
            onChange={handleChange}
          />
        )}
      </View>
      <TouchableOpacity
        style={{
          alignSelf: 'center',
          backgroundColor: '#fff',
          borderRadius: 8,
          paddingVertical: 8,
          paddingHorizontal: 18,
          marginTop: 8,
          marginBottom: 8,
          minWidth: 140,
          borderWidth: 1,
          borderColor: '#e0e0e0',
          shadowColor: '#000',
          shadowOpacity: 0.02,
          shadowRadius: 1,
          elevation: 0,
        }}
        onPress={() => setShow(true)}
      >
        <Text style={{
          textAlign: 'center',
          color: '#206477',
          fontSize: 15,
          fontWeight: '500',
          letterSpacing: 0.2,
        }}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const metrics = [
  { key: 'humidity', label: 'Độ ẩm không khí (%)', color: '#4EA5FF' },
  { key: 'temp', label: 'Nhiệt độ (°C)', color: '#FF7B7B' },
  { key: 'lux', label: 'Ánh sáng (lux)', color: '#FFD966' },
  { key: 'moisture', label: 'Độ ẩm đất (%)', color: '#4ED6CB' },
  { key: 'stream', label: 'Lưu lượng (L/min)', color: '#A084E8' },
  { key: 'water_usage', label: 'Nước (L)', color: '#25A4FF' },
];

const LineChartComponent = ({ data1, mode, color }) => {
  let spacing = 48;
  let chartWidth = 330;
  if (mode === 'day') {
    spacing = 60;
    chartWidth = data1.length * spacing;
  } else if (mode === 'month') {
    spacing = 56;
    chartWidth = Math.max(330, (data1.length - 1) * spacing + 60);
  } else {
    spacing = data1.length > 14 ? 32 : data1.length > 7 ? 40 : 48;
    chartWidth = Math.max(330, (data1.length - 1) * spacing + 60);
  }

  const values = data1.map(d => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const yAxisMin = min > 0 ? Math.floor(min - 1) : 0;
  const yAxisMax = Math.ceil(max + 1);

  return (
    <View style={styles.chartContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={data1}
          color={color}
          dataPointsColor={color}
          thickness={3}
          showDataPoints
          dataPointsRadius={5}
          yAxisColor="#333"
          xAxisColor="#333"
          adjustToWidth={false}
          width={chartWidth}
          spacing={spacing}
          areaChart
          scrollEnabled={mode === 'day' ? data1.length > 6 : data1.length > 7}
          startFillColor="#25A4FF"
          endFillColor="#25A4FF"
          startOpacity={0.4}
          endOpacity={0}
          animateOnDataChange={true}
          animationDuration={500}
          yAxisMinValue={yAxisMin}
          yAxisMaxValue={yAxisMax}
          pointerConfig={{
            pointerStripHeight: 160,
            pointerStripWidth: 2,
            pointerStripColor: '#888',
            pointerColor: '#000',
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 60,
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: true,
            pointer1: { color: color },
            pointerLabelComponent: items => {
              const selectedDate = items[0]?.date;
              const index = data1.findIndex(item => item.date === selectedDate);
              const finalIndex = index !== -1 ? index : 0;
              const value1 = data1[finalIndex]?.value || 0;
              return (
                <View style={styles.pointerLabel}>
                  <Text style={styles.pointerText}>Tưới: {Number(value1).toFixed(2)}</Text>
                </View>
              );
            },
          }}
        />
      </ScrollView>
    </View>
  );
};

function average(arr) {
  if (!arr || arr.length === 0) return 0;
  const valid = arr.filter(v => v !== null && v !== undefined);
  if (valid.length === 0) return 0;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

const Card = ({ title, value }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const ModeSelector = ({ mode, setMode }) => (
  <View style={styles.modeSelector}>
    {['day', 'week', 'month'].map(m => (
      <TouchableOpacity
        key={m}
        style={[
          styles.modeButton,
          mode === m && styles.modeButtonActive
        ]}
        onPress={() => setMode(m)}
      >
        <Text style={[
          styles.modeButtonText,
          mode === m && styles.modeButtonTextActive
        ]}>
          {m === 'day' ? 'Ngày' : m === 'week' ? 'Tuần' : 'Tháng'}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const ReportDetail = ({ route }) => {
  const { deviceId } = route.params;
  const [weekRange, setWeekRange] = useState(null);
  const [filteredData1, setFilteredData1] = useState([]);
  const [filteredData2, setFilteredData2] = useState([]);
  const [summary, setSummary] = useState({
    avgHumidity: 0,
    avgMoisture: 0,
    avgLuminosity: 0,
    avgTemp: 0,
    avgStream: 0,
    totalWaterUsage: 0,
  });
  const [mode, setMode] = useState('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMetric, setSelectedMetric] = useState('water_usage');
  const [chartData, setChartData] = useState([]);

  const formatDate = (date) => date.toISOString().split('T')[0];
  const formatWeek = (date) => {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    const yearStart = new Date(d.getFullYear(),0,1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
    return `${d.getFullYear()}-W${weekNo.toString().padStart(2,'0')}`;
  };
  const formatMonth = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}`;
  };

  const handleSelectDate = (rangeOrDate) => {
    if (mode === 'week') {
      setWeekRange(rangeOrDate);
      setSelectedDate(rangeOrDate.startOfWeek);
    } else {
      setSelectedDate(rangeOrDate);
    }
  };

  useEffect(() => {
    const currentDate = selectedDate || new Date();
    if (mode === 'week') {
      const currentWeek = getWeekRange(currentDate);
      handleSelectDate(currentWeek);
    } else {
      handleSelectDate(currentDate);
    }
    // eslint-disable-next-line
  }, [mode]);

  useEffect(() => {
    const fetchAndLog = async () => {
      try {
        let reports = [];
        if (mode === 'week') {
          const week = formatWeek(selectedDate);
          const res = await reportByWeek({ id_esp: deviceId, week });
          reports = Array.isArray(res) ? res : [res];
        } else if (mode === 'day') {
          const date = formatDate(selectedDate);
          const res = await reportByDate({ id_esp: deviceId, date });
          reports = Array.isArray(res) ? res : [res];
        } else if (mode === 'month') {
          const month = formatMonth(selectedDate);
          const res = await reportByMonth({ id_esp: deviceId, month });
          reports = Array.isArray(res) ? res : [res];
        }

        const allHumidity = reports.flatMap(r => r.humidity_avg || []);
        const allMoisture = reports.flatMap(r => r.moisture_avg || []);
        const allLuminosity = reports.flatMap(r => r.luminosity_avg || []);
        const allTemp = reports.flatMap(r => r.tempurature_avg || []);
        const allStream = reports.flatMap(r => r.stream_avg || []);
        const allWaterUsage = reports.map(r => r.water_usage || 0);
        setSummary({
          avgHumidity: average(allHumidity),
          avgMoisture: average(allMoisture),
          avgLuminosity: average(allLuminosity),
          avgTemp: average(allTemp),
          avgStream: average(allStream),
          totalWaterUsage: allWaterUsage.reduce((a, b) => a + b, 0),
        });
        // Đổ dữ liệu cho biểu đồ
        if (mode === 'week') {
          // 7 ngày trong tuần
          let weekDays = Array.from({ length: 7 }, (_, i) => {
            let date = new Date(weekRange?.startOfWeek || selectedDate);
            date.setDate(date.getDate() + i);
            let dateString = formatDate(date);
            return { date: dateString, label: getWeekday(dateString) };
          });
          setFilteredData1(
            weekDays.map(day => ({
              ...day,
              value: reports.find(r => formatDate(new Date(r.time_created)) === day.date)?.water_usage ?? 0,
            }))
          );
          setFilteredData2(
            weekDays.map(day => ({
              ...day,
              value: reports.find(r => formatDate(new Date(r.time_created)) === day.date)?.humidity_avg?.[0] ?? 0,
            }))
          );
        } else if (mode === 'day') {

          const timeSlots = Array.from({ length: 12 }, (_, i) => {
            const hour = i * 2;
            return `${hour.toString().padStart(2, '0')}:00`;
          });

          const reportsSorted = [...reports].sort((a, b) => new Date(a.time_created) - new Date(b.time_created));
          const chartData = timeSlots.map((slot, idx) => {
            const slotHour = idx * 2;
            const slotStart = new Date(selectedDate);
            slotStart.setHours(slotHour, 0, 0, 0);
            const slotEnd = new Date(selectedDate);
            slotEnd.setHours(slotHour + 2, 0, 0, 0);

            const report = reportsSorted.find(r => {
              const t = new Date(r.time_created);
              return t >= slotStart && t < slotEnd;
            });
            return {
              date: slot,
              label: slot,
              value: report ? report.water_usage : 0,
            };
          });
          setFilteredData1(chartData);
        } else if (mode === 'month') {
          const year = selectedDate.getFullYear();
          const month = selectedDate.getMonth();
          const daysInMonth = new Date(year, month + 1, 0).getDate();


          const groups = [
            { start: 1, end: 5 },
            { start: 6, end: 10 },
            { start: 11, end: 15 },
            { start: 16, end: 20 },
            { start: 21, end: 25 },
            { start: 26, end: daysInMonth }
          ];

          const chartData = groups.map(group => {
            const reportsOfGroup = reports.filter(r => {
              const t = new Date(r.time_created);
              return (
                t.getFullYear() === year &&
                t.getMonth() === month &&
                t.getDate() >= group.start &&
                t.getDate() <= group.end
              );
            });
            const avg = reportsOfGroup.length
              ? reportsOfGroup.reduce((sum, r) => sum + (r.water_usage || 0), 0) / reportsOfGroup.length
              : 0;
            return {
              date: `${group.start}-${group.end}`,
              label: `${group.start}-${group.end}`,
              value: avg
            };
          });

          setFilteredData1(chartData);
        }
      } catch (e) {
        console.log('Lỗi khi gọi API report:', e);
      }
    };
    fetchAndLog();
  }, [deviceId, mode, selectedDate, weekRange]);

  useEffect(() => {

    if (!filteredData1 || filteredData1.length === 0) {
      setChartData([]);
      return;
    }
    if (selectedMetric === 'water_usage') {
      setChartData(filteredData1);
    } else if (selectedMetric === 'humidity') {
      setChartData(filteredData1.map((d, i) => ({ ...d, value: d.humidity ?? 0 })));
    } else if (selectedMetric === 'temp') {
      setChartData(filteredData1.map((d, i) => ({ ...d, value: d.temp ?? 0 })));
    } else if (selectedMetric === 'lux') {
      setChartData(filteredData1.map((d, i) => ({ ...d, value: d.lux ?? 0 })));
    } else if (selectedMetric === 'moisture') {
      setChartData(filteredData1.map((d, i) => ({ ...d, value: d.moisture ?? 0 })));
    } else if (selectedMetric === 'stream') {
      setChartData(filteredData1.map((d, i) => ({ ...d, value: d.stream ?? 0 })));
    }
  }, [filteredData1, selectedMetric]);

  return (
    <View style={styles.frame}>
      <View style={styles.header}>
        <View style={styles.header1}>
          <Text style={styles.textHeader}>Phân tích dữ liệu</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{paddingBottom: 30}}>
        <ModeSelector mode={mode} setMode={setMode} />
        <View style={{marginTop: 10}}>
          <View style={styles.row2col}>
            <Card title="Lượng nước đã dùng (L)" value={`${summary.totalWaterUsage.toFixed(2)} L`} />
            <Card title="Nhiệt độ (°C) Trung bình" value={`${summary.avgTemp.toFixed(2)} °C`} />
          </View>
          <View style={styles.row2col}>
            <Card title="Độ ẩm không khí (%) Trung bình" value={`${summary.avgHumidity.toFixed(2)} %`} />
            <Card title="Độ ẩm đất (%) Trung bình" value={`${summary.avgMoisture.toFixed(2)} %`} />
          </View>
          <View style={styles.row2col}>
            <Card title="Ánh sáng (lux) Trung bình" value={`${summary.avgLuminosity.toFixed(2)} lux`} />
            <Card title="Lưu lượng (L/min) Trung bình" value={`${summary.avgStream.toFixed(2)} L/min`} />
          </View>
        </View>
       
        <View style={styles.container}>
          <View style={styles.frameTable}>
            <DateSelector mode={mode} onSelect={handleSelectDate} />
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10,
            marginBottom: 20,
            alignSelf: 'center',
            maxWidth: '100%',
            rowGap: 6,
          }}
        >
          {metrics.map(m => (
            <TouchableOpacity
              key={m.key}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 4,
                marginVertical: 2,
                opacity: selectedMetric === m.key ? 1 : 0.5,
              }}
              onPress={() => setSelectedMetric(m.key)}
            >
              <View style={{
                width: 14, height: 14, borderRadius: 7,
                borderWidth: 2, borderColor: m.color, marginRight: 3,
                backgroundColor: selectedMetric === m.key ? m.color : 'transparent'
              }} />
              <Text style={{ color: '#333', fontSize: 13 }}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
            {weekRange ? (
              <LineChartComponent data1={chartData} mode={mode} color={metrics.find(m => m.key === selectedMetric)?.color || '#25A4FF'} />
            ) : (
              <Text style={styles.noDataText}>⏳ Vui lòng chọn một tuần để xem dữ liệu</Text>
            )}
          </View>
        </View>
      </ScrollView>
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
  card: {
    flex: 1,
    margin: 10,
    paddingVertical: 28,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: '#E2FFE6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    minWidth: 150,
    minHeight: 90,
  },
  cardTitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  row2col: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 8,
  },
  modeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: '#fff',
    marginHorizontal: 6,
  },
  modeButtonActive: {
    backgroundColor: '#4ECB71',
    borderColor: '#4ECB71',
  },
  modeButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 18,
  },
  modeButtonTextActive: {
    color: '#fff',
  },
});