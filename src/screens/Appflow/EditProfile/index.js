import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Right from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import STYLES from '../../STYLES';
import {appColor, appImages} from '../../../assets/utilities';
import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import ImageView from 'react-native-image-viewing';
import Dialog from 'react-native-dialog';
import Carousel from 'react-native-snap-carousel';
import {fontFamily} from '../../../constants/fonts';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';
import EyeIcon from 'react-native-vector-icons/Ionicons';
import {DateSelect} from '../../../components/dateTimePicker/dateTimePicker';
import ImagePicker from 'react-native-image-crop-picker';
import {MyButton, MyButtonLoader} from '../../../components/MyButton';
import {MyButton2} from '../../../components/MyButton2';
import {Base_URL} from '../../../Base_URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import {ActivityIndicator, Modal} from 'react-native-paper';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';
const EditProfile = props => {
  const [myfocus, setMyfocus] = useState('');
  const [securepassword, setSecurepassword] = useState(true);
  const passwordinputref = useRef();
  const emailinputref = useRef();
  const [softinput, setSoftinput] = useState(false);
  const [mydate, setMydate] = useState('');
  const [apigender, setApiGender] = useState('');
  const [secureconfirmpassword, setSecureConfirmpassword] = useState(true);
  const confirmpasswordinputref = useRef();
  const [selectedImage, setSelectedImage] = useState();
  const [isselected, setIsSelected] = useState(false);
  const [recoveryemail, setRecoveryEmail] = useState('');
  const professionref = useRef();
  const recoveryemailinputref = useRef();
  const [mysignuptype, setMySignupType] = useState('');
  useFocusEffect(
    React.useCallback(() => {
      setSoftinput(true);
    }, []),
  );

  const GetAsyncInformation = async () => {
    const signuptype = await AsyncStorage.getItem('signuptype');
    setMySignupType(signuptype);
  };

  useEffect(() => {
    GetAsyncInformation();
    getLocation();
    GetUser();
  }, []);

  const [myimage, setMyimage] = useState('');
  const imageTakeFromGallery = () => {
    ImagePicker.openPicker({
      cropping: false,
      mediaType: 'photo',
    }).then(image => {
      console.log(image.path);
      setMyimage(image.path);
      const filename = image.path.substring(image.path.lastIndexOf('/') + 1);
      // myarr = [...apiarray];
      setSelectedImage({
        name: 'profileImage',
        filename: filename,
        type: image.mime,
        data: RNFetchBlob.wrap(image.path),
      });
      setIsSelected(true);
    });
  };
  const images = [myimage == '' ? appImages.userimage : {uri: myimage}];
  const imageTakeFromCamera = () => {
    ImagePicker.openCamera({
      cropping: false,
      mediaType: 'photo',
    }).then(image => {
      console.log(image.path);
      setMyimage(image.path);
      const filename = image.path.substring(image.path.lastIndexOf('/') + 1);
      // myarr = [...apiarray];
      setSelectedImage({
        name: 'profileImage',
        filename: filename,
        type: image.mime,
        data: RNFetchBlob.wrap(image.path),
      });
      setIsSelected(true);
    });
  };

  const [visible, setVisible] = useState(false);
  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

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
        setMylat(position.coords.latitude);
        setMylong(position.coords.longitude);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        props.navigation.goBack();
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  const [imagevisible, setImagevisible] = useState(false);
  const [checkemail, setCheckemail] = useState(false);
  const [checkpassword, setCheckpassword] = useState(false);
  const [checkconfirmpassword, setCheckConfirmpassword] = useState(false);
  const [checkgender, setCheckgender] = useState(false);
  const [checkprofession, setCheckprofession] = useState(false);
  const [gendererror, setGendererror] = useState('');
  const [checkusername, setCheckusername] = useState(false);
  const [checkrecoveryemail, setCheckRecoveryEmail] = useState(false);
  const [recoveryemailerror, setrecoveryemailerror] = useState('');
  const [emailerror, setEmailerror] = useState('');
  const [passworderror, setPassworderror] = useState('');
  const [confirmpassworderror, setConfirmPassworderror] = useState('');
  const [professionerror, setProfessionerror] = useState('');
  const [usernameerror, setUsernameerror] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [profession, setProfession] = useState('');
  const [gender, setGender] = useState('');
  const [username, setUsername] = useState('');
  const [firstchar, setFirstChar] = useState('');
  const [apiformatdate, setApiFormatDate] = useState('');
  const [mylat, setMylat] = useState();
  const [mylong, setMylong] = useState();
  const [modalvisible, setModalVisible] = React.useState(false);
  const [checkdate, setCheckDate] = useState(false);
  const [dateerror, setDateError] = useState('');
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const [loading, setLoading] = useState(false);
  const [fixedemail, setFixedEmail] = useState('');
  let regchecknumber = /^[0-9]*$/;
  let reg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w\w+)+$/;
  let regphone =
    /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;

  const Validations = () => {
    if (username == '') {
      setCheckusername(true);
      setUsernameerror('Enter Username');
      return false;
    }
    if (email == '') {
      setCheckemail(true);
      setEmailerror('Enter Valid Email');
      return false;
    }
    if (regphone.test(firstchar + email) == false) {
      console.log('IN FIRST');
      if (regchecknumber.test(email)) {
        console.log(' IN NUMBER CHECK ');
        console.log(firstchar + email);
        setCheckemail(true);
        setEmailerror('Enter Valid Phone Number');
        return false;
      } else if (reg.test(email) == false) {
        setCheckemail(true);
        setEmailerror('Enter Valid Email');
        return false;
      }
    }
    if (mysignuptype == 'email' && reg.test(email) == false) {
      setCheckemail(true);
      setEmailerror('Enter Valid Email');
    }
    if (mysignuptype == 'phoneNumber' && regchecknumber.test(email) == false) {
      setCheckemail(true);
      setEmailerror('Enter Valid Phone Number');
    }
    if (gender == '') {
      setCheckgender(true);
      setGendererror('Select Gender');
      return false;
    }

    if (moment().diff(moment(mydate, 'DD-MM-YYYY'), 'years') < 18) {
      setCheckDate(true);
      setDateError('You must be 18+ to use this app');
      return false;
    }
    if (mydate == '') {
      refContainer.current.open();
      return false;
    }

    if (
      checkemail == false &&
      checkusername == false &&
      mydate !== '' &&
      moment().diff(moment(mydate, 'DD-MM-YYYY'), 'years') > 18
    ) {
      UpdateApi();
    }
  };

  const UpdateApi = async () => {
    setLoading(true);
    const userid = await AsyncStorage.getItem('userid');
    const signuptype = await AsyncStorage.getItem('signuptype');
    var formdata = new FormData();
    if (signuptype == 'email') {
      formdata.append('userName', username);
      formdata.append('gender', apigender);
      formdata.append('dateOfBirth', apiformatdate);
      formdata.append('profession', profession);
      formdata.append('email', email.toLowerCase());
      formdata.append('userEmailAddress', email.toLowerCase());
      formdata.append('userId', userid);
      formdata.append('long', mylong);
      formdata.append('lat', mylat);
    } else {
      formdata.append('userName', username);
      formdata.append('gender', apigender);
      formdata.append('dateOfBirth', apiformatdate);
      formdata.append('profession', profession);
      formdata.append('phoneNumber', '+' + email);
      formdata.append('userEmailAddress', recoveryemail);
      formdata.append('userId', userid);
      formdata.append('long', mylong);
      formdata.append('lat', mylat);
    }

    var requestOptions = {
      method: 'PUT',
      body: formdata,
      redirect: 'follow',
    };

    fetch(Base_URL + '/user/updateUserProfile', requestOptions)
      .then(response => response.json())
      .then(async result => {
        console.log(result);
        if (isselected == true) {
          UpdateImage();
        } else {
          console.log('MY RESULT===========', result.updatedResult.email);

          Toast.show('Profile Updated', Toast.SHORT);
          props.navigation.goBack();

          setLoading(false);
        }
      })
      .catch(error => console.log('error', error));
  };

  const UpdateImage = async () => {
    const userid = await AsyncStorage.getItem('userid');
    if (isselected == true) {
      console.log('UPLOADING THE IMAGE=========');
      RNFetchBlob.fetch(
        'put',
        Base_URL + '/user/updateUserProfile',
        {
          otherHeader: 'foo',
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'userId',
            data: String(userid),
          },
          {
            name: 'long',
            data: String(mylong),
          },
          {
            name: 'lat',
            data: String(mylat),
          },
          selectedImage,
        ],
      )
        .then(async response => {
          console.log('response:', response.data);
          let myresponse = JSON.parse(response.data);
          console.log('MY RESPONSE IMAGE FROM API ============', myresponse);
          await AsyncStorage.setItem(
            'profileimage',
            myresponse.updatedResult.profileImage.userPicUrl,
          );
          console.log(
            'UPDATED IMAGE LINK===========',
            myresponse.updatedResult.profileImage.userPicUrl,
          );
          Toast.show('Profile Updated', Toast.SHORT);
          props.navigation.goBack();
          setLoading(false);
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  const GetUser = async () => {
    setLoading(true);
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
        setUsername(response.data[0].userName);
        console.log('RESPONSE EMAIL', response.data[0].email);
        if (response.data[0].email == undefined) {
          setEmail(response.data[0].phoneNumber.slice(1));
        } else {
          setEmail(response.data[0].email);
        }
        if (response.data[0].userEmailAddress != undefined) {
          setRecoveryEmail(response.data[0].userEmailAddress);
        }
        console.log(response.data[0].gender);
        if (response.data[0].gender == 'male') {
          setGender('Male');
          setApiGender('male');
        } else if (response.data[0].gender == 'female') {
          setGender('Female');
          setApiGender('female');
        } else if (response.data[0].gender == 'preferNotToSay') {
          setGender('Prefer not to say');
          setApiGender('preferNotToSay');
        }
        setProfession(response.data[0].profession);
        setMydate(moment(response.data[0].dateOfBirth).format('DD-MM-YYYY'));
        setApiFormatDate(
          moment(response.data[0].dateOfBirth).format('MM-DD-YYYY'),
        );
        setMyimage(response.data[0].profileImage.userPicUrl);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <SafeAreaView
      style={STYLES.container}
      pointerEvents={loading ? 'none' : 'auto'}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={STYLES.scrollviewJustify}>
        <View style={STYLES.subcontainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: responsiveHeight(1),
              width: responsiveWidth(90),
              alignSelf: 'center',
              justifyContent: 'space-between',
              // justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => props.navigation.goBack()}
                style={{
                  paddingLeft: responsiveWidth(2),
                  marginLeft: responsiveWidth(-2),
                  paddingRight: responsiveWidth(2),
                  paddingVertical: responsiveHeight(1.5),
                  marginVertical: responsiveHeight(0.5),
                  //   marginTop: responsiveHeight(2),
                }}>
                <Image
                  source={appImages.backicon2}
                  resizeMode="contain"
                  style={{
                    width: responsiveWidth(4.5),
                    height: responsiveWidth(4.5),
                  }}
                />
              </TouchableOpacity>
              <Text style={styles.txt1}>Edit Profile</Text>
            </View>

            {loading ? (
              <ActivityIndicator color={appColor.appColorMain} size={'small'} />
            ) : null}
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setImagevisible(true)}
            style={{
              width: responsiveWidth(44),
              height: responsiveWidth(44),
              alignSelf: 'center',
              marginTop: responsiveHeight(3),
            }}>
            <View
              style={{
                borderRadius: responsiveWidth(9.5),
                overflow: 'hidden',
                alignSelf: 'center',
                width: responsiveWidth(44),
                height: responsiveWidth(44),
              }}>
              <Image
                source={myimage == '' ? appImages.noimg : {uri: myimage}}
                style={{
                  width: responsiveWidth(44),
                  height: responsiveWidth(44),
                  resizeMode: 'cover',
                }}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => showDialog()}
              style={{
                position: 'absolute',
                bottom: responsiveWidth(-4),
                right: responsiveWidth(-4),
              }}>
              <Image
                source={appImages.imagepicker}
                resizeMode={'contain'}
                style={{
                  width: responsiveWidth(13),
                  height: responsiveWidth(13),
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          <View
            style={[
              styles.emailparent,
              {
                borderColor:
                  myfocus == 'username' ? appColor.appColorMain : '#D7D7D7',
              },
            ]}>
            <Image
              source={appImages.user}
              resizeMode="contain"
              style={{
                width: responsiveWidth(5.5),
                height: responsiveWidth(5.5),
                // backgroundColor: 'red',
                marginLeft: responsiveWidth(5),
              }}
            />
            <TextInput
              editable={mysignuptype == 'google' ? false : true}
              showSoftInputOnFocus={
                mysignuptype == 'google' ? !softinput : softinput
              }
              autoFocus={mysignuptype == 'google' ? false : true}
              placeholderTextColor={'#8D8D8D'}
              value={username}
              onChangeText={text => {
                setUsername(text);
                setCheckusername(false);
              }}
              selectionColor={appColor.appColorMain}
              placeholder="Username"
              style={styles.txtinputusername}
              onFocus={() => setMyfocus('')}
              onBlur={() => setMyfocus('')}
              onSubmitEditing={() => emailinputref.current.focus()}
              blurOnSubmit={false}
              returnKeyType={'next'}
            />
          </View>
          {checkusername ? (
            <Text style={styles.errortxt}>{usernameerror}</Text>
          ) : null}
          <View
            style={[
              styles.emailparent,
              {
                borderColor:
                  myfocus == 'email' ? appColor.appColorMain : '#D7D7D7',
                marginTop: responsiveHeight(2.8),
              },
            ]}>
            <Image
              source={appImages.email}
              resizeMode="contain"
              style={{
                width: responsiveWidth(5.5),
                height: responsiveWidth(5.5),
                // backgroundColor: 'red',
                marginLeft: responsiveWidth(5),
              }}
            />
            <Text
              style={{
                paddingLeft: responsiveWidth(3),
                color: '#080808',
                
                fontSize: responsiveFontSize(2),
              }}>
              {firstchar}
            </Text>

            <TextInput
              editable={false}
              value={email}
              onChangeText={text => {
                setEmail(text);
                setCheckemail(false);
                if (text !== '' && regchecknumber.test(text)) {
                  setFirstChar('+');
                } else {
                  setFirstChar('');
                }
              }}
              placeholderTextColor={'#8D8D8D'}
              selectionColor={appColor.appColorMain}
              placeholder="Email Address / Phone No With CC"
              style={styles.txtinputemail}
              onFocus={() => setMyfocus('email')}
              onBlur={() => setMyfocus('')}
              keyboardType={'email-address'}
              onSubmitEditing={() => showModal()}
              blurOnSubmit={true}
              returnKeyType={'next'}
              ref={emailinputref}
            />
          </View>
          {checkemail ? (
            <Text style={styles.errortxt}>{emailerror}</Text>
          ) : null}

          {mysignuptype == 'phoneNumber' ? (
            <>
              <View
                style={[
                  styles.emailparent,
                  {
                    borderColor:
                      myfocus == 'recoveryemail'
                        ? appColor.appColorMain
                        : '#D7D7D7',
                    marginTop: responsiveHeight(2.8),
                  },
                ]}>
                <Image
                  source={appImages.email}
                  resizeMode="contain"
                  style={{
                    width: responsiveWidth(5.5),
                    height: responsiveWidth(5.5),
                    // backgroundColor: 'red',
                    marginLeft: responsiveWidth(5),
                  }}
                />
                <TextInput
                  value={recoveryemail}
                  onChangeText={text => {
                    setRecoveryEmail(text);
                    setCheckRecoveryEmail(false);
                  }}
                  placeholderTextColor={'#8D8D8D'}
                  selectionColor={appColor.appColorMain}
                  placeholder="Recovery Email (Optional)"
                  style={[
                    styles.txtinputemail,
                    {paddingLeft: responsiveWidth(3)},
                  ]}
                  onFocus={() => setMyfocus('recoveryemail')}
                  onBlur={() => setMyfocus('')}
                  keyboardType={'email-address'}
                  onSubmitEditing={() => showModal()}
                  blurOnSubmit={true}
                  returnKeyType={'next'}
                  ref={recoveryemailinputref}
                />
              </View>
              {checkrecoveryemail ? (
                <Text style={styles.errortxt}>{recoveryemailerror}</Text>
              ) : null}
            </>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              showModal();
            }}
            activeOpacity={0.7}
            style={[
              styles.emailparent,
              {
                borderColor:
                  myfocus == 'gender' ? appColor.appColorMain : '#D7D7D7',
              },
            ]}>
            <Image
              source={appImages.gender}
              resizeMode="contain"
              style={{
                width: responsiveWidth(5.5),
                height: responsiveWidth(5.5),
                // backgroundColor: 'red',
                marginLeft: responsiveWidth(5),
              }}
            />
            <TextInput
              editable={false}
              placeholderTextColor={'#8D8D8D'}
              value={gender}
              selectionColor={appColor.appColorMain}
              placeholder="Gender"
              style={styles.txtinputusername}
              onFocus={() => setMyfocus('gender')}
              onBlur={() => setMyfocus('')}
              // onSubmitEditing={() => emailinputref.current.focus()}
              blurOnSubmit={false}
              returnKeyType={'next'}
            />
          </TouchableOpacity>
          {checkgender ? (
            <Text style={styles.errortxt}>{gendererror}</Text>
          ) : null}
          <View
            style={[
              styles.emailparent,
              {
                borderColor:
                  myfocus == 'profession' ? appColor.appColorMain : '#D7D7D7',
              },
            ]}>
            <Image
              source={appImages.profession}
              resizeMode="contain"
              style={{
                width: responsiveWidth(5.5),
                height: responsiveWidth(5.5),
                // backgroundColor: 'red',
                marginLeft: responsiveWidth(5),
              }}
            />
            <TextInput
              value={profession}
              onChangeText={text => {
                setProfession(text);
                setCheckprofession(false);
              }}
              placeholderTextColor={'#8D8D8D'}
              selectionColor={appColor.appColorMain}
              placeholder="Profession"
              style={styles.txtinputusername}
              onFocus={() => setMyfocus('profession')}
              onBlur={() => setMyfocus('')}
              // onSubmitEditing={() => passwordinputref.current.focus()}
              ref={professionref}
              blurOnSubmit={true}
              // returnKeyType={'next'}
            />
          </View>
          {checkprofession ? (
            <Text style={styles.errortxt}>{professionerror}</Text>
          ) : null}
          {/* <View
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
                width: responsiveWidth(5.5),
                height: responsiveWidth(5.5),
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
              blurOnSubmit={false}
              returnKeyType={'next'}
              placeholderTextColor={'#8D8D8D'}
              selectionColor={appColor.appColorMain}
              placeholder="Password"
              style={styles.txtinputpassword}
              onFocus={() => setMyfocus('password')}
              onBlur={() => setMyfocus('')}
              secureTextEntry={securepassword}
              ref={passwordinputref}
              onSubmitEditing={() => confirmpasswordinputref.current.focus()}
            />
            <EyeIcon
              style={{fontSize: responsiveFontSize(3.7), color: 'lightgray'}}
              name={securepassword ? 'eye-off' : 'eye'}
              onPress={() => setSecurepassword(!securepassword)}
            />
          </View> */}
          {/* {checkpassword ? (
            <Text style={styles.errortxt}>{passworderror}</Text>
          ) : null} */}
          {/* <View
            style={[
              styles.passwordparent,
              {
                borderColor:
                  myfocus == 'confirmpassword'
                    ? appColor.appColorMain
                    : '#D7D7D7',
              },
            ]}>
            <Image
              source={appImages.password}
              resizeMode="contain"
              style={{
                width: responsiveWidth(5.5),
                height: responsiveWidth(5.5),
                // backgroundColor: 'red',
                marginLeft: responsiveWidth(5),
              }}
            />
            <TextInput
              value={confirmpassword}
              onChangeText={text => {
                setConfirmPassword(text);
                setCheckConfirmpassword(false);
              }}
              placeholderTextColor={'#8D8D8D'}
              selectionColor={appColor.appColorMain}
              placeholder="Confirm Password"
              style={styles.txtinputpassword}
              onFocus={() => setMyfocus('confirmpassword')}
              onBlur={() => setMyfocus('')}
              secureTextEntry={secureconfirmpassword}
              ref={confirmpasswordinputref}
            />
            <EyeIcon
              style={{fontSize: responsiveFontSize(3.7), color: 'lightgray'}}
              name={secureconfirmpassword ? 'eye-off' : 'eye'}
              onPress={() => setSecureConfirmpassword(!secureconfirmpassword)}
            />
          </View> */}
          {/* {checkconfirmpassword ? (
            <Text style={styles.errortxt}>{confirmpassworderror}</Text>
          ) : null} */}
          <DateSelect
            getDate={date => {
              setMydate(date);
              setCheckDate(false);
            }}
            getApiDate={date => setApiFormatDate(date)}
            value={mydate}
          />
          {checkdate ? <Text style={styles.errortxt}>{dateerror}</Text> : null}
          {mysignuptype != 'google' ? (
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('UpdatePasswordInApp', {});
              }}
              activeOpacity={0.7}
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
                  width: responsiveWidth(5.5),
                  height: responsiveWidth(5.5),
                  // backgroundColor: 'red',
                  marginLeft: responsiveWidth(5),
                }}
              />
              <TextInput
                editable={false}
                value={'Update Password'}
                // onChangeText={text => {
                //   setPassword(text);
                //   setCheckpassword(false);
                // }}
                blurOnSubmit={false}
                returnKeyType={'next'}
                placeholderTextColor={'#8D8D8D'}
                selectionColor={appColor.appColorMain}
                placeholder="Password"
                style={styles.txtinputpassword}
                onFocus={() => setMyfocus('password')}
                onBlur={() => setMyfocus('')}
                // secureTextEntry={securepassword}
                ref={passwordinputref}
                onSubmitEditing={() => confirmpasswordinputref.current.focus()}
              />
              {/* <EyeIcon
              style={{fontSize: responsiveFontSize(3.7), color: 'lightgray'}}
              name={securepassword ? 'eye-off' : 'eye'}
              onPress={() => setSecurepassword(!securepassword)}
            /> */}
            </TouchableOpacity>
          ) : null}
        </View>

        {loading ? (
          <MyButtonLoader
            myStyles={{
              width: responsiveWidth(80),
              backgroundColor: appColor.appColorMain,
              marginBottom: responsiveHeight(4),

              marginTop: responsiveHeight(4),
              height: responsiveHeight(7),
            }}
            title={'Update'}
            itsTextstyle={{
              color: '#fff',
            }}
          />
        ) : (
          <MyButton
            onPress={() => {
              Validations();
            }}
            myStyles={{
              width: responsiveWidth(80),
              backgroundColor: appColor.appColorMain,
              marginBottom: responsiveHeight(4),

              marginTop: responsiveHeight(4),
              height: responsiveHeight(7),
            }}
            title={'Update'}
            itsTextstyle={{
              color: '#fff',
            }}
          />
        )}

        <Dialog.Container
          visible={visible}
          verticalButtons={true}
          onRequestClose={() => handleCancel()}>
          <Dialog.Title
            style={{
              
              alignSelf: 'center',
              color: '#080808',
            }}>
            Upload Photos Or Videos
          </Dialog.Title>
          {/* <Dialog.Description>
            Take a photo or choose from your library
          </Dialog.Description> */}
          <Dialog.Button
            style={{
              
              alignSelf: 'center',
            }}
            label="Take a Photo"
            onPress={() => {
              imageTakeFromCamera();
              handleCancel();
            }}
            color={appColor.appColorMain}
          />
          <Dialog.Button
            style={{
              
              alignSelf: 'center',
            }}
            label="Choose from Gallery"
            onPress={() => {
              imageTakeFromGallery();
              handleCancel();
            }}
            color={appColor.appColorMain}
          />
          <Dialog.Button
            style={{
              

              alignSelf: 'center',
            }}
            label="Cancel"
            onPress={handleCancel}
            color={appColor.appColorMain}
          />
        </Dialog.Container>
        <Modal visible={modalvisible} onDismiss={hideModal}>
          <View
            style={{
              backgroundColor: '#fff',
              alignItems: 'center',
              width: responsiveWidth(65),
              paddingVertical: responsiveHeight(2),
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setApiGender('male');

                setCheckgender(false);
                professionref.current.focus();
                setGender('Male');
                hideModal();
              }}
              style={styles.genderview}>
              <Text style={styles.genderselecttxt}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setApiGender('female');

                setCheckgender(false);
                professionref.current.focus();
                setGender('Female');
                hideModal();
              }}
              style={styles.genderview}>
              <Text style={styles.genderselecttxt}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setApiGender('Trans-men');

                setCheckgender(false);
                professionref.current.focus();
                setGender('transmen');
                hideModal();
              }}
              style={styles.genderview}>
              <Text style={styles.genderselecttxt}>Trans-men</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setApiGender('Trans-women');

                setCheckgender(false);
                professionref.current.focus();
                setGender('transwomen');
                hideModal();
              }}
              style={styles.genderview}>
              <Text style={styles.genderselecttxt}>Trans-women</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <ImageView
          images={images}
          imageIndex={0}
          visible={imagevisible}
          onRequestClose={() => setImagevisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  txt1: {
    
    color: appColor.appColorMain,
    fontSize: responsiveFontSize(3.2),
    marginLeft: responsiveWidth(2),
  },
  selectcategorytxt: {
    color: '#080808',
    
    fontSize: responsiveFontSize(3.2),
  },
  sicon2: {
    width: responsiveWidth(5.5),
    height: responsiveWidth(5.5),
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
    marginTop: responsiveHeight(3),
    paddingVertical: responsiveHeight(0.9),
    flexDirection: 'row',
    alignItems: 'center',
    width: responsiveWidth(85),
    alignSelf: 'center',
  },
  txtinputemail: {
    width: responsiveWidth(70),

    color: '#080808',
    
    fontSize: responsiveFontSize(2),
  },
  txtinputpassword: {
    width: responsiveWidth(59.5),
    paddingLeft: responsiveWidth(3),
    color: '#080808',
    
    fontSize: responsiveFontSize(2),
  },
  txtinputusername: {
    width: responsiveWidth(70),
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
  genderview: {
    paddingVertical: responsiveHeight(2),
    // backgroundColor: 'red',
    width: responsiveWidth(65),
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  genderselecttxt: {
    color: '#000000',
    
    fontSize: responsiveFontSize(2.3),
  },
});
