import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

const guidelineBaseWidth = width > 400 ? Math.round(width * 0.85) : 375;
const guidelineBaseHeight = height > 800 ? Math.round(height * 0.85) : 667;

const screenSize = Math.sqrt(width * height) / 100;

const scale = size => Math.round((width / guidelineBaseWidth) * size);
const verticalScale = size => Math.round((height / guidelineBaseHeight) * size);
const moderateScale = (size, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor);

const BaseWidth = width > 400 ? Math.round(width * 0.95) : 375;
const rem = px => Math.floor((px / BaseWidth) * width);

export {scale, verticalScale, moderateScale, screenSize, rem};
