import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, {memo, useContext} from 'react';
import {ThemeContext} from '../../../../assets/common/themeProvider';
import {createStyle} from './style';
import {useTranslation} from 'react-i18next';


const ItemSchedule = ({
  onPress,
  imageSource,
  tenKhu,
  trangThaiTuoi,
  schedules,
  hasSchedules,
}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.img}>
        <Image style={styles.imgStyle} source={imageSource} />
      </View>
      <View style={styles.content}>
        <Text style={styles.header2}>{tenKhu}</Text>
        <View style={styles.FrameShowSchedule}>
          {hasSchedules ? (
            <>
              {schedules &&
                schedules
                  .slice(0, 2)
                  .map(item => (
                    <BtnShowSchedule
                      key={item._id}
                      textBtnSchedule={`${item.startTime}/${item.duration} ${t('minute')}`}
                    />
                  ))}
              {schedules && schedules.length > 2 && (
                <Text style={styles.moreText}>...</Text>
              )}
            </>
          ) : (
            <Text style={styles.noScheduleText}>{t('no_schedule_yet')}</Text>
          )}
        </View>
        <Text style={styles.textStyle}>{trangThaiTuoi}</Text>
      </View>
    </TouchableOpacity>
  );
};

const BtnShowSchedule = ({textBtnSchedule}) => {
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  return (
    <View style={styles.btn}>
      <Text style={styles.textBtn}>{textBtnSchedule}</Text>
    </View>
  );
};

export default memo(ItemSchedule);


