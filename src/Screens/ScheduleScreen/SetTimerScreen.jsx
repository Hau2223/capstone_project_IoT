import { TouchableOpacity, StyleSheet, Text, View, ScrollView, SafeAreaView, TextInput, Switch, Modal, Platform, Dimensions, PanResponder, Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CLOCK_SIZE = SCREEN_WIDTH - 80;
const CLOCK_RADIUS = CLOCK_SIZE / 2;
const CLOCK_INNER_RADIUS = CLOCK_RADIUS - 40;
const DOT_SIZE = 30;

const CustomSwitch = ({ value, onValueChange, activeColor = '#4CAF50' }) => {
  const translateX = useRef(new Animated.Value(value ? 22 : 0)).current;
  
  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 22 : 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }, [value]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      style={[
        styles.switchContainer,
        { backgroundColor: value ? activeColor : '#e0e0e0' }
      ]}
    >
      <Animated.View
        style={[
          styles.switchThumb,
          {
            transform: [{ translateX }],
            backgroundColor: value ? '#fff' : '#f5f5f5',
          }
        ]}
      >
        {value && (
          <View style={styles.switchIcon}>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const SetTimerScreen = () => {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [scheduleName, setScheduleName] = useState('');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [isHourMode, setIsHourMode] = useState(true);

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

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const toggleDay = (dayId) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const formatTimeUnit = (unit) => unit.toString().padStart(2, '0');

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
        <TouchableOpacity>
          <Text style={styles.cancelButton}>Huỷ</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.saveButton}>Lưu</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.timeSection}>
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <Text style={styles.selectedTime}>
              {formatTimeUnit(selectedTime.getHours())}:{formatTimeUnit(selectedTime.getMinutes())}
            </Text>
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
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
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
                <TouchableOpacity 
                  onPress={() => setIsHourMode(true)}
                  style={styles.timeUnitButton}
                >
                  <Text style={[
                    styles.timeUnitText,
                    isHourMode && styles.activeTimeUnit
                  ]}>
                    {formatTimeUnit(selectedTime.getHours())}
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

              <View style={styles.clockContainer} {...panResponder.panHandlers}>
                <View style={styles.clockFace}>
                  {renderClockNumbers()}
                  {renderClockHand()}
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mỗi T.3, T5, T7</Text>
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
            <CustomSwitch
              value={notificationEnabled}
              onValueChange={setNotificationEnabled}
              activeColor="#4CAF50"
            />
          </View>
          
          <View style={styles.settingDivider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Âm thanh chuông báo</Text>
              <Text style={styles.settingDescription}>Phát âm thanh khi thông báo</Text>
            </View>
            <CustomSwitch
              value={alarmEnabled}
              onValueChange={setAlarmEnabled}
              activeColor="#4CAF50"
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
  timeDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
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
  switchContainer: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchIcon: {
    opacity: 1,
  },
  switchIconText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
});