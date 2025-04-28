import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {memo, useContext} from 'react';
import colors from '../../../../assets/common/colorCss';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../../assets/common/themeProvider';
import {createStyle} from '../style';

const ItemHomePage = ({
  name_area,
  temperature,
  moisture,
  water,
  wind,
  img_area,
  onPress,
}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Image
        style={styles.imgStyle}
        source={{
          uri: img_area,
        }}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.headerCompo} numberOfLines={1}>
          {name_area}
        </Text>
        <View style={styles.txtGroup}>
          <Text style={styles.textStyle}>{t('temperature_label')}</Text>
          <Text style={styles.textStyle}>
            {temperature === 2147483647 ? temperature : '0.0'}°C
          </Text>
        </View>
        <View style={styles.txtGroup}>
          <Text style={styles.textStyle}>{t('moisture_label')}</Text>
          <Text style={styles.textStyle}>
            {moisture === 2147483647 ? moisture : '0.0'}%
          </Text>
        </View>
        <View style={styles.txtGroup}>
          <Text style={styles.textStyle}>{t('watering_status_label')} </Text>
          <Text style={styles.textStyle}>{water}</Text>
        </View>
        <View style={styles.txtGroup}>
          <Text style={styles.textStyle}>{t('fan_label')}</Text>
          <Text style={styles.textStyle}>{wind}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ItemHomePage);
