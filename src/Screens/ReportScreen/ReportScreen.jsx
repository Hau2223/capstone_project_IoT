import {onPress,TouchableOpacity,FlatList,Image, StyleSheet, Text, View} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { getAllDevices } from '../../../services/deviceServices';
import { profile } from '../../../services/authServices';
import Icon from 'react-native-vector-icons/Ionicons';

const ReportScreen = ({navigation}) => {
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState(null);
    const [idUser, setIdUser] = useState(null);

    useEffect(() => {
        const loadIdUser = async () => {
            try {
                const response = await profile();
                if (response?.data) {
                    setIdUser(response.data._id);
                    console.log('ID User từ API:', response.data._id);
                }
            } catch (err) {
                console.error('Lỗi khi lấy idUser:', err);
            }
        };

        loadIdUser();
    }, []);

    const fetchDevices = useCallback(async () => {
        if (!idUser) return;

        try {
            setError(null);
            const response = await getAllDevices();
            const allDevices = response?.data || [];

            console.log('Tất cả thiết bị từ API:', allDevices);

            const userDevices = allDevices.filter(device => 
                device.members?.some(member => member.userId === idUser)
            );

            console.log('Thiết bị của user:', userDevices);
            setDevices(userDevices);
        } catch (err) {
            console.error('Error details:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
            });
            setError(err.response?.data?.message || 'Lỗi khi lấy dữ liệu thiết bị');
            setDevices([]);
        }
    }, [idUser]);

    useEffect(() => {
        if (idUser) {
            fetchDevices();
            const interval = setInterval(() => {
                fetchDevices();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [idUser, fetchDevices]);

    const handleGoToDetail = (item) => {
        console.log('Device data when navigating:', item);
        navigation.navigate('ReportDetail', { deviceId: item.id_esp || item._id });
    };

    const getDeviceImage = (device) => {
        // Nếu thiết bị có hình ảnh từ API, sử dụng nó
        if (device.img_area) {
            return { uri: device.img_area };
        }
        // Nếu không có, sử dụng hình mặc định
        return require('../../../assets/img/1.png');
    };

    return (
        <View style={styles.frame}>
            <View style={styles.header}>
                <View style={styles.header1}>
                    <Text style={styles.textHeader}>Phân tích dữ liệu</Text>
                </View>
            </View>
            <View style={styles.container}>
                {error ? (
                    <Text style={styles.errorText}>Lỗi: {error}</Text>
                ) : devices.length === 0 ? (
                    <Text style={styles.emptyText}>Không có thiết bị nào</Text>
                ) : (
                    <FlatList
                        data={devices}
                        numColumns={2}
                        keyExtractor={item => item._id}
                        renderItem={({item}) => (
                            <View style={styles.itemWrapper}>
                                <ItemArea
                                    nameArea={item.name_area || 'Thiết bị không tên'}
                                    imageSource={getDeviceImage(item)}
                                    onPress={() => handleGoToDetail(item)}
                                />
                            </View>
                        )}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </View>
        </View>
    );
};

const ItemArea = ({nameArea, imageSource, onPress}) => {
    return (
        <TouchableOpacity style={styles.frameItem} onPress={onPress}>
            <Image
                style={styles.img}
                source={imageSource}
                blurRadius={1}
            />
            <View style={styles.overlay}>
                <Icon name="bar-chart-outline" size={30} color="white" style={styles.icon} />
                <Text style={styles.txtArea}>{nameArea}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ReportScreen;

const styles = StyleSheet.create({
    frame: {
        height: '100%',
        width: '100%',
        backgroundColor: '#EAEAEA',
    },
    header: {
        height: 70,
        width: '100%',
        flexDirection: 'row',
        marginTop: 20,
    },
    header1: {
        height: 70,
        width: '80%',
        justifyContent: 'center',
    },
    textHeader: {
        color: '#206477',
        fontSize: 32,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    container: {
        height: 'auto',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    frameItem: {
        height: 200,
        width: 200,
        borderRadius: 15,
        position: 'relative',
        margin: 7,
        overflow: 'hidden',
    },
    img: {
        height: '100%',
        width: '100%',
        borderRadius: 15,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    icon: {
        marginBottom: 10,
    },
    txtArea: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    itemWrapper: {
        alignItems: 'center',
        width: '50%',
    },
    listContainer: { 
        paddingHorizontal:5, 
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
});
