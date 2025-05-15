import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState, memo, useContext} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {LineChart} from 'react-native-gifted-charts';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  reportbyIdDevices,
  reportByDate,
  reportByWeek,
  reportByMonth,
} from '../../../../services/reportServices';
import HeaderCompo from '../../../components/HeaderCompo';
import {useTranslation} from 'react-i18next';
import colors from '../../../../assets/common/colorCss';
import {ThemeContext} from '../../../../assets/common/themeProvider';
import {createStyle} from './style';
import {Button} from 'react-native-paper';

const ensureDate = d => {
  const converted = new Date(d);
  return isNaN(converted.getTime()) ? new Date() : converted;
};

const isSameDay = (a, b) => {
  const da = ensureDate(a);
  const db = ensureDate(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
};

const getWeekday = (dateInput, t) => {
  const days = [
    t('mon'),
    t('tue'),
    t('wed'),
    t('thu'),
    t('fri'),
    t('sat'),
    t('sun'),
  ];
  const jsDay = ensureDate(dateInput).getDay();
  const idx = jsDay === 0 ? 6 : jsDay - 1;
  return days[idx];
};

const getWeekRange = selectedDate => {
  const date = ensureDate(selectedDate);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const startOfWeek = new Date(date);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(date.getDate() + diffToMonday);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return {startOfWeek, endOfWeek};
};

const formatDate = date => {
  return ensureDate(date).toISOString().split('T')[0];
};

const formatWeek = dateInput => {
  try {
    const d = ensureDate(dateInput);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
  } catch (err) {
    console.error('formatWeek error:', err);
    return 'Invalid-Date';
  }
};

const formatMonth = date => {
  const d = ensureDate(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
};

const DateSelector = ({mode, onSelect, value}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const [show, setShow] = useState(false);

  const handleChange = (_, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      onSelect(selectedDate);
    }
  };

  let label = '';
  if (mode === 'week') {
    const range = getWeekRange(value);
    label = `${t(
      'week',
    )}: ${range.startOfWeek.toLocaleDateString()} - ${range.endOfWeek.toLocaleDateString()}`;
  } else if (mode === 'day') {
    label = `${t('day')}: ${value.toLocaleDateString()}`;
  } else if (mode === 'month') {
    label = `${t('month')}: ${value.getMonth() + 1}/${value.getFullYear()}`;
  }

  return (
    <View style={styles.containerData}>
      <View style={styles.weekSelectorContainer}>
        <Text style={styles.chartTitle}>{t('data_analysis')}</Text>
        {show && (
          <DateTimePicker
            value={value}
            mode="date"
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
        }}
        onPress={() => setShow(true)}>
        <Text
          style={{
            textAlign: 'center',
            color: theme === 'light' ? colors.primary : colors.white,
            fontSize: 15,
            fontWeight: '500',
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
          xAxisLabelTextStyle={{
            color: theme === 'light' ? colors.black : colors.white,
            fontSize: 12,
          }}
          yAxisTextStyle={{
            color: theme === 'light' ? colors.black : colors.white,
            fontSize: 12,
          }}
          yAxisColor={theme === 'light' ? colors.borderColor : colors.white}
          xAxisColor={theme === 'light' ? colors.borderColor : colors.white}
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
                    {Number(value1).toFixed(2)}
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
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
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
  );
};

const ReportDetail = ({navigation, route}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const isFocused = useIsFocused();
  const {deviceId} = route.params;
  const [weekRange, setWeekRange] = useState(getWeekRange(new Date()));

  const [filteredData1, setFilteredData1] = useState([]);
  const [summary, setSummary] = useState({
    avgHumidity: 0,
    avgMoisture: 0,
    avgLuminosity: 0,
    avgTemp: 0,
    avgStream: 0,
    totalWaterUsage: 0,
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mode, setMode] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('humidity');
  const [chartData, setChartData] = useState([]);

  const handleSelectDate = date => {
    const safe = ensureDate(date);
    if (mode === 'week') {
      const week = getWeekRange(safe);
      setWeekRange(week);
      setSelectedDate(week.startOfWeek);
    } else {
      setSelectedDate(safe);
    }
  };

  async function fetchData() {
    const response = await reportbyIdDevices({id_esp: deviceId});
    setRes(response);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAndLog = async () => {
      try {
        let reports = [];
        if (mode === 'day') {
          const date = formatDate(selectedDate);
          reports = await reportByDate({id_esp: deviceId, date});
        } else if (mode === 'week') {
          const week = formatWeek(weekRange.startOfWeek);
          reports = await reportByWeek({id_esp: deviceId, week});
        } else if (mode === 'month') {
          const month = formatMonth(selectedDate);
          reports = await reportByMonth({id_esp: deviceId, month});
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

        if (mode === 'week') {
          const baseDate = weekRange?.startOfWeek || selectedDate;
          const weekDays = Array.from({length: 7}, (_, i) => {
            const date = new Date(baseDate);
            date.setDate(date.getDate() + i);
            return {
              date,
              label: getWeekday(date, t),
            };
          });

          setFilteredData1(
            weekDays.map(day => {
              const report = reports.find(r =>
                isSameDay(r.time_created, day.date),
              );
              return {
                ...day,
                water_usage: report?.water_usage ?? 0,
                humidity: report?.humidity_avg?.[0] ?? 0,
                temp: report?.tempurature_avg?.[0] ?? 0,
                moisture: report?.moisture_avg?.[0] ?? 0,
                lux: report?.luminosity_avg?.[0] ?? 0,
                stream: report?.stream_avg?.[0] ?? 0,
              };
            }),
          );
        } else if (mode === 'day') {
          const timeSlots = Array.from({length: 12}, (_, i) => {
            const hour = i * 2;
            return `${hour.toString().padStart(2, '0')}:00`;
          });

          const selectedDateStart = new Date(selectedDate);
          selectedDateStart.setUTCHours(0, 0, 0, 0);
          const selectedDateEnd = new Date(selectedDate);
          selectedDateEnd.setUTCHours(23, 59, 59, 999);

          const report = reports.find(r => {
            const t = new Date(r.time_created);
            return t >= selectedDateStart && t <= selectedDateEnd;
          });

          const chartData = timeSlots.map((slot, idx) => ({
            date: slot,
            label: slot,
            water_usage: report?.water_usage ? report.water_usage / 12 : 0,
            humidity: report?.humidity_avg?.[idx] || 0,
            temp: report?.tempurature_avg?.[idx] || 0,
            moisture: report?.moisture_avg?.[idx] || 0,
            lux: report?.luminosity_avg?.[idx] || 0,
            stream: report?.stream_avg?.[idx] || 0,
          }));

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

            return {
              date: `${group.start}-${group.end}`,
              label: `${group.start}-${group.end}`,
              water_usage: reportsOfGroup.length
                ? reportsOfGroup.reduce(
                    (sum, r) => sum + (r.water_usage || 0),
                    0,
                  ) / reportsOfGroup.length
                : 0,
              humidity: reportsOfGroup.length
                ? average(reportsOfGroup.map(r => r.humidity_avg?.[0] || 0))
                : 0,
              temp: reportsOfGroup.length
                ? average(reportsOfGroup.map(r => r.tempurature_avg?.[0] || 0))
                : 0,
              moisture: reportsOfGroup.length
                ? average(reportsOfGroup.map(r => r.moisture_avg?.[0] || 0))
                : 0,
              lux: reportsOfGroup.length
                ? average(reportsOfGroup.map(r => r.luminosity_avg?.[0] || 0))
                : 0,
              stream: reportsOfGroup.length
                ? average(reportsOfGroup.map(r => r.stream_avg?.[0] || 0))
                : 0,
            };
          });

          setFilteredData1(chartData);
        }
      } catch (err) {
        console.log('Lỗi khi gọi API report:', err);
      }
    };

    fetchAndLog();
  }, [deviceId, selectedDate, mode]);

  useEffect(() => {
    if (!filteredData1 || filteredData1.length === 0) {
      setChartData([]);
      return;
    }

    setChartData(
      filteredData1.map(d => ({
        ...d,
        date: typeof d.date === 'string' ? d.date : formatDate(d.date),
        value:
          selectedMetric === 'humidity'
            ? d.humidity
            : selectedMetric === 'temp'
            ? d.temp
            : selectedMetric === 'moisture'
            ? d.moisture
            : selectedMetric === 'lux'
            ? d.lux
            : selectedMetric === 'stream'
            ? d.stream
            : 0,
      })),
    );
  }, [filteredData1, selectedMetric]);

  const metrics = [
    {key: 'humidity', label: t('metricHumidity'), color: '#4EA5FF'},
    {key: 'temp', label: t('metricTemp'), color: '#FF7B7B'},
    {key: 'lux', label: t('metricLux'), color: '#FFD966'},
    {key: 'moisture', label: t('metricMoisture'), color: '#4ED6CB'},
    {key: 'stream', label: t('metricStream'), color: '#A084E8'},
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

      <ScrollView contentContainerStyle={{paddingBottom: 30}}>
        <ModeSelector mode={mode} setMode={setMode} />

        <View style={styles.container}>
          <View style={styles.frameTable}>
            <DateSelector
              mode={mode}
              value={selectedDate}
              onSelect={handleSelectDate}
            />

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 10,
                marginBottom: 20,
                alignSelf: 'center',
                width: '100%',
                maxWidth: '100%',
                rowGap: 6,
              }}>
              {metrics.map(m => (
                <TouchableOpacity
                  key={m.key}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '40%',
                    marginHorizontal: 4,
                    marginVertical: 2,
                    opacity: selectedMetric === m.key ? 1 : 0.5,
                  }}
                  onPress={() => setSelectedMetric(m.key)}>
                  <View
                    style={{
                      width: '100%',
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
                  <Text
                    style={{
                      color: theme === 'light' ? colors.txtHide : colors.white,
                      fontSize: 13,
                     width: '100%',
                    }}>
                    {m.label}
                  </Text>
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
              <Text style={styles.noDataText}>{t('noDataText')}</Text>
            )}
          </View>
        </View>

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
