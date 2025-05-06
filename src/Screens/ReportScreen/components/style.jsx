import {StyleSheet} from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
} from '../../assets/common/scaleScreen';
import {fonts} from '../../../assets/common/fontCss';
import colors from '../../../../assets/common/colorCss';

const light = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    alignItems: 'center',
    marginTop: 30,
  },
  frameTable: {
    width: '95%',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 20,
    borderColor: colors.borderColor,
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
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    width: 'auto',
    height: 'auto',
  },
  chartContainer: {
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 20,
    marginBottom: 20,
  },
  pointerLabel: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
  },
  pointerText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  card: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 10,
    paddingVertical: 28,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: colors.bg_cardReport,
    borderWidth: 1,
    borderColor: colors.bg_NaN,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    minWidth: 150,
    minHeight: 90,
  },
  cardTitle: {
    fontSize: 15,
    color: colors.txt_cardReport,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.black,
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
    borderWidth: 1.5,
    borderColor: colors.borderColor,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: colors.white,
    marginHorizontal: 6,
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modeButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 18,
  },
  modeButtonTextActive: {
    color: colors.white,
  },
});

const dark = StyleSheet.create({
  ...light,
  frame: {
    ...light.frame,
    backgroundColor: colors.bg_dark,
  },
  frameTable: {
    ...light.frameTable,
    backgroundColor: colors.bg_dark,
    borderColor: colors.white,
  },
  chartTitle: {
    ...light.chartTitle,
    color: colors.white,
  },
  noDataText: {
    ...light.frameTable,
    color: colors.white,
  },
  pointerLabel: {
    ...light.pointerLabel,
    backgroundColor: colors.white,
  },
  card: {
    ...light.card,
    backgroundColor: colors.bg_cardReport_dark,
    borderColor: colors.white,
  }, 
  cardTitle: {
    ...light.cardTitle,
    color: colors.white,
  },
  cardValue: {
    ...light.cardValue,
    color: colors.white,
  },
  modeButton: {
    ...light.modeButton,
    borderColor: colors.borderColor,
    backgroundColor: colors.bg_cardReport_dark,
  },
  modeButtonActive: {
    ...light.modeButtonActive,
    borderColor: colors.white,
  },
  modeButtonText: {
    ...light.modeButtonText,
    color: colors.white,
  }
  
});

export const createStyle = mode => {
  return mode === 'light' ? light : dark;
};
