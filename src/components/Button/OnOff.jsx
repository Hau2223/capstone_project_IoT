  import { StyleSheet, View, TouchableOpacity } from 'react-native';
  import React, { useState,useEffect } from 'react';

  const OnOffBtn = ({ isOnInitial }) => {
    const [isOn, setIsOn] = useState(false);

    // useEffect(() => {
    //   setIsOn(isOnInitial);
    // }, [isOnInitial]);

    return (
      <TouchableOpacity
        onPress={() => setIsOn(!isOn)}
        style={[
          styles.toggle,
          isOn ? styles.toggleOn : styles.toggleOff
        ]}
      >
        <View style={[
          styles.circle,
          isOn ? styles.circleOn : styles.circleOff
        ]} />
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    toggle: {
      width: 60,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      padding: 1,
      borderWidth: 1,
      borderColor: '#939393',
    },
    toggleOn: { backgroundColor: 'white' },
    toggleOff: { backgroundColor: 'white' },
    circle: {
      width: 26,
      height: 26,
      borderRadius: 13,
    },
    circleOn: { alignSelf: 'flex-end', backgroundColor: '#63A776' },
    circleOff: { alignSelf: 'flex-start', backgroundColor: '#ACACAC' },
  });

  export default OnOffBtn;
