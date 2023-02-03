import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Base_URL} from '../../../Base_URL';
import Geolocation from 'react-native-geolocation-service';
import {useFocusEffect} from '@react-navigation/native';

const CheckUserImage = props => {
  useFocusEffect(
    React.useCallback(() => {
      // getLocation();
      GetUser();
    }, []),
  );

  const getLocation = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
    await Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        // setMylat(position.coords.latitude);
        // setMylong(position.coords.longitude);

        GetUser(position.coords.latitude, position.coords.longitude);
      },
      error => {
        console.log(error.code, error.message);
        Alert.alert('Enable Location', 'Your location is required to proceed', [
          {
            text: 'OK',
            onPress: () => {
              getLocation();
            },
          },
        ]);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const GetUser = async (mylat, mylong) => {
    const userid = await AsyncStorage.getItem('userid');
    const profileimage = await AsyncStorage.getItem('profileimage');
    console.log('PROFILE IMAGE==========', profileimage);
    if (profileimage == null) {
      props.navigation.navigate('AddProfileImage', {
        screenFrom: 'checking',
        userid: userid,
        mylat: mylat,
        mylong: mylong,
      });
    } else {
      props.navigation.navigate('App', {
        screen: 'PlayScreenScreens',
      });
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      {/* <Text>CheckUserImage</Text> */}
    </SafeAreaView>
  );
};

export default CheckUserImage;

const styles = StyleSheet.create({});
