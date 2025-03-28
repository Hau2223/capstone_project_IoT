import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';

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
      case 'success':
        return {
          icon: 'checkmark-circle',
          color: '#4CAF50',
          defaultTitle: 'Success',
        };
      case 'warning':
        return {
          icon: 'alert-circle',
          color: '#FF9800',
          defaultTitle: 'Warning',
        };
      case 'error':
        return {icon: 'close-circle', color: '#F44336', defaultTitle: 'Error'};
      case 'loading':
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
  const alertTitle = title || defaultTitle; // Nếu không có title thì dùng mặc định

  return (
    <Modal isVisible={isVisible} animationIn="fadeIn" animationOut="fadeOut">
      <View style={[styles.modalContainer, {borderLeftColor: color}]}>
        {type === 'loading' ? (
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

        {/* Nút bấm theo từng loại thông báo */}
        {type === 'warning' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: color}]}
              onPress={onConfirm}>
              <Text style={styles.buttonText}>Ok</Text>
            </TouchableOpacity>
          </View>
        )}

        {type === 'success' && (
          <TouchableOpacity
            style={[styles.button, {backgroundColor: color}]}
            onPress={onConfirm}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        )}

        {type === 'error' && (
          <TouchableOpacity
            style={[styles.button, {backgroundColor: color}]}
            onPress={onConfirm}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
