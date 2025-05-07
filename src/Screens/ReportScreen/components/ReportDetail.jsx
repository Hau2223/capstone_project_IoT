import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  StatusBar
} from 'react-native';
import React, {useRef, useEffect, useState, memo, useContext} from 'react';
import { useIsFocused } from '@react-navigation/native';
import {LineChart} from 'react-native-gifted-charts';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  reportbyIdDevices,
  reportByDate,
  reportByWeek,
  reportByMonth,
} from '../../../../services/reportServices'; // Giả sử bạn đã định nghĩa hàm này trong api/DeviceAPI.js
import HeaderCompo from '../../../components/HeaderCompo';
import { useTranslation } from 'react-i18next';
import colors from '../../../../assets/common/colorCss';
import { ThemeContext } from '../../../../assets/common/themeProvider';
import { createStyle } from './style';
import {GenerateCSVFromJSON} from "./Csv";
import { Button } from 'react-native-paper';
const getWeekday = (dateString, t) => {
  const days = [
    t('mon'), // Translated "Monday"
    t('tue'), // Translated "Tuesday"
    t('wed'), // Translated "Wednesday"
    t('thu'), // Translated "Thursday"
    t('fri'), // Translated "Friday"
    t('sat'), // Translated "Saturday"
    t('sun'), // Translated "Sunday"
  ];
  const jsDay = new Date(dateString).getDay();
  const idx = jsDay === 0 ? 6 : jsDay - 1; // Adjust index (Sunday = 0 in JS)
  return days[idx];
};

const getWeekRange = selectedDate => {
  let date = new Date(selectedDate);
  const day = date.getDay(); // 0: Chủ nhật, 1: Thứ hai, ...
  // Nếu là Chủ nhật thì lùi về thứ Hai tuần trước, còn lại lùi về thứ Hai tuần này
  const diff = day === 0 ? -6 : 1 - day;
  let startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() + diff);
  let endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return {startOfWeek, endOfWeek};
};

const DateSelector = ({mode, onSelect}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
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
    label = `${t('week')}: ${range.startOfWeek.toLocaleDateString()} - ${range.endOfWeek.toLocaleDateString()}`;
  } else if (mode === 'day') {
    label = `${t('day')}: ${date.toLocaleDateString()}`;
  } else if (mode === 'month') {
    label = `${t('month')}: ${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  return (
    <View style={styles.containerData}>
      <View style={styles.weekSelectorContainer}>
        <Text style={styles.chartTitle}>{t('data_analysis')}</Text>
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
          backgroundColor: theme === 'light' ? colors.white : colors.bg_dark,
          borderRadius: 8,
          paddingVertical: 8,
          paddingHorizontal: 18,
          marginTop: 8,
          marginBottom: 8,
          minWidth: 140,
          borderWidth: 1,
          borderColor: theme === 'light' ? '#e0e0e0' : colors.white,
          shadowColor: theme === 'light' ? colors.black : colors.white,
          shadowOpacity: 0.02,
          shadowRadius: 1,
          elevation: 0,
        }}
        onPress={() => setShow(true)}>
        <Text
          style={{
            textAlign: 'center',
            color: theme === 'light' ? colors.primary : colors.white,
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

const LineChartComponent = ({data1, mode, color}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
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
          xAxisLabelTextStyle={{color:theme === 'light'? colors.black : colors.white}}
          yAxisTextStyle={{color:theme === 'light'? colors.black : colors.white}}
          yAxisColor= {theme === 'light'? colors.borderColor : colors.white}
          xAxisColor={theme === 'light'? colors.borderColor : colors.white}
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
            pointer1: {color: color},
            pointerLabelComponent: items => {
              const selectedDate = items[0]?.date;
              const index = data1.findIndex(item => item.date === selectedDate);
              const finalIndex = index !== -1 ? index : 0;
              const value1 = data1[finalIndex]?.value || 0;
              return (
                <View style={styles.pointerLabel}>
                  <Text style={styles.pointerText}>
                    {t('pointerLabel')} {Number(value1).toFixed(2)}
                  </Text>
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

const Card = ({title, value}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  return(
    <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
  )
};

const ModeSelector = ({mode, setMode}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  return (
    <View style={styles.modeSelector}>
    {['day', 'week', 'month'].map(m => (
      <TouchableOpacity
        key={m}
        style={[styles.modeButton, mode === m && styles.modeButtonActive]}
        onPress={() => setMode(m)}>
        <Text
          style={[
            styles.modeButtonText,
            mode === m && styles.modeButtonTextActive,
          ]}>
          {m === 'day' ? t('day') : m === 'week' ? t('week') : t('month')}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
  )
};

const ReportDetail = ({navigation, route}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const isFocused = useIsFocused();
  const {deviceId} = route.params;
  const initialWeek = getWeekRange(new Date());
  const [weekRange, setWeekRange] = useState(initialWeek);
  const [filteredData1, setFilteredData1] = useState([]);
  // console.log(filteredData1);
  
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
  const [selectedDate, setSelectedDate] = useState(initialWeek.startOfWeek);
  const [selectedMetric, setSelectedMetric] = useState('water_usage');
  const [chartData, setChartData] = useState([]);

  const formatDate = date => date.toISOString().split('T')[0];
  const formatWeek = date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
  };
  const formatMonth = date => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
  };

  const handleSelectDate = rangeOrDate => {
    if (mode === 'week') {
      const week = getWeekRange(rangeOrDate);
      setWeekRange(week);
      setSelectedDate(week.startOfWeek);
    } else {
      setSelectedDate(rangeOrDate);
    }
  };
  async function fetchData() {
    // You can await here
    const response = await reportbyIdDevices({id_esp: deviceId})
    ExportCSV(response);
  }
  useEffect(() => {
    if (mode === 'week') {
      const week = getWeekRange(selectedDate);
      setWeekRange(week);
      setSelectedDate(week.startOfWeek);
    }
  }, [mode]);

  useEffect(() => {
    const fetchAndLog = async () => {
      try {
        let reports = [];
        if (mode === 'week') {
          const week = formatWeek(selectedDate);
          const res = await reportByWeek({id_esp: deviceId, week});
          reports = Array.isArray(res) ? res : [res];
        } else if (mode === 'day') {
          const date = formatDate(selectedDate);
          const res = await reportByDate({id_esp: deviceId, date});
          reports = Array.isArray(res) ? res : [res];
        } else if (mode === 'month') {
          const month = formatMonth(selectedDate);
          const res = await reportByMonth({id_esp: deviceId, month});
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
          let weekDays = Array.from({length: 7}, (_, i) => {
            let date = new Date(weekRange?.startOfWeek || selectedDate);
            date.setDate(date.getDate() + i);
            let dateString = formatDate(date);       
            return {
              date: dateString,
              label: getWeekday(dateString, t), // Pass t to getWeekday
            };
          });
          setFilteredData1(
            weekDays.map(day => ({
              ...day,
              value:
                reports.find(
                  r => formatDate(new Date(r.time_created)) === day.date,
                )?.water_usage ?? 0,
            })),
          );
          setFilteredData2(
            weekDays.map(day => ({
              ...day,
              value:
                reports.find(
                  r => formatDate(new Date(r.time_created)) === day.date,
                )?.humidity_avg?.[0] ?? 0,
            })),
          );
        } else if (mode === 'day') {
          const timeSlots = Array.from({length: 12}, (_, i) => {
            const hour = i * 2;
            return `${hour.toString().padStart(2, '0')}:00`;
          });

          const reportsSorted = [...reports].sort(
            (a, b) => new Date(a.time_created) - new Date(b.time_created),
          );
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
            {start: 1, end: 5},
            {start: 6, end: 10},
            {start: 11, end: 15},
            {start: 16, end: 20},
            {start: 21, end: 25},
            {start: 26, end: daysInMonth},
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
              ? reportsOfGroup.reduce(
                  (sum, r) => sum + (r.water_usage || 0),
                  0,
                ) / reportsOfGroup.length
              : 0;
            return {
              date: `${group.start}-${group.end}`,
              label: `${group.start}-${group.end}`,
              value: avg,
            };
          });

          setFilteredData1(chartData);
        }
      } catch (er) {
        console.log('Lỗi khi gọi API report:', err.data);
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
      setChartData(
        filteredData1.map((d, i) => ({...d, value: d.humidity ?? 0})),
      );
    } else if (selectedMetric === 'temp') {
      setChartData(filteredData1.map((d, i) => ({...d, value: d.temp ?? 0})));
    } else if (selectedMetric === 'lux') {
      setChartData(filteredData1.map((d, i) => ({...d, value: d.lux ?? 0})));
    } else if (selectedMetric === 'moisture') {
      setChartData(
        filteredData1.map((d, i) => ({...d, value: d.moisture ?? 0})),
      );
    } else if (selectedMetric === 'stream') {
      setChartData(filteredData1.map((d, i) => ({...d, value: d.stream ?? 0})));
    }
  }, [filteredData1, selectedMetric]);

  const metrics = [
    {key: 'humidity', label: t('metricHumidity'), color: '#4EA5FF'},
    {key: 'temp', label: t('metricTemp'), color: '#FF7B7B'},
    {key: 'lux', label:t('metricLux'), color: '#FFD966'},
    {key: 'moisture', label:t('metricMoisture'), color: '#4ED6CB'},
    {key: 'stream', label:t('metricStream'), color: '#A084E8'},
    {key: 'water_usage', label: t('metricWaterUsage'), color: '#25A4FF'},
  ];
  return (
    <View style={styles.frame}>
            {isFocused && (
              <StatusBar
                backgroundColor={theme === 'light' ? colors.white : colors.bg_dark}
                barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
              />
            )}
      <HeaderCompo
        bgcolor={colors.bg_NaN}
        isPress={() => navigation.goBack()}
        name={t('data_analysis')}
        color={colors.primary}
      />
      {/* <View style={styles.header} >
        <View style={styles.header1}>
          <Text style={styles.textHeader}>Phân tích dữ liệu</Text>
        </View>
      </View> */}
      <ScrollView contentContainerStyle={{paddingBottom: 30}}>
        <ModeSelector mode={mode} setMode={setMode} />

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
              }}>
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
                  onPress={() => setSelectedMetric(m.key)}>
                  <View
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      borderWidth: 2,
                      borderColor: m.color,
                      marginRight: 3,
                      backgroundColor:
                        selectedMetric === m.key ? m.color : 'transparent',
                    }}
                  />
                  <Text style={{color: theme === 'light' ? colors.txtHide : colors.white , fontSize: 13}}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {weekRange ? (
              <LineChartComponent
                data1={chartData}
                mode={mode}
                color={
                  metrics.find(m => m.key === selectedMetric)?.color ||
                  '#25A4FF'
                }
              />
            ) : (
              <Text style={styles.noDataText}>
                {t('noDataText')}
              </Text>
            )}
          </View>
        </View>
        {/* <GenerateCSVFromJSON></GenerateCSVFromJSON> */}
        <View style={{marginTop: 10}}>
          <View style={styles.row2col}>
            <Card
              title={`${t('water_used_L')}`}
              value={`${summary.totalWaterUsage.toFixed(2)} L`}
            />
            <Card
              title={`${t('average_temperature_C')}`}
              value={`${summary.avgTemp.toFixed(2)} °C`}
            />
          </View>
          <View style={styles.row2col}>
            <Card
              title={`${t('average_air_humidity_percent')}`}
              value={`${summary.avgHumidity.toFixed(2)} %`}
            />
            <Card
              title={`${t('average_soil_moisture_percent')}`}
              value={`${summary.avgMoisture.toFixed(2)} %`}
            />
          </View>
          <View style={styles.row2col}>
            <Card
              title={`${t('average_light_lux')}`}
              value={`${summary.avgLuminosity.toFixed(2)} lux`}
            />
            <Card
              title={`${t('average_flow_rate_L_min')}`}
              value={`${summary.avgStream.toFixed(2)} L/min`}
            />
          </View>
        </View>
        <Button onPress={fetchData} title="Export Report" />

      </ScrollView>

      
    </View>
  );
};

export default memo(ReportDetail);
