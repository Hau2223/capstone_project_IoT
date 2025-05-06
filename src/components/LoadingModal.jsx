import React, {memo} from 'react';
import {Modal, View, ActivityIndicator, Text, StyleSheet} from 'react-native';
import colors from '../../assets/common/colorCss';
import {Chase  } from 'react-native-animated-spinkit'

const LoadingModal = ({isLoading}) => {
  return (
    <Modal
      visible={isLoading}
      transparent={true}
      statusBarTranslucent={true}
      animationType="fade"
      onRequestClose={() => {}}
      style={{zIndex: 1000}}>
      <View style={[styles.loadingContainer, {zIndex: 1000}]}>
      <Chase   size={80} color={colors.white}/>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    color: colors.white || '#FFFFFF', // Fallback nếu colors.white không định nghĩa
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default memo(LoadingModal);
