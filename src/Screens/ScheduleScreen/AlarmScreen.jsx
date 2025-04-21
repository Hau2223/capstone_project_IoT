import {StyleSheet, Text, View, FlatList, TouchableOpacity, Alert} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {Switch} from 'react-native-paper';
import {scheduleId} from '../../../services/scheduleServices';
import {delSchedule} from '../../../services/scheduleServices';
import {updateSchedule} from '../../../services/scheduleServices';
import Icon from 'react-native-vector-icons/Ionicons';

const AlarmScreen = ({route, navigation}) => {
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
        name: controlName
      });
      
      // console.log('Schedule API response:', response); // Debug log

      if (response?.data) {
        const formattedSchedules = response.data.map((schedule, index) => ({
          id: schedule._id || index.toString(),
          numbClock: schedule.startTime,
          timer: `${schedule.duration} phút`,
          calendar: formatRepeatDays(schedule.repeat),
          isWatering: schedule.status,
          // Add raw data for sorting
          rawTime: schedule.startTime,
          rawRepeat: schedule.repeat
        }));
        
        // Sort schedules by time and days
        const sortedSchedules = formattedSchedules.sort((a, b) => {
          // First sort by time
          const timeA = a.rawTime.split(':').map(Number);
          const timeB = b.rawTime.split(':').map(Number);
          
          if (timeA[0] !== timeB[0]) {
            return timeA[0] - timeB[0];
          }
          if (timeA[1] !== timeB[1]) {
            return timeA[1] - timeB[1];
          }
          
          // If times are equal, sort by days
          const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          const firstDayA = a.rawRepeat[0] || '';
          const firstDayB = b.rawRepeat[0] || '';
          
          return daysOrder.indexOf(firstDayA) - daysOrder.indexOf(firstDayB);
        });
        
        // Compare with previous schedules to avoid unnecessary updates
        const hasChanges = JSON.stringify(sortedSchedules) !== JSON.stringify(previousSchedulesRef.current);
        
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

  const formatRepeatDays = (repeatDays) => {
    if (!repeatDays || !Array.isArray(repeatDays)) return '';
    
    const dayMap = {
      'Monday': 'T.2',
      'Tuesday': 'T.3',
      'Wednesday': 'T.4',
      'Thursday': 'T.5',
      'Friday': 'T.6',
      'Saturday': 'T.7',
      'Sunday': 'CN'
    };

    // Define the order of days
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Sort the days according to the defined order
    const sortedDays = repeatDays.sort((a, b) => {
      return dayOrder.indexOf(a) - dayOrder.indexOf(b);
    });

    // Convert to Vietnamese format and join
    return sortedDays.map(day => dayMap[day] || day).join(', ');
  };

  const toggleSwitch = async (id) => {
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
          repeat: scheduleToUpdate.rawRepeat
        }
      });

      if (response && response.message === "Schedule updated successfully") {
        // Update local state
        setSchedules(prevSchedules =>
          prevSchedules.map(schedule =>
            schedule.id === id
              ? {...schedule, isWatering: !schedule.isWatering}
              : schedule
          )
        );
      } else {
        console.error('Failed to update schedule status');
      }
    } catch (err) {
      console.error('Error toggling schedule:', err);
    }
  };

  const handleGoToSetTimer = (schedule) => {
    navigation.navigate('SetTimerScreen', { 
      item: {
        ...item,
        schedule: schedule
      }
    });
  };

  const handleAddNewSchedule = () => {
    navigation.navigate('SetTimerScreen', { 
      item: {
        ...item,
        isNewSchedule: true
      }
    });
  };

  const handleDeleteSchedule = async (scheduleId) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa lịch trình này?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        { 
          text: "Xóa", 
          onPress: async () => {
            try {
              // Call API to delete schedule
              await delSchedule({
                id_esp: item.id_esp,
                name: item.controlName || 'water',
                scheduleId: scheduleId
              });
              
              // Update local state
              setSchedules(prevSchedules => 
                prevSchedules.filter(schedule => schedule.id !== scheduleId)
              );
              
              // Update previous schedules ref
              previousSchedulesRef.current = previousSchedulesRef.current.filter(
                schedule => schedule.id !== scheduleId
              );
            } catch (err) {
              console.error('Error deleting schedule:', err);
              Alert.alert(
                "Lỗi",
                "Không thể xóa lịch trình. Vui lòng thử lại sau."
              );
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Đang tải...</Text>
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
      <View style={styles.header}>
        <View style={styles.header1}>
          <Text style={styles.textHeader}>{item.tenKhu}</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddNewSchedule}
        >
          <Icon name="add-circle" size={40} color="#63A776" />
        </TouchableOpacity>
      </View>
      <View style={styles.itemAlarm}>
        {schedules.length === 0 ? (
          <Text style={styles.emptyText}>Không có lịch trình nào</Text>
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
          />
        )}
      </View>
    </View>
  );
};

const ItemAlarm = ({isWatering, toggleSwitch, numbClock, timer, calendar, onPress, onLongPress}) => {
  return (
    <TouchableOpacity 
      style={styles.frameItem} 
      onPress={onPress}
      onLongPress={onLongPress}
    >
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
            trackColor={{false: 'white', true: 'white'}}
            thumbColor={isWatering ? '#63A776' : '#ACACAC'}
            style={{transform: [{scale: 1.7}]}}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AlarmScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
  header: {
    height: 70,
    width: '100%',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  header1: {
    height: 70,
    flex: 1,
    justifyContent: 'center',
  },
  textHeader: {
    color: '#000000',
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  addButton: {
    padding: 5,
  },
  itemAlarm: {
    height: "auto",
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 0
  },
  frameItem: {
    height: 90,
    width: '95%',
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#C8BFBF',
    marginBottom: 10
  },
  content1: {
    height: 'auto',
    width: '50%',
    flexDirection: 'column',
  },
  textNumClock: {
    height: '50%',
    width: '100%',
    flexDirection: 'row',
  },
  textTimer: {
    height: '50%',
    width: '100%',
  },
  txtNumClock: {
    fontSize: 35,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  txtTimer: {
    fontSize: 18,
    fontWeight: '500',
    justifyContent: 'center',
  },
  content2: {
    height: 'auto',
    width: '50%',
    flexDirection: 'row',
  },
  txtLich: {
    height: '100%',
    width: '50%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  btnWatering: {
    height: '100%',
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
