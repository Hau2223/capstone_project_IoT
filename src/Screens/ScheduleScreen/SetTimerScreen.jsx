import { TouchableOpacity, StyleSheet, Text, View, ScrollView, SafeAreaView, TextInput, Switch, Modal, Platform, Dimensions, PanResponder, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import { Picker } from '@react-native-picker/picker';
import {updateSchedule, addSchedule} from '../../../services/scheduleServices';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CLOCK_SIZE = SCREEN_WIDTH - 80;
const CLOCK_RADIUS = CLOCK_SIZE / 2;
const CLOCK_INNER_RADIUS = CLOCK_RADIUS - 40;
const DOT_SIZE = 30;

const SetTimerScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const isNewSchedule = item?.isNewSchedule;
  const existingSchedule = item?.schedule;

  const [selectedTime, setSelectedTime] = useState(() => {
    if (existingSchedule?.numbClock) {
      const [hours, minutes] = existingSchedule.numbClock.split(':');
      const date = new Date();
      date.setHours(parseInt(hours));
      date.setMinutes(parseInt(minutes));
      return date;
    }
    return new Date();
  });

  const [isAM, setIsAM] = useState(() => {
    const hours = selectedTime.getHours();
    return hours < 12;
  });

  const [duration, setDuration] = useState(() => {
    if (existingSchedule?.timer) {
      const timerMatch = existingSchedule.timer.match(/(\d+)/);
      if (timerMatch) {
        return parseInt(timerMatch[1]);
      }
    }
    return 30; // Default duration
  });

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState(() => {
    if (existingSchedule?.calendar) {
      const dayMap = {
        'T.2': '2', 'T.3': '3', 'T.4': '4', 'T.5': '5',
        'T.6': '6', 'T.7': '7', 'CN': 'C'
      };
      return existingSchedule.calendar.split(', ')
        .map(day => dayMap[day.trim()])
        .filter(Boolean);
    }
    return [];
  });
  const [scheduleName, setScheduleName] = useState(existingSchedule?.name || '');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [isHourMode, setIsHourMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [timeInputMode, setTimeInputMode] = useState('clock'); // 'clock' or 'keypad'

  const pan = useRef(new Animated.ValueXY()).current;
  const angle = useRef(new Animated.Value(0)).current;

  const daysOfWeek = [
    { id: '2', label: 'T.2' },
    { id: '3', label: 'T.3' },
    { id: '4', label: 'T.4' },
    { id: '5', label: 'T.5' },
    { id: '6', label: 'T.6' },
    { id: '7', label: 'T.7' },
    { id: 'C', label: 'CN' },
  ];

  const toggleDay = (dayId) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const formatTimeUnit = (unit) => unit.toString().padStart(2, '0');

  const toggleAMPM = (isAM) => {
    setIsAM(isAM);
    const newTime = new Date(selectedTime);
    const currentHours = newTime.getHours();
    if (isAM && currentHours >= 12) {
      newTime.setHours(currentHours - 12);
    } else if (!isAM && currentHours < 12) {
      newTime.setHours(currentHours + 12);
    }
    setSelectedTime(newTime);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Convert selected days to API format
      const dayMap = {
        '2': 'Monday', '3': 'Tuesday', '4': 'Wednesday', '5': 'Thursday',
        '6': 'Friday', '7': 'Saturday', 'C': 'Sunday'
      };
      const repeatDays = selectedDays.map(day => dayMap[day]);

      // Format time to 24-hour format (HH:mm)
      let hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const formattedTime = `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}`;

      if (!isNewSchedule && existingSchedule) {
        // Prepare update data
        const updateData = {
          id_esp: item.id_esp,
          scheduleId: existingSchedule.id,
          data: {
            startTime: formattedTime,
            repeat: repeatDays,
            status: existingSchedule.isWatering || false,
            duration: duration
          }
        };

        console.log('Update data being sent:', JSON.stringify(updateData, null, 2));

        // Call update API
        const response = await updateSchedule(updateData);
        console.log('Raw API response:', response);
        
        // Parse response if it's a string
        let parsedResponse = response;
        if (typeof response === 'string') {
          try {
            parsedResponse = JSON.parse(response);
          } catch (e) {
            console.error('Error parsing response:', e);
          }
        }

        console.log('Parsed API response:', parsedResponse);
        
        if (parsedResponse && 
            (parsedResponse.message === "Schedule updated successfully" || 
             parsedResponse.status === 200 || 
             parsedResponse.status === true)) {
          console.log('Schedule updated successfully');
          navigation.goBack();
        } else {
          console.error('Failed to update schedule. Response:', parsedResponse);
        }
      } else {
        // Handle new schedule creation
        const addData = {
          id_esp: item.id_esp,
          name: item.controlName || 'water',
          data: {
            startTime: formattedTime,
            repeat: repeatDays,
            status: false,
            duration: duration
          }
        };

        console.log('Add schedule data:', JSON.stringify(addData, null, 2));
        const response = await addSchedule(addData);
        console.log('Add schedule response:', response);

        if (response && response.message === "Schedule added successfully") {
          console.log('Schedule added successfully');
          navigation.goBack();
        } else {
          console.error('Failed to add schedule. Response:', response);
        }
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      const { moveX, moveY } = gesture;
      const centerX = SCREEN_WIDTH / 2;
      const centerY = CLOCK_SIZE / 2 + 100;
      
      let angleRad = Math.atan2(moveY - centerY, moveX - centerX);
      let angleDeg = (angleRad * 180) / Math.PI + 90;
      if (angleDeg < 0) angleDeg += 360;

      const value = isHourMode ? 
        Math.round((angleDeg / 360) * 12) % 12 :
        Math.round((angleDeg / 360) * 60) % 60;

      const newTime = new Date(selectedTime);
      if (isHourMode) {
        newTime.setHours(value === 0 ? 12 : value);
      } else {
        newTime.setMinutes(value);
      }
      setSelectedTime(newTime);
    },
    onPanResponderRelease: () => {
      if (isHourMode) {
        setIsHourMode(false);
      }
    },
  });

  const renderClockNumbers = () => {
    const numbers = isHourMode ? 
      Array.from({ length: 12 }, (_, i) => i + 1) :
      Array.from({ length: 60 }, (_, i) => i).filter(i => i % 5 === 0);

    return numbers.map((num) => {
      const angle = ((num * (360 / (isHourMode ? 12 : 60))) - 90) * Math.PI / 180;
      const radius = isHourMode ? CLOCK_RADIUS - 30 : CLOCK_RADIUS - 25;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      return (
        <View
          key={num}
          style={[
            styles.clockNumber,
            {
              transform: [
                { translateX: x },
                { translateY: y },
              ],
            },
          ]}
        >
          <Text style={[
            styles.clockNumberText,
            selectedTime.getHours() === num && isHourMode && styles.selectedNumber,
            selectedTime.getMinutes() === num && !isHourMode && styles.selectedNumber,
          ]}>
            {num}
          </Text>
        </View>
      );
    });
  };

  const renderClockHand = () => {
    const value = isHourMode ? selectedTime.getHours() : selectedTime.getMinutes();
    const angle = ((value * (360 / (isHourMode ? 12 : 60))) - 90) * Math.PI / 180;
    const radius = isHourMode ? CLOCK_INNER_RADIUS : CLOCK_RADIUS - 30;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    return (
      <View style={styles.clockHandContainer}>
        <View style={styles.clockHandDot} />
        <View
          style={[
            styles.clockHand,
            {
              width: radius,
              transform: [
                { rotate: `${angle}rad` },
              ],
            },
          ]}
        >
          <View style={styles.clockHandEnd} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Huỷ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={[styles.saveButton, loading && styles.saveButtonDisabled]}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.timeSection}>
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <Text style={styles.selectedTime}>
              {formatTimeUnit(selectedTime.getHours())}:{formatTimeUnit(selectedTime.getMinutes())}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.durationButton}
            onPress={() => setShowDurationPicker(true)}
          >
            <Text style={styles.durationText}>{duration} phút</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showTimePicker}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => {
                  setShowTimePicker(false);
                  setIsHourMode(true);
                }}>
                  <Text style={styles.cancelButton}>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setShowTimePicker(false);
                  setIsHourMode(true);
                }}>
                  <Text style={styles.saveButton}>Xong</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.timeDisplayContainer}>
                <View style={styles.timeDisplay}>
                  <TouchableOpacity 
                    onPress={() => setIsHourMode(true)}
                    style={styles.timeUnitButton}
                  >
                    <Text style={[
                      styles.timeUnitText,
                      isHourMode && styles.activeTimeUnit
                    ]}>
                      {formatTimeUnit(selectedTime.getHours() % 12 || 12)}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.timeUnitSeparator}>:</Text>
                  <TouchableOpacity 
                    onPress={() => setIsHourMode(false)}
                    style={styles.timeUnitButton}
                  >
                    <Text style={[
                      styles.timeUnitText,
                      !isHourMode && styles.activeTimeUnit
                    ]}>
                      {formatTimeUnit(selectedTime.getMinutes())}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.ampmContainer}>
                  <TouchableOpacity 
                    onPress={() => toggleAMPM(true)}
                    style={[
                      styles.ampmButton,
                      isAM && styles.ampmButtonActive
                    ]}
                  >
                    <Text style={[
                      styles.ampmText,
                      isAM && styles.ampmTextActive
                    ]}>AM</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => toggleAMPM(false)}
                    style={[
                      styles.ampmButton,
                      !isAM && styles.ampmButtonActive
                    ]}
                  >
                    <Text style={[
                      styles.ampmText,
                      !isAM && styles.ampmTextActive
                    ]}>PM</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.clockContainer} {...panResponder.panHandlers}>
                <View style={styles.clockFace}>
                  {renderClockNumbers()}
                  {renderClockHand()}
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showDurationPicker}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setShowDurationPicker(false)}>
                  <Text style={styles.cancelButton}>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDurationPicker(false)}>
                  <Text style={styles.saveButton}>Xong</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.durationPickerContainer}>
                <Picker
                  selectedValue={duration}
                  onValueChange={(itemValue) => setDuration(itemValue)}
                  style={styles.durationPicker}
                >
                  {[15, 30, 45, 60, 90, 120].map((value) => (
                    <Picker.Item 
                      key={value} 
                      label={`${value} phút`} 
                      value={value} 
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mỗi {selectedDays.map(day => {
            const dayObj = daysOfWeek.find(d => d.id === day);
            return dayObj ? dayObj.label : '';
          }).join(', ')}</Text>
          <View style={styles.daysContainer}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day.id) && styles.selectedDay,
                ]}
                onPress={() => toggleDay(day.id)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDays.includes(day.id) && styles.selectedDayText,
                  ]}
                >
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.nameInput}
            placeholder="Tên lịch hẹn"
            value={scheduleName}
            onChangeText={setScheduleName}
          />
        </View>

        <View style={styles.settingsSection}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Thông báo</Text>
              <Text style={styles.settingDescription}>Nhận thông báo khi đến giờ</Text>
            </View>
            <Switch
              value={notificationEnabled}
              onValueChange={setNotificationEnabled}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notificationEnabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingDivider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Âm thanh chuông báo</Text>
              <Text style={styles.settingDescription}>Phát âm thanh khi thông báo</Text>
            </View>
            <Switch
              value={alarmEnabled}
              onValueChange={setAlarmEnabled}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={alarmEnabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SetTimerScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cancelButton: {
    fontSize: 17,
    color: '#FF9500',
  },
  saveButton: {
    fontSize: 17,
    color: '#FF9500',
    fontWeight: '600',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  container: {
    flex: 1,
  },
  timeSection: {
    alignItems: 'center',
    paddingVertical: 40,
    position: 'relative',
  },
  selectedTime: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: SCREEN_WIDTH - 40,
    padding: 20,
    alignItems: 'center',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  clockContainer: {
    width: CLOCK_SIZE,
    height: CLOCK_SIZE,
    marginVertical: 20,
  },
  clockFace: {
    width: CLOCK_SIZE,
    height: CLOCK_SIZE,
    borderRadius: CLOCK_SIZE / 2,
    backgroundColor: '#f0f0f0',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockNumber: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockNumberText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  selectedNumber: {
    color: '#FF9500',
    fontWeight: 'bold',
  },
  clockHandContainer: {
    position: 'absolute',
    width: CLOCK_SIZE,
    height: CLOCK_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockHand: {
    height: 2,
    backgroundColor: '#FF9500',
    position: 'absolute',
    left: CLOCK_SIZE / 2,
    transformOrigin: 'left center',
  },
  clockHandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF9500',
  },
  clockHandEnd: {
    position: 'absolute',
    right: -12,
    top: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF9500',
  },
  durationButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  durationText: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
  },
  durationPickerContainer: {
    width: '100%',
    height: 200,
  },
  durationPicker: {
    width: '100%',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 17,
    color: '#000000',
    marginBottom: 15,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#ffffff',
  },
  selectedDay: {
    backgroundColor: '#FF9500',
    borderColor: '#FF9500',
  },
  dayText: {
    fontSize: 15,
    color: '#000000',
  },
  selectedDayText: {
    color: '#ffffff',
  },
  inputSection: {
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  nameInput: {
    fontSize: 17,
    color: '#000000',
    padding: 0,
  },
  settingsSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666666',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  timeDisplayContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeUnitButton: {
    padding: 10,
  },
  timeUnitText: {
    fontSize: 40,
    color: '#000',
    opacity: 0.5,
  },
  activeTimeUnit: {
    opacity: 1,
    fontWeight: 'bold',
  },
  timeUnitSeparator: {
    fontSize: 40,
    marginHorizontal: 5,
    color: '#000',
  },
  ampmContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  ampmButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  ampmButtonActive: {
    backgroundColor: '#FF9500',
  },
  ampmText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  ampmTextActive: {
    color: '#fff',
  },
});