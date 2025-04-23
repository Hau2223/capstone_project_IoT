import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable'; // ✅ import
import colors from '../../assets/common/colorCss';

const AlertModelCompo = ({
  isVisible,
  type,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const {t} = useTranslation();

  const getConfig = () => {
    switch (type) {
      case t('alert_success'):
        return {
          icon: 'checkmark-circle',
          color: '#4CAF50',
          defaultTitle: 'Success',
        };
      case t('alert_warning'):
        return {
          icon: 'alert-circle',
          color: '#FF9800',
          defaultTitle: 'Warning',
        };
      case t('alert_error'):
        return {icon: 'close-circle', color: '#F44336', defaultTitle: 'Error'};
      case t('alert_loading'):
        return {icon: 'reload', color: '#007BFF', defaultTitle: 'Loading...'};
      default:
        return {
          icon: 'information-circle',
          color: '#2196F3',
          defaultTitle: 'Notice',
        };
    }
  };

  const {icon, color, defaultTitle} = getConfig();
  const alertTitle = title || defaultTitle;

  return (
    <Modal
      visible={isVisible}
      animationType="none"
      transparent={true}
      statusBarTranslucent={true}
      >
      <View style={styles.backdrop}>
        <Animatable.View
          animation={isVisible ? 'fadeIn' : 'fadeOut'}
          duration={300}
          style={[styles.modalContainer, {borderLeftColor: color}]}>
          {type === t('alert_loading') ? (
            <>
              <ActivityIndicator size="large" color={color} />
              <Text style={styles.title}>{alertTitle}</Text>
            </>
          ) : (
            <>
              <Icon name={icon} size={40} color={color} />
              <Text style={styles.title}>{alertTitle}</Text>
              <Text style={styles.message}>{message}</Text>
            </>
          )}

          {type === t('alert_warning') && (
            <TouchableOpacity
              style={[styles.button, {backgroundColor: color}]}
              onPress={onConfirm}>
              <Text style={styles.buttonText}>Ok</Text>
            </TouchableOpacity>
          )}
          {type === t('alert_success') && (
            <TouchableOpacity
              style={[styles.button, {backgroundColor: color}]}
              onPress={onConfirm}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          )}
          {type === t('alert_error') && (
            <TouchableOpacity
              style={[styles.button, {backgroundColor: color}]}
              onPress={onConfirm}>
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
          )}
        </Animatable.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  message: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AlertModelCompo;
