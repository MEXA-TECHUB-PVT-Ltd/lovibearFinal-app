/** @format */

import App from './Appflow';
import AuthApp from './Authflow';
import {EventRegister} from 'react-native-event-listeners';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import themeContext from '../assets/config/themeContext';
import theme from '../assets/config/theme';
import {Provider} from 'react-redux';
import {Store} from '../redux/store';
import React, {useState, useEffect} from 'react';
// import { initializeApp } from 'firebase/app';

import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import {useRef} from 'react';

const AppStack = createStackNavigator();
const AppNavigation = props => {
  const myref = useRef();
  // console.log('MY REF=============', myref);
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    myref.current.navigate('NotificationsScreens');
  });
  // const [mode,setMode] = useState(false)
  useEffect(()=>{
  //   const RNfirebaseConfig = {
  //     apiKey: "AIzaSyAiiSd8CR8d2RZ-EFtp-uQC0OxLeWVQUxg",
  //     // authDomain: "pixakohr-510a2.firebaseapp.com",
  //     projectId: "lovibearapp-4a3e6",
  //     storageBucket: "lovibearapp-4a3e6.appspot.com",
  //     messagingSenderId: ".....",
  //     appId: "1:20960902863:ios:d71a718f57c3d0eb2a41ba"
  // };
  // const app = initializeApp(RNfirebaseConfig);

  })
  return (
    <Provider store={Store}>
      <NavigationContainer ref={myref}>
        <AppStack.Navigator screenOptions={{headerShown: false}}>
          <AppStack.Screen name={'Auth'} component={AuthApp} />
          <AppStack.Screen name={'App'} component={App} />
        </AppStack.Navigator>
      </NavigationContainer>
    </Provider>

    // <themeContext.Provider
    // value={mode === true ? theme.dark : theme.light}>

    // </themeContext.Provider>
  );
};

export default AppNavigation;
