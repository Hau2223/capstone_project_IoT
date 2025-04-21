import {StyleSheet, Text, View, FlatList, ScrollView, Animated} from 'react-native';
import React, {memo, useState, useEffect, useCallback, useRef} from 'react';
// import OnOffBtn from '../../components/Button/OnOff';
import {Switch} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import colors from '../../../assets/common/colorCss';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {memberId} from '../../../services/menberServices';
import {gardenId} from '../../../services/authServices';

const DetailScreen = ({route}) => {
  const {item} = route.params;
  const {deviceId} = route.params;
  const [isWatering, setIsWatering] = useState(false);
  const [isFan, setIsFan] = useState(false);
  const [member, setMember] = useState(null);
  const scrollY = useRef(new Animated.Value(1)).current;

  const sensors = item?.data?.sensors || [];
  const controls = item?.data?.controls || [];

  // console.log("sensor", sensors);
  // console.log("controls",controls);

  const sensorMap = Object.fromEntries(sensors.map(s => [s.type, s]));
  const controlMap = Object.fromEntries(controls.map(c => [c.name, c]));
  // const memberMap = Object.fromEntries(members.map(m => [m.userId, m]));

  const {
    temperature: temperatureSensor,
    humidity: humiditySensor,
    luminosity: luminositySensor,
    moisture: moistureSensor,
    stream: streamSensor,
  } = sensorMap;

  console.log("sensorMap", sensorMap);

  const {
    water: waterControl,
    light: lightControl,
    wind: windControl,
  } = controlMap;

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const data = await gardenId();
      const ids = data?.data || [];
    
      if (!ids.includes(deviceId)) {
        setError(`Device ID "${deviceId}" không hợp lệ hoặc không tồn tại trong danh sách`);
        setLoading(false);
        return;
      }
  
      const res = await memberId({ id: deviceId });
      console.log('Member response:', res);
      if (res?.members) {
        setUserInfo(res.members);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Error fetching user data');
    } finally {
      setLoading(false);
    }
  }, [deviceId]);
  
  

  useEffect(() => {
    console.log('Current deviceId:', deviceId);
    fetchUserProfile();
    const interval = setInterval(() => {
      fetchUserProfile();
    }, 5000);
  
    return () => clearInterval(interval);
  }, [deviceId]);  // Lắng nghe sự thay đổi của deviceId



  const names = userInfo?.flat()?.map(member => member.name).join(', ');
  const roles = userInfo?.flat()?.map(member => member.role).join(', ');
  

  // useEffect(() => {
  //   const fetchMemberNames = async () => {
  //     try {
  //       const userIds = members.map(m => m.userId.$oid || m.userId); // Lấy danh sách userId

  //       const dataMember = await Promise.all(
  //         userIds.map(async id => {
  //           // const res = await memberId({ id.$oid: id });
  //           console.log(id.userId);

  //           return res.data.members; // Trả về user info
  //         })
  //       );
  //       setMember(dataMember); // Lưu mảng user info
  //     } catch (err) {
  //       console.error('Error fetching member info:', err);
  //     }
  //   };

  //   fetchMemberNames();
  // }, [members]);

  // member.map((item) => {
  //   console.log("item", item);
  // }
  // );

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [350, 200],
    extrapolate: 'clamp',
  });

  const imageHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [263, 150],
    extrapolate: 'clamp',
  });

  const headerFontSize = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [32, 24],
    extrapolate: 'clamp',
  });

  const headerMarginTop = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [10, 5],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.frame}>
      <Animated.View style={[styles.container1, { height: headerHeight }]}>
        <Animated.View style={[styles.img, { height: imageHeight }]}>
          <FastImage
            style={styles.imgStyle}
            source={{
              uri: item.data.img_area,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </Animated.View>
        <Animated.Text 
          style={[
            styles.header2, 
            { 
              fontSize: headerFontSize,
              marginTop: headerMarginTop
            }
          ]}>
          {item?.data?.name_area}
        </Animated.Text>
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.ScrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={8}
        bounces={false}>
        <FrameItem1
          txtTemp={temperatureSensor?.value ?? 0}
          txtMoisture={moistureSensor?.value ?? 0}
          txtHumidity={humiditySensor?.value ?? 0}
          txtStream={streamSensor?.value ?? 0}
          txtLuminosity={luminositySensor?.value ?? 0}
          style={styles.containerFrame}></FrameItem1>
        <FrameItem2
          style={styles.containerFrame}
          valueStatus={lightControl?.status}></FrameItem2>
        <FrameItem3 header3={'THÀNH VIÊN'} users={userInfo || []} />
      </Animated.ScrollView>
    </View>
  );
};

const Header3 = ({header3}) => {
  return (
    <View>
      <Text style={styles.textHeader3}>{header3}</Text>
    </View>
  );
};

const FrameItem1 = ({
  txtMoisture,
  txtTemp,
  txtHumidity,
  txtStream,
  txtLuminosity,
}) => {
  return (
    <View style={styles.containerFrame}>
      <Header3 header3={'CẢM BIẾN'} />
      <SensorComponent
        nameIcon={'water-percent'}
        colorIcon={'#2196F3'}
        txtSensor={'Độ ẩm đất'}
        txtNumb={txtMoisture + '%'}></SensorComponent>
      <SensorComponent
        nameIcon={'temperature-celsius'}
        colorIcon={'#FF8A65'}
        txtSensor={'Nhiệt độ'}
        txtNumb={txtTemp + '°C'}></SensorComponent>
      <SensorComponent
        nameIcon={'weather-partly-cloudy'}
        colorIcon={'#4FC3F7'}
        txtSensor={'Độ ẩm không khí'}
        txtNumb={txtHumidity + '%'}></SensorComponent>
      <SensorComponent
        nameIcon={'water-pump'}
        colorIcon={'#00BCD4'}
        txtSensor={'Lưu lượng nước'}
        txtNumb={txtStream + '%'}></SensorComponent>
      <SensorComponent
        nameIcon={'white-balance-sunny'}
        colorIcon={'#FFD54F'}
        txtSensor={'Cường độ ánh sáng'}
        txtNumb={txtLuminosity + '%'}></SensorComponent>
    </View>
  );
};

const SensorComponent = ({nameIcon, colorIcon, txtSensor, txtNumb}) => {
  return (
    <View style={styles.contentFrame}>
      <View style={styles.iconContent}>
        <Icon name={nameIcon} size={50} color={colorIcon} />
      </View>
      <View style={styles.textContent}>
        <Text style={styles.textStyle}>{txtSensor}</Text>
      </View>
      <View style={styles.valueContent}>
        <Text style={styles.textStyle}>{txtNumb}</Text>
      </View>
    </View>
  );
};

const FrameItem2 = ({valueStatus}) => {
  return (
    <View style={styles.containerFrame}>
      <Header3 header3={'ĐIỀU KHIỂN'} />
      <StatusComponent
        nameIcon={'water'}
        colorIcon={'#03A9F4'}
        txtStatus="Nước"
        valueStatus={valueStatus}></StatusComponent>
      <StatusComponent
        nameIcon={'lightbulb-on-outline'}
        colorIcon={'#FFEB3B'}
        txtStatus="Nước"
        valueStatus={valueStatus}></StatusComponent>
      <StatusComponent
        nameIcon={'weather-windy'}
        colorIcon={'#90A4AE'}
        txtStatus="Gió"
        valueStatus={valueStatus}></StatusComponent>
    </View>
  );
};

const StatusComponent = ({nameIcon, colorIcon, txtStatus, valueStatus}) => {
  return (
    <View style={styles.contentFrame}>
      <View style={styles.iconContent}>
        <Icon name={nameIcon} size={50} color={colorIcon} />
      </View>
      <View style={styles.textContent}>
        <Text style={styles.textStyle}>{txtStatus}</Text>
      </View>
      <View style={styles.valueContent}>
        <Switch
          value={valueStatus}
          onValueChange={newValue => setIsFan(newValue)}
          trackColor={{false: '#F6F6F6', true: 'white'}}
          thumbColor={valueStatus ? colors.primary : '#ACACAC'}
          style={{transform: [{scale: 1.5}]}}
        />
      </View>
    </View>
  );
};

const FrameItem3 = ({ header3, users = [] }) => {
  console.log('Rendering users:', users);
  return (
    <View style={styles.containerFrame}>
      <Header3 header3={header3} />
      {users && users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <UserComponent
              nameIcon={'account-circle'}
              colorIcon={'#D9D9D9'}
              txtUser={item.name || 'Chưa có tên'}
              txtRole={item.role || 'Chưa có vai trò'}
            />
          )}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.noMembersText}>Không có thành viên nào</Text>
      )}
    </View>
  );
};

const UserComponent = ({nameIcon, colorIcon, txtUser, txtRole}) => {
  return (
    <View style={styles.UserFrame}>
      <View style={styles.iconContent}>
        <Icon name={nameIcon} size={50} color={colorIcon} />
      </View>
      <View style={styles.textUser}>
        <Text style={styles.textStyle}>{txtUser}</Text>
      </View>
      <View style={styles.textRole}>
        <Text style={styles.textStyle}>{txtRole}</Text>
      </View>
    </View>
  );
};

export default memo(DetailScreen);

const styles = StyleSheet.create({
  frame: {
    height: '100%',
    width: '100%',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  container1: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  img: {
    width: '95%',
    borderRadius: 5,
    marginTop: 10,
    overflow: 'hidden',
  },
  ScrollView: {
    height: 'auto',
    width: '95%',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginTop: 10,
  },
  content: {},
  imgStyle: {
    width: '100%',
    height: 263,
    borderRadius: 5,
  },
  header2: {
    color: '#206477',
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
    position: 'absolute',
    bottom: 20,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  content1: {
    height: 'auto',
    width: '100%',
    padding: 10,
    paddingLeft: 15,
  },
  content2: {
    height: 'auto',
    width: '100%',
    marginTop: 10,
  },
  frameTuoiQuat: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 15,
    marginTop: 5,
  },
  contentTuoiQuat: {
    height: '100%',
    width: '70%',
    justifyContent: 'center',
  },
  buttonTuoiQuat: {
    height: '100%',
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },

  textStyle: {
    color: '#636363',
    fontSize: 25,
    marginTop: 5,
    marginBottom: 5,
  },
  line: {
    height: 2,
    backgroundColor: '#000000',
    marginVertical: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  settingOnOff: {
    flexDirection: 'row',
    width: '100%',
    height: 'auto',
    alignItems: 'center',
  },
  frameIconLight: {
    height: 25,
    width: 25,
  },
  iconLight: {
    height: 25,
    width: 'auto',
  },
  txtLightLevel: {
    color: '#636363',
    fontSize: 18,
    marginLeft: 7,
    // color: '#5787E5',
    textDecorationLine: 'underline',
  },
  containerFrame: {
    height: 'auto',
    width: '100%',
    marginVertical: 15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#E8E8E8',
    paddingHorizontal: 15,
    paddingVertical: 50,
    backgroundColor: 'white',
    
  },
  textHeader3: {
    textAlign: 'center',
    color: '#217E54',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  contentFrame: {
    height: 'auto',
    width: '100%',
    flexDirection: 'row',
    marginVertical: 5,
  },
  UserFrame: {
    height: 'auto',
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingVertical: 20,
  },
  iconContent: {
    width: '15%',
    justifyContent: 'center',
  },
  textContent: {
    width: '65%',
    justifyContent: 'center',
    paddingLeft: 15,
  },
  valueContent: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  textUser: {
    width: '55%',
    justifyContent: 'center',
    paddingLeft: 15,
  },
  textRole: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  noMembersText: {
    textAlign: 'center',
    color: '#636363',
    fontSize: 20,
    marginTop: 20,
  },
});
