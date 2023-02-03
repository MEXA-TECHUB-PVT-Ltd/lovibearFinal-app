import {
  Splash,
  Splash2,
  Login,
  ForgotPassword,
  EnterCode,
  UpdatePassword,
  SignUp,
  AddProfileImage,
  Subscribe,
  Splash0,
  CheckUserImage,
  LoginWithPhone,
  SignUpWithPhone,
} from '../../screens';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';


const AuthStack = createStackNavigator();
const AuthApp = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'Splash0'}>
      <AuthStack.Screen name={'Splash0'} component={Splash0} />
      <AuthStack.Screen name={'Splash'} component={Splash} />
      <AuthStack.Screen name={'Splash2'} component={Splash2} />
      <AuthStack.Screen name={'Login'} component={Login} />
      <AuthStack.Screen name={'ForgotPassword'} component={ForgotPassword} />
      <AuthStack.Screen name={'EnterCode'} component={EnterCode} />
      <AuthStack.Screen name={'UpdatePassword'} component={UpdatePassword} />
      <AuthStack.Screen name={'SignUp'} component={SignUp} />
      <AuthStack.Screen name={'AddProfileImage'} component={AddProfileImage} />
      <AuthStack.Screen name={'Subscribe'} component={Subscribe} />
      <AuthStack.Screen name={'CheckUserImage'} component={CheckUserImage} />
      <AuthStack.Screen name={'LoginWithPhone'} component={LoginWithPhone} />
      <AuthStack.Screen name={'SignUpWithPhone'} component={SignUpWithPhone} />
    </AuthStack.Navigator>
  );
};

export default AuthApp;
