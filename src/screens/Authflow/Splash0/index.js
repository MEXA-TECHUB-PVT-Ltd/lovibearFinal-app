import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
} from 'react-native';
import React from 'react';
import STYLES from '../../STYLES';
import {appImages} from '../../../assets/utilities';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';
import MyHeart from '../../../components/MyHeart';

const Splash0 = ({navigation}) => {
  useEffect(() => {
    Checking();
  }, []);

  const Checking = async () => {
    const userid = await AsyncStorage.getItem('userid');
    const signuptype = await AsyncStorage.getItem('signuptype');
    const password = await AsyncStorage.getItem('password');
    console.log(
      'USER INFORMATION ON SPLASH SCREEN',
      '\n\n\n' + userid + '\n' + signuptype + '\n' + password,
    );
    if (userid !== null) {
      setTimeout(() => {
        navigation.navigate('CheckUserImage');
      }, 1500);
    } else {
      setTimeout(() => {
        navigation.navigate('Splash');
      }, 1500);
    }
  };

  return (
    <SafeAreaView
      style={[
        STYLES.container,
        {alignItems: 'center', justifyContent: 'center'},
      ]}>
      <StatusBar hidden={true} />
      <Image
        source={appImages.splashicon}
        style={{
          width: responsiveWidth(20),
          height: responsiveWidth(20),
          resizeMode: 'contain',
        }}
      />
    </SafeAreaView>
  );
};

export default Splash0;

const styles = StyleSheet.create({});
