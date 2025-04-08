import {StyleSheet} from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
} from '../../assets/common/scaleScreen';
import colors from '../../../assets/common/colorCss';
import {fonts} from '../../../assets/common/fontCss';

const light = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  profileWrapper: {
    width: '100%',
    height: 120,
    position: 'relative',
    backgroundColor: colors.primary,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'absolute',
    transform: [{translateY: 75}],
    alignItems: 'center',
  },
  avatar: {
    width: 125,
    height: 125,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: colors.white,
  },

  profileName: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '600',
    color: colors.black,
  },

  body: {
    flex: 1,
    justifyContent: 'center',
    top: -50,
    paddingHorizontal: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    alignSelf: 'flex-start',
  },

  settingBox: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  optionText: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.txtBtnSetting,
  },
});

const dark = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_dark,
  },
  profileWrapper: {
    width: '100%',
    height: 120,
    position: 'relative',
    backgroundColor: colors.primary,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'absolute',
    transform: [{translateY: 75}],
    alignItems: 'center',
  },
  avatar: {
    width: 125,
    height: 125,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: colors.black,
  },

  profileName: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    top: -50,
    paddingHorizontal: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    alignSelf: 'flex-start',
  },

  settingBox: {
    width: '100%',
    backgroundColor: colors.bg_dark,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.inacticetabDark,
    shadowColor: colors.white,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  optionText: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.inacticetabDark,
  },
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};