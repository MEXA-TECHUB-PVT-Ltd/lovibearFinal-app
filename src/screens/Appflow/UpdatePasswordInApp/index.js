import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import STYLES from '../../STYLES';
import {appColor, appImages} from '../../../assets/utilities';
import {SvgXml} from 'react-native-svg';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import EyeIcon from 'react-native-vector-icons/Ionicons';
import MyHeart from '../../../components/MyHeart';
import {useFocusEffect} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {MyButton, MyButtonLoader} from '../../../components/MyButton';
import {fontFamily} from '../../../constants/fonts';
import {Base_URL} from '../../../Base_URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

const UpdatePasswordInApp = ({route, navigation}) => {
  const [myfocus, setMyfocus] = useState('');
  const [securepassword, setSecurepassword] = useState(true);
  const [secureoldpassword, setSecureOldPassword] = useState(true);
  const passwordinputref = useRef();
  const emailinputref = useRef();
  const secondref = useRef();
  const [softinput, setSoftinput] = useState(false);
  const [secureconfirmpassword, setSecureconfirmpassword] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [oldpassword, setOldPassword] = useState('');
  const [checkpassword, setCheckpassword] = useState(false);
  const [checkconfirmpassword, setCheckConfirmpassword] = useState(false);
  const [checkoldpassword, setCheckOldPassword] = useState(false);
  const [passworderror, setPassworderror] = useState('');
  const [confirmpassworderror, setConfirmPassworderror] = useState('');
  const [oldpassworderror, setOldPasswordError] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setSoftinput(true);
      GetUser();
    }, []),
  );

  const GetUser = async () => {
    const userid = await AsyncStorage.getItem('userid');
    var axios = require('axios');
    var config = {
      method: 'get',
      url: Base_URL + '/user/specificUser/' + userid,
      headers: {},
    };
    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setEmail(response.data[0].email);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const Validations = async () => {
    console.log('HERE ON VALIDATIONS');
    const currentpassword = await AsyncStorage.getItem('password');
    if (currentpassword != oldpassword) {
      setCheckOldPassword(true);
      setOldPasswordError('Current Password Is Incorrect');
      return false;
    }
    if (password == '') {
      setCheckpassword(true);
      setPassworderror('Enter Valid Password');
      return false;
    }
    if (password != confirmpassword) {
      setCheckConfirmpassword(true);
      setConfirmPassworderror("Password Doesn't Match");
      return false;
    }
    if (
      checkpassword == false &&
      checkconfirmpassword == false &&
      checkoldpassword == false
    ) {
      console.log('HERE ON API');

      UpdatePasswordApi();
    }
  };

  const UpdatePasswordApi = async () => {
    setLoading(true);

    const userid = await AsyncStorage.getItem('userid');
    var axios = require('axios');
    var data = JSON.stringify({
      email: email,
      newPassword: password,
      userId: userid,
    });
    var config = {
      method: 'put',
      url: Base_URL + '/user/updateUserPassword',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    axios(config)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
        if (response.data.success == true) {
          await AsyncStorage.setItem('password', password);
          Toast.show('Password Updated', Toast.SHORT);
          setLoading(false);
          navigation.goBack();
        }
      })
      .catch(function (error) {
        setLoading(false);

        console.log(error);
      });
  };
  return (
    <SafeAreaView style={STYLES.container}>
      <StatusBar
        hidden={false}
        backgroundColor={appColor.appColorMain}
        barStyle={'light-content'}
      />
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
        <View>
          <View
            style={{
              height: responsiveHeight(22),
              overflow: 'hidden',
              justifyContent: 'flex-end',

              // alignSelf: 'center',
            }}>
            <Image
              source={appImages.first}
              style={{
                transform: [{rotate: '2deg'}],

                width: responsiveWidth(110),
                height: responsiveHeight(70),

                resizeMode: 'stretch',
                alignSelf: 'center',

                //   backgroundColor: 'red',
                //   top: responsiveHeight(-50),
              }}
            />
          </View>
          <Text style={styles.maintxt}>Update Password</Text>
          <Text
            style={{
              marginTop: responsiveHeight(3),
              width: responsiveWidth(85),
              alignSelf: 'center',
              alignItems: 'center',
              color: '#8D8D8D',
              fontSize: responsiveFontSize(1.8),

              textAlign: 'center',
              
              lineHeight: responsiveHeight(3),
              marginBottom: responsiveHeight(2),
            }}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy
          </Text>

          <View
            style={[
              styles.passwordparent,
              {
                borderColor:
                  myfocus == 'oldpassword' ? appColor.appColorMain : '#D7D7D7',
              },
            ]}>
            <Image
              source={appImages.password}
              resizeMode="contain"
              style={{
                width: responsiveWidth(7),
                height: responsiveWidth(7),
                // backgroundColor: 'red',
                marginLeft: responsiveWidth(5),
              }}
            />
            <TextInput
              showSoftInputOnFocus={softinput}
              value={oldpassword}
              onChangeText={text => {
                setOldPassword(text);
                setCheckOldPassword(false);
              }}
              autoFocus
              placeholder="Current Password"
              selectionColor={appColor.appColorMain}
              style={styles.txtinputpassword}
              onFocus={() => setMyfocus('oldpassword')}
              onBlur={() => setMyfocus('')}
              secureTextEntry={secureoldpassword}
              onSubmitEditing={() => secondref.current.focus()}
              blurOnSubmit={false}
              returnKeyType="next"
            />
            <EyeIcon
              style={{fontSize: responsiveFontSize(3.7), color: 'lightgray'}}
              name={secureoldpassword ? 'eye-off' : 'eye'}
              onPress={() => setSecureOldPassword(!secureoldpassword)}
            />
          </View>
          {checkoldpassword ? (
            <Text style={styles.errortxt}>{oldpassworderror}</Text>
          ) : null}

          <View
            style={[
              styles.passwordparent,
              {
                borderColor:
                  myfocus == 'password' ? appColor.appColorMain : '#D7D7D7',
              },
            ]}>
            <Image
              source={appImages.password}
              resizeMode="contain"
              style={{
                width: responsiveWidth(7),
                height: responsiveWidth(7),
                // backgroundColor: 'red',
                marginLeft: responsiveWidth(5),
              }}
            />
            <TextInput
              value={password}
              onChangeText={text => {
                setPassword(text);
                setCheckpassword(false);
              }}
              placeholder="New Password"
              selectionColor={appColor.appColorMain}
              style={styles.txtinputpassword}
              onFocus={() => setMyfocus('password')}
              onBlur={() => setMyfocus('')}
              secureTextEntry={securepassword}
              onSubmitEditing={() => passwordinputref.current.focus()}
              blurOnSubmit={false}
              returnKeyType="next"
              ref={secondref}
            />
            <EyeIcon
              style={{fontSize: responsiveFontSize(3.7), color: 'lightgray'}}
              name={securepassword ? 'eye-off' : 'eye'}
              onPress={() => setSecurepassword(!securepassword)}
            />
          </View>
          {checkpassword ? (
            <Text style={styles.errortxt}>{passworderror}</Text>
          ) : null}
          <View
            style={[
              styles.passwordparent,
              {
                borderColor:
                  myfocus == 'passwordconfirm'
                    ? appColor.appColorMain
                    : '#D7D7D7',
              },
            ]}>
            <Image
              source={appImages.password}
              resizeMode="contain"
              style={{
                width: responsiveWidth(7),
                height: responsiveWidth(7),
                // backgroundColor: 'red',
                marginLeft: responsiveWidth(5),
              }}
            />
            <TextInput
              onChangeText={text => {
                setConfirmPassword(text);
                setCheckConfirmpassword(false);
              }}
              value={confirmpassword}
              placeholder="Confirm Password"
              selectionColor={appColor.appColorMain}
              style={styles.txtinputpassword}
              onFocus={() => setMyfocus('passwordconfirm')}
              onBlur={() => setMyfocus('')}
              secureTextEntry={secureconfirmpassword}
              ref={passwordinputref}
            />
            <EyeIcon
              style={{fontSize: responsiveFontSize(3.7), color: 'lightgray'}}
              name={secureconfirmpassword ? 'eye-off' : 'eye'}
              onPress={() => setSecureconfirmpassword(!secureconfirmpassword)}
            />
          </View>
          {checkconfirmpassword ? (
            <Text style={styles.errortxt}>{confirmpassworderror}</Text>
          ) : null}
        </View>

        <View
          style={{
            position: 'absolute',
            //   top: responsiveHeight(1),
            alignSelf: 'center',
            height: responsiveHeight(17),
            alignItems: 'center',
            // backgroundColor: 'blue',
            justifyContent: 'center',
            width: responsiveWidth(100),
          }}>
          <Text style={styles.headertxt}>LoviBear</Text>
        </View>
        <View
          style={{
            height: responsiveHeight(28),
            overflow: 'hidden',
            marginTop: responsiveHeight(14),
            // justifyContent: 'flex-end',
            // alignSelf: 'flex-end',
          }}>
          <Image
            source={appImages.second}
            style={{
              width: responsiveWidth(107),
              height: responsiveHeight(85),
              resizeMode: 'stretch',
              //   backgroundColor: 'red',
              //   top: responsiveHeight(-50),
            }}
          />
        </View>
        <View
          style={{
            height: responsiveHeight(20),
            position: 'absolute',

            width: responsiveWidth(100),
            bottom: responsiveWidth(0.001),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {loading ? (
            <MyButtonLoader
              title={'Update'}
              buttonColor={appColor.appColorMain}
            />
          ) : (
            <MyButton
              title={'Update'}
              onPress={() => {
                Validations();
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdatePasswordInApp;

const styles = StyleSheet.create({
  txt4: {
    textAlign: 'center',
    color: '#fff',
    
    fontSize: responsiveFontSize(1.75),
  },
  headertxt: {
    fontSize: responsiveFontSize(4.5),
    color: '#fff',
    
  },
  maintxt: {
    color: appColor.appColorMain,
    fontSize: responsiveFontSize(3.2),
    alignSelf: 'center',
    
    marginTop: responsiveHeight(-0.8),
  },
  emailparent: {
    borderRadius: responsiveWidth(3),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#D7D7D7',
    marginTop: responsiveHeight(3),
    paddingVertical: responsiveHeight(0.9),
    width: responsiveWidth(85),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordparent: {
    borderRadius: responsiveWidth(3),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#D7D7D7',
    marginTop: responsiveHeight(2),
    paddingVertical: responsiveHeight(0.9),
    flexDirection: 'row',
    alignItems: 'center',
    width: responsiveWidth(85),
    alignSelf: 'center',
  },
  txtinputemail: {
    width: responsiveWidth(70),
    paddingLeft: responsiveWidth(3),
    color: '#080808',
    
    fontSize: responsiveFontSize(2),
  },
  txtinputpassword: {
    width: responsiveWidth(59.5),
    paddingLeft: responsiveWidth(3),
    color: '#080808',
    
    fontSize: responsiveFontSize(2),
  },
  errortxt: {
    width: responsiveWidth(83),
    alignSelf: 'center',
    color: 'red',
    
    fontSize: responsiveFontSize(2),
    marginTop: responsiveHeight(1),
  },
});
