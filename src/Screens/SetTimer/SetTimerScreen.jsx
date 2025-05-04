import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TextInput,
  Switch,
  Modal,
  Platform,
  Dimensions,
  PanResponder,
  Animated,
  StatusBar,
} from 'react-native';
import React, {useState, useRef, useContext, memo} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import {updateSchedule, addSchedule} from '../../../services/scheduleServices';
import {ThemeContext} from '../../../assets/common/themeProvider';
import {createStyle} from './style';
import {useTranslation} from 'react-i18next';
import colors from '../../../assets/common/colorCss';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CLOCK_SIZE = SCREEN_WIDTH - 80;
const CLOCK_RADIUS = CLOCK_SIZE / 2;
const CLOCK_INNER_RADIUS = CLOCK_RADIUS - 40;
const DOT_SIZE = 30;

const SetTimerScreen = ({route, navigation}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const isFocused = useIsFocused();
  const {item} = route.params;
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
        'T.2': '2',
        'T.3': '3',
        'T.4': '4',
        'T.5': '5',
        'T.6': '6',
        'T.7': '7',
        CN: 'C',
      };
      return existingSchedule.calendar
        .split(', ')
        .map(day => dayMap[day.trim()])
        .filter(Boolean);
    }
    return [];
  });
  const [scheduleName, setScheduleName] = useState(
    existingSchedule?.name || '',
  );
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [isHourMode, setIsHourMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    {id: '2', label: t('mon')},
    {id: '3', label: t('tue')},
    {id: '4', label: t('wed')},
    {id: '5', label: t('thu')},
    {id: '6', label: t('fri')},
    {id: '7', label: t('sat')},
    {id: 'C', label: t('sun')},
  ];

  const toggleDay = dayId => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter(d => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const formatTimeUnit = unit => unit.toString().padStart(2, '0');

  const toggleAMPM = isAM => {
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
        2: 'Monday',
        3: 'Tuesday',
        4: 'Wednesday',
        5: 'Thursday',
        6: 'Friday',
        7: 'Saturday',
        C: 'Sunday',
      };
      const repeatDays = selectedDays.map(day => dayMap[day]);

      // Format time to 24-hour format (HH:mm)
      let hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const formattedTime = `${formatTimeUnit(hours)}:${formatTimeUnit(
        minutes,
      )}`;

      if (!isNewSchedule && existingSchedule) {
        // Prepare update data
        const updateData = {
          id_esp: item.id_esp,
          scheduleId: existingSchedule.id,
          data: {
            startTime: formattedTime,
            repeat: repeatDays,
            status: existingSchedule.isWatering || false,
            duration: duration,
          },
        };

        console.log(
          'Update data being sent:',
          JSON.stringify(updateData, null, 2),
        );

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

        if (
          parsedResponse &&
          (parsedResponse.message === 'Schedule updated successfully' ||
            parsedResponse.status === 200 ||
            parsedResponse.status === true)
        ) {
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
            duration: duration,
          },
        };

        console.log('Add schedule data:', JSON.stringify(addData, null, 2));
        const response = await addSchedule(addData);
        console.log('Add schedule response:', response);

        if (response && response.message === 'Schedule added successfully') {
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
      const {moveX, moveY} = gesture;
      const centerX = SCREEN_WIDTH / 2;
      const centerY = CLOCK_SIZE / 2 + 100;

      let angleRad = Math.atan2(moveY - centerY, moveX - centerX);
      let angleDeg = (angleRad * 180) / Math.PI + 90;
      if (angleDeg < 0) angleDeg += 360;

      const value = isHourMode
        ? Math.round((angleDeg / 360) * 12) % 12
        : Math.round((angleDeg / 360) * 60) % 60;

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
    const numbers = isHourMode
      ? Array.from({length: 12}, (_, i) => i + 1)
      : Array.from({length: 60}, (_, i) => i).filter(i => i % 5 === 0);

    return numbers.map(num => {
      const angle =
        ((num * (360 / (isHourMode ? 12 : 60)) - 90) * Math.PI) / 180;
      const radius = isHourMode ? CLOCK_RADIUS - 30 : CLOCK_RADIUS - 25;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      return (
        <View
          key={num}
          style={[
            styles.clockNumber,
            {
              transform: [{translateX: x}, {translateY: y}],
            },
          ]}>
          <Text
            style={[
              styles.clockNumberText,
              selectedTime.getHours() === num &&
                isHourMode &&
                styles.selectedNumber,
              selectedTime.getMinutes() === num &&
                !isHourMode &&
                styles.selectedNumber,
            ]}>
            {num}
          </Text>
        </View>
      );
    });
  };

  const renderClockHand = () => {
    const value = isHourMode
      ? selectedTime.getHours()
      : selectedTime.getMinutes();
    const angle =
      ((value * (360 / (isHourMode ? 12 : 60)) - 90) * Math.PI) / 180;
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
              transform: [{rotate: `${angle}rad`}],
            },
          ]}>
          <View style={styles.clockHandEnd} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isFocused && (
        <StatusBar
          backgroundColor={theme === 'light' ? colors.white : colors.bg_dark}
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        />
      )}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>{t('cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}>
            {loading ? t('saving') : t('save')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.timeSection}>
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <Text style={styles.selectedTime}>
              {formatTimeUnit(selectedTime.getHours())}:
              {formatTimeUnit(selectedTime.getMinutes())}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.durationButton}
            onPress={() => setShowDurationPicker(true)}>
            <Text style={styles.durationText}>{duration} {t('minute')}</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="fade"
          statusBarTranslucent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity
                  onPress={() => {
                    setShowTimePicker(false);
                    setIsHourMode(true);
                  }}>
                  <Text style={styles.cancelButton}>{t('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowTimePicker(false);
                    setIsHourMode(true);
                  }}>
                  <Text style={styles.saveButton}>{t('save')}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.timeDisplayContainer}>
                <View style={styles.timeDisplay}>
                  <TouchableOpacity
                    onPress={() => setIsHourMode(true)}
                    style={styles.timeUnitButton}>
                    <Text
                      style={[
                        styles.timeUnitText,
                        isHourMode && styles.activeTimeUnit,
                      ]}>
                      {formatTimeUnit(selectedTime.getHours() % 12 || 12)}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.timeUnitSeparator}>:</Text>
                  <TouchableOpacity
                    onPress={() => setIsHourMode(false)}
                    style={styles.timeUnitButton}>
                    <Text
                      style={[
                        styles.timeUnitText,
                        !isHourMode && styles.activeTimeUnit,
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
                      isAM && styles.ampmButtonActive,
                    ]}>
                    <Text
                      style={[styles.ampmText, isAM && styles.ampmTextActive]}>
                      AM
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => toggleAMPM(false)}
                    style={[
                      styles.ampmButton,
                      !isAM && styles.ampmButtonActive,
                    ]}>
                    <Text
                      style={[styles.ampmText, !isAM && styles.ampmTextActive]}>
                      PM
                    </Text>
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
          transparent={true}
          animationType="fade"
          statusBarTranslucent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setShowDurationPicker(false)}>
                  <Text style={styles.cancelButton}>{t('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDurationPicker(false)}>
                  <Text style={styles.saveButton}>{t('save')}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.durationPickerContainer}>
                <Picker
                  selectedValue={duration}
                  onValueChange={itemValue => setDuration(itemValue)}
                  dropdownIconColor={theme === 'light' ? colors.black : colors.white}
                  style={styles.durationPicker}
                  >
                  {[15, 30, 45, 60, 90, 120].map(value => (
                    <Picker.Item
                      key={value}
                      label={`${value} ${t('minute')}`}
                      value={value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('every')}{' '}
            {selectedDays
              .map(day => {
                const dayObj = daysOfWeek.find(d => d.id === day);
                return dayObj ? dayObj.label : '';
              })
              .join(', ')}
          </Text>
          <View style={styles.daysContainer}>
            {daysOfWeek.map(day => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day.id) && styles.selectedDay,
                ]}
                onPress={() => toggleDay(day.id)}>
                <Text
                  style={[
                    styles.dayText,
                    selectedDays.includes(day.id) && styles.selectedDayText,
                  ]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.nameInput}
            placeholder={t('appointment_name')}
            placeholderTextColor={theme === 'light' ? colors.black : colors.white}
            value={scheduleName}
            onChangeText={setScheduleName}
          />
        </View>

        <View style={styles.settingsSection}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{t('notification')}</Text>
              <Text style={styles.settingDescription}>
                {t('notify_on_time')}
              </Text>
            </View>
            <Switch
              value={notificationEnabled}
              onValueChange={setNotificationEnabled}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={notificationEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{t('alarm_sound')}</Text>
              <Text style={styles.settingDescription}>
                {t('play_sound_when_notifying')}
              </Text>
            </View>
            <Switch
              value={alarmEnabled}
              onValueChange={setAlarmEnabled}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={alarmEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(SetTimerScreen);
