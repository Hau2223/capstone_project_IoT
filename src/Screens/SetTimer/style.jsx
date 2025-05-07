import {StyleSheet, Dimensions} from 'react-native';
import colors from '../../../assets/common/colorCss';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CLOCK_SIZE = SCREEN_WIDTH - 80;
const CLOCK_RADIUS = CLOCK_SIZE / 2;
const CLOCK_INNER_RADIUS = CLOCK_RADIUS - 40;
const DOT_SIZE = 30;

const light = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.white,
  },
  cancelButton: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '800',
  },
  saveButton: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '800',
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
    color: colors.black,
    marginVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.bg_modal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: colors.white,
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
    backgroundColor: colors.bg_selectClock,
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
    color: colors.black,
  },
  selectedNumber: {
    color: colors.txtSelectTex,
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
    backgroundColor: colors.primary,
    position: 'absolute',
    left: CLOCK_SIZE / 2,
    transformOrigin: 'left center',
  },
  clockHandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  clockHandEnd: {
    position: 'absolute',
    right: -12,
    top: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  durationButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.bg_selectClock,
    borderWidth: 2,
    borderColor: colors.bg_selectClock,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
  },
  durationPickerContainer: {
    width: '100%',
  },
  durationPicker: {
    color: colors.black,
    width: '100%',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 17,
    color: colors.black,
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
    borderColor: colors.borderColor,
    backgroundColor: colors.white,
  },
  selectedDay: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 12,
    color: colors.black,
    fontWeight: '500'
  },
  selectedDayText: {
    color: colors.white,
  },
  inputSection: {
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.bg_selectClock,
  },
  nameInput: {
    fontSize: 18,
    color: colors.black,
    padding: 0,
  },
  settingsSection: {
    marginVertical: 20,
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.black,
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
    color: colors.black,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.txtSetting,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.bg_selectClock,
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
    color: colors.black,
    opacity: 0.5,
  },
  activeTimeUnit: {
    opacity: 1,
    color: colors.black,
    fontWeight: 'bold',
  },
  timeUnitSeparator: {
    fontSize: 40,
    marginHorizontal: 5,
    color: colors.black,
  },
  ampmContainer: {
    flexDirection: 'row',
    backgroundColor: colors.bg_selectClock,
    borderWidth: 1,
    borderColor: colors.bg_selectClock,
    borderRadius: 8,
    padding: 4,
  },
  ampmButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  ampmButtonActive: {
    backgroundColor: colors.primary,
  },
  ampmText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  ampmTextActive: {
    color: colors.white,
  },
  pickerWrapper: {
    height: 200,
    width: 80,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  pickerLabel: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 8,
  },
  pickerContent: {
    paddingVertical: 75,
  },
  pickerItem: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPickerItem: {
    backgroundColor: colors.primary + '20',
  },
  pickerItemText: {
    fontSize: 24,
    color: colors.gray,
  },
  selectedPickerItemText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  timeSeparator: {
    fontSize: 32,
    color: colors.gray,
    marginTop: 40,
  },
  ampmWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
});

const dark = StyleSheet.create({
  ...light,
  safeArea: {
    ...light.safeArea,
    backgroundColor: colors.bg_dark,
  },
  header: {
    ...light.header,
    backgroundColor: colors.bg_dark,
  },
  selectedTime: {
    ...light.selectedTime,
    color: colors.white,
  },
  pickerContainer: {
    ...light.pickerContainer,
    backgroundColor: colors.bg_dark,
  },
  clockFace: {
    ...light.clockFace,
    backgroundColor: colors.bg_dark,
    borderWidth: 2,
    borderColor: colors.white,
  },
  clockNumberText: {
    ...light.clockNumberText,
    color: colors.white,
  },
  selectedNumber: {
    ...light.clockNumberText,
    color: colors.white,
  },
  //
  durationText: {
    ...light.durationText,
    color: colors.black,
  },
  timeUnitText: {
    ...light.timeUnitText,
    color: colors.white,
  },
  activeTimeUnit: {
    ...light.activeTimeUnit,
    color: colors.white,
  },
  timeUnitSeparator: {
    ...light.timeUnitSeparator,
    color: colors.white,
  },
  ampmContainer: {
    ...light.ampmContainer,
    backgroundColor: colors.bg_dark,
  },

  durationButton: {
    ...light.durationButton,
    backgroundColor: colors.bg_dark,
  },
  durationText: {
    ...light.durationText,
    color: colors.white,
  },
  durationPicker: {
    ...light.durationPicker,
    color: colors.white,
  },
  sectionTitle: {
    ...light.sectionTitle,
    color: colors.white,
  },
  nameInput: {
    ...light.nameInput,
    color: colors.white,
  },
  settingsSection: {
    ...light.settingsSection,
    backgroundColor: colors.bg_dark,
    shadowColor: colors.white
  },
  settingTitle: {
    ...light.settingTitle,
    color: colors.white,
  },
  settingDescription: {
    ...light.settingDescription,
    color: colors.white,
  },
  pickerWrapper: {
    ...light.pickerWrapper,
    backgroundColor: '#2a2a2a',
  },
  pickerLabel: {
    ...light.pickerLabel,
    color: colors.lightGray,
  },
  pickerItemText: {
    ...light.pickerItemText,
    color: colors.lightGray,
  },
  timeSeparator: {
    ...light.timeSeparator,
    color: colors.lightGray,
  },
  ampmWrapper: {
    ...light.ampmWrapper,
    backgroundColor: '#2a2a2a',
  },
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
