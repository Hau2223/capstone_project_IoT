import {Modal,TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const CustomAlert = ({ visible, onClose }) => {
    return (
      <Modal transparent={true} visible={visible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>CẢNH BÁO</Text>
            <View style={styles.textAlert}>
              <View style={styles.frameTxt1}>
                <View style={styles.txt1}>
                  <Text style={styles.message1}>Đây là nội dung thông báo tùy chỉnh!</Text>
                </View>
                <View style={styles.txt2}>
                  <Text style={styles.message2}>30 phút</Text>
                </View>
                
              </View>
              <View style={styles.frameTxt1}>
                <View style={styles.txt1}>
                  <Text style={styles.message1}>Đây là nội dung thông báo tùy chỉnh!</Text>
                </View>
                <View style={styles.txt2}>
                  <Text style={styles.message2}>30 phút</Text>
                </View>
                
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

const styles = StyleSheet.create({
  iconContainer: {
    padding: 10,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: "90%",
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#DC5050',
  },
  
  button: {
    backgroundColor: '#10BE67',
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 5,
    marginBottom:20
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',

  },

  textAlert:{
    flexDirection:"column",
    width:'100%',
    marginBottom:20
  },
  frameTxt1:{
    width:'100%',
    flexDirection:'row',
    marginBottom:20
  },
  txt1:{
    width:'70%',
    justifyContent:'center',
    paddingTop:10,
    paddingBottom:10,
  },
  message1: {
    fontSize: 20,
    textAlign: 'left',
    fontWeight:'bold',
    marginLeft:5
  },
  txt2:{
    width:'30%',
    justifyContent:'center',
  },
  message2: {
    fontSize: 20,
    textAlign: 'right',
    fontWeight:'400',
    marginRight:5
  },
});

export default CustomAlert;