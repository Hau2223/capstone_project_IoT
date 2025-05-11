import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect, useRef, useContext, memo} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Switch} from 'react-native-paper';
import {scheduleId} from '../../../services/scheduleServices';
import {delSchedule} from '../../../services/scheduleServices';
import {updateSchedule} from '../../../services/scheduleServices';
import Icon from 'react-native-vector-icons/Ionicons';
import {ThemeContext} from '../../../assets/common/themeProvider';
import {createStyle} from './style';
import {useTranslation} from 'react-i18next';
import colors from '../../../assets/common/colorCss';
import HeaderCompo from '../../components/HeaderCompo';
import Toast from 'react-native-toast-message';

const AlarmScreen = ({route, navigation}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const isFocused = useIsFocused();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const previousSchedulesRef = useRef([]);

  const {item} = route.params;
  // console.log('AlarmScreen item:', item); // Debug log

  useEffect(() => {
    if (item.id_esp) {
      fetchSchedules();
      const interval = setInterval(() => {
        fetchSchedules(true); // Pass true to indicate background refresh
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [item.id_esp]);

  const fetchSchedules = async (isBackgroundRefresh = false) => {
    try {
      // Only show loading indicator on initial load
      if (!isBackgroundRefresh) {
        setLoading(true);
      }

      setError(null);

      // Make sure we have the required parameters
      if (!item?.id_esp) {
        throw new Error('Missing device ID');
      }

      const controlName = item.controlName || 'water';
      // console.log('Fetching schedules for:', { id_esp: item.id_esp, controlName }); // Debug log

      const response = await scheduleId({
        id_esp: item.id_esp,
        name: controlName,
      });

      // console.log('Schedule API response:', response); // Debug log

      if (response?.data) {
        const formattedSchedules = response.data.map((schedule, index) => ({
          id: schedule._id || index.toString(),
          numbClock: schedule.startTime,
          timer: `${schedule.duration} ${t('minute')}`,
          calendar: formatRepeatDays(schedule.repeat),
          isWatering: schedule.status,
          // Add raw data for sorting
          rawTime: schedule.startTime,
          rawRepeat: schedule.repeat,
        }));

        // Sort schedules by time and days
        const sortedSchedules = formattedSchedules.sort((a, b) => {
          // First sort by AM/PM
          const timeA = a.rawTime;
          const timeB = b.rawTime;
          
          // Check if time contains AM/PM
          const isAM_A = timeA.includes('AM');
          const isAM_B = timeB.includes('AM');
          
          // Sort AM before PM
          if (isAM_A !== isAM_B) {
            return isAM_A ? -1 : 1;
          }

          // If both are AM or both are PM, sort by hour
          const hourA = parseInt(timeA.split(':')[0]);
          const hourB = parseInt(timeB.split(':')[0]);
          
          // Convert 12 to 0 for AM
          const adjustedHourA = isAM_A && hourA === 12 ? 0 : hourA;
          const adjustedHourB = isAM_B && hourB === 12 ? 0 : hourB;
          
          if (adjustedHourA !== adjustedHourB) {
            return adjustedHourA - adjustedHourB;
          }

          // If hours are equal, sort by minutes
          const minuteA = parseInt(timeA.split(':')[1]);
          const minuteB = parseInt(timeB.split(':')[1]);
          if (minuteA !== minuteB) {
            return minuteA - minuteB;
          }

          // If times are equal, sort by days
          const daysOrder = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ];
          const firstDayA = a.rawRepeat[0] || '';
          const firstDayB = b.rawRepeat[0] || '';

          return daysOrder.indexOf(firstDayA) - daysOrder.indexOf(firstDayB);
        });

        // Compare with previous schedules to avoid unnecessary updates
        const hasChanges =
          JSON.stringify(sortedSchedules) !==
          JSON.stringify(previousSchedulesRef.current);

        if (hasChanges) {
          setSchedules(sortedSchedules);
          previousSchedulesRef.current = sortedSchedules;
        }
      } else {
        // Only update if there's a change
        if (schedules.length > 0) {
          setSchedules([]);
          previousSchedulesRef.current = [];
        }
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
      // Only show error on initial load
      if (!isBackgroundRefresh) {
        setError('Không thể tải lịch trình. Vui lòng thử lại sau.');
      }
      // Only clear schedules on initial load
      if (!isBackgroundRefresh && schedules.length > 0) {
        setSchedules([]);
        previousSchedulesRef.current = [];
      }
    } finally {
      if (!isBackgroundRefresh) {
        setLoading(false);
      }
    }
  };

  const formatRepeatDays = repeatDays => {
    if (!repeatDays || !Array.isArray(repeatDays)) return '';

    const dayMap = {
      Monday: t('mon'),
      Tuesday: t('tue'),
      Wednesday: t('wed'),
      Thursday: t('thu'),
      Friday: t('fri'),
      Saturday: t('sat'),
      Sunday: t('sun'),
    };

    // Define the order of days
    const dayOrder = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    // Sort the days according to the defined order
    const sortedDays = repeatDays.sort((a, b) => {
      return dayOrder.indexOf(a) - dayOrder.indexOf(b);
    });

    // Convert to Vietnamese format and join
    return sortedDays.map(day => dayMap[day] || day).join(', ');
  };

  const toggleSwitch = async id => {
    try {
      // Find the schedule to update
      const scheduleToUpdate = schedules.find(schedule => schedule.id === id);
      if (!scheduleToUpdate) {
        console.error('Schedule not found');
        return;
      }

      // Call API to update schedule status
      const response = await updateSchedule({
        id_esp: item.id_esp,
        scheduleId: id,
        data: {
          status: !scheduleToUpdate.isWatering,
          startTime: scheduleToUpdate.numbClock,
          duration: parseInt(scheduleToUpdate.timer),
          repeat: scheduleToUpdate.rawRepeat,
        },
      });

      if (response && response.message === 'Schedule updated successfully') {
        // Update local state
        setSchedules(prevSchedules =>
          prevSchedules.map(schedule =>
            schedule.id === id
              ? {...schedule, isWatering: !schedule.isWatering}
              : schedule,
          ),
        );
      } else {
        console.error('Failed to update schedule status');
      }
    } catch (err) {
      console.error('Error toggling schedule:', err);
    }
  };

  const handleGoToSetTimer = schedule => {
    // Convert calendar string to array of days
    const dayMap = {
      'T.2': 'Monday',
      'T.3': 'Tuesday',
      'T.4': 'Wednesday',
      'T.5': 'Thursday',
      'T.6': 'Friday',
      'T.7': 'Saturday',
      'CN': 'Sunday'
    };
    
    const calendarArray = schedule.calendar.split(', ').map(day => dayMap[day.trim()]);
    
    navigation.navigate('SetTimerScreen', {
      item: {
        ...item,
        schedule: {
          ...schedule,
          calendar: calendarArray
        },
      },
    });
  };

  const handleAddNewSchedule = () => {
    navigation.navigate('SetTimerScreen', {
      item: {
        ...item,
        isNewSchedule: true,
      },
    });
  };

  const handleDeleteSchedule = async scheduleId => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa lịch trình này?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Xóa',
        onPress: async () => {
          try {
            // Call API to delete schedule
            await delSchedule({
              id_esp: item.id_esp,
              name: item.controlName || 'water',
              scheduleId: scheduleId,
            });

            // Update local state
            setSchedules(prevSchedules =>
              prevSchedules.filter(schedule => schedule.id !== scheduleId),
            );

            // Update previous schedules ref
            previousSchedulesRef.current = previousSchedulesRef.current.filter(
              schedule => schedule.id !== scheduleId,
            );
          } catch (err) {
            console.error('Error deleting schedule:', err);
            Alert.alert(
              'Lỗi',
              'Không thể xóa lịch trình. Vui lòng thử lại sau.',
            );
          }
        },
        style: 'destructive',
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>{t('saving')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <StatusBar
          backgroundColor={theme === 'light' ? colors.white : colors.bg_dark}
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        />
      )}
      <HeaderCompo
        isPress={() => navigation.goBack()}
        bgcolor={colors.bg_NaN}
        name={item.tenKhu}
        color={theme === 'light' ? colors.black : colors.white}
      />
      <View style={styles.header}>
        <View style={styles.header1}>
          <Text style={styles.textHeader}>{t('garden_schedule')}</Text>
        </View>
      </View>
      <View style={styles.itemAlarm}>
        {schedules.length === 0 ? (
          <Text style={styles.emptyText}>{t('no_schedule_available')}</Text>
        ) : (
          <FlatList
            data={schedules}
            numColumns={1}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.itemWrapper}>
                <ItemAlarm
                  numbClock={item.numbClock}
                  timer={item.timer}
                  calendar={item.calendar}
                  isWatering={item.isWatering}
                  toggleSwitch={() => toggleSwitch(item.id)}
                  onPress={() => handleGoToSetTimer(item)}
                  onLongPress={() => handleDeleteSchedule(item.id)}
                />
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddNewSchedule}>
        <Icon name="add" size={30} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const ItemAlarm = ({
  isWatering,
  toggleSwitch,
  numbClock,
  timer,
  calendar,
  onPress,
  onLongPress,
}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  return (
    <TouchableOpacity
      style={styles.frameItem}
      onPress={onPress}
      onLongPress={onLongPress}>
      <View style={styles.content1}>
        <View style={styles.textNumClock}>
          <Text style={styles.txtNumClock}>{numbClock}</Text>
        </View>
        <View style={styles.textTimer}>
          <Text style={styles.txtTimer}>{timer}</Text>
        </View>
      </View>
      <View style={styles.content2}>
        <View style={styles.txtLich}>
          <Text style={styles.txtTimer}>{calendar}</Text>
        </View>
        <View style={styles.btnWatering}>
          <Switch
            value={isWatering}
            onValueChange={toggleSwitch}
            trackColor={{false: theme === 'light' ? '#d3d3d3':  'white', true: theme === 'light' ? '#d3d3d3':  'white'}}
            thumbColor={isWatering ? colors.primary : '#a0a0a0'}
            style={{transform: [{scale: 1.5}]}}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(AlarmScreen);
