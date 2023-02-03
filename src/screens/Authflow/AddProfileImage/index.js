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
  BackHandler,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import Dialog from 'react-native-dialog';
import ImagePicker from 'react-native-image-crop-picker';

import React, {useEffect, useRef, useState} from 'react';
import STYLES from '../../STYLES';
import {appColor, appImages} from '../../../assets/utilities';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import MyHeart from '../../../components/MyHeart';
import {useFocusEffect} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {MyButton, MyButtonLoader} from '../../../components/MyButton';
import {fontFamily} from '../../../constants/fonts';
import {Base_URL} from '../../../Base_URL';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddProfileImage = ({route, navigation}) => {
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        navigation.navigate('Splash');
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      setMyimage('');
    }, []),
  );

  const [myimage, setMyimage] = useState('');
  const [apiarray, setApiArray] = useState([]);
  let myarr = [];

  const {
    routeFrom,
    userid,
    mylat,
    mylong,
    email,
    password,
    screenFrom,
    phoneNumber,
  } = route.params;

  const UpdateUserId = async () => {
    await myarr.push({
      name: 'userId',
      data: userid,
    });
    await myarr.push({
      name: 'long',
      data: mylong,
    });
    await myarr.push({
      name: 'lat',
      data: mylat,
    });
    console.log('USER INFORMATION UPDATED');
  };
  console.log(routeFrom, userid, mylat, mylong, email, password, phoneNumber);
  const [selectedImage, setSelectedImage] = useState();
  const [loading, setLoading] = useState(false);
  const imageTakeFromGallery = () => {
    ImagePicker.openPicker({
      cropping: false,
      mediaType: 'photo',
      // compressImageQuality: 1,
    }).then(async image => {
      console.log(image);
      setMyimage(image.path);
      const filename = image.path.substring(image.path.lastIndexOf('/') + 1);
      // myarr = [...apiarray];
      setSelectedImage({
        name: 'profileImage',
        filename: filename,
        type: image.mime,
        data: RNFetchBlob.wrap(image.path),
      });
      // await myarr.push({
      //   name: 'profileImage',
      //   filename: filename,
      //   type: image.mime,
      //   data: RNFetchBlob.wrap(image.path),
      // });
    });
  };

  const images = [myimage == '' ? appImages.noimg : {uri: myimage}];
  const imageTakeFromCamera = () => {
    ImagePicker.openCamera({
      cropping: false,
      mediaType: 'photo',
    }).then(image => {
      console.log(image.path);
      setMyimage(image.path);
      const filename = image.path.substring(image.path.lastIndexOf('/') + 1);
      setSelectedImage({
        name: 'profileImage',
        filename: filename,
        type: image.mime,
        data: RNFetchBlob.wrap(image.path),
      });
    });
  };

  const [visible, setVisible] = useState(false);
  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const [imagevisible, setImagevisible] = useState(false);

  useEffect(() => {
    UpdateUserId();
  }, []);

  const UploadToCloudinary = image => {
    if (myimage !== '') {
      setLoading(true);
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
          if (myresponse.message == 'Updated successfully') {
            console.log(
              'IMAGE ON SIGNUP API ============',
              myresponse.updatedResult.profileImage.userPicUrl,
            );
            await AsyncStorage.setItem(
              'profileimage',
              myresponse.updatedResult.profileImage.userPicUrl,
            );

            if (screenFrom != 'signup') {
              navigation.navigate('App', {
                screen: 'PlayScreenScreens',
              });
              setLoading(false);
            } else if (routeFrom == 'emailorphone') {
              console.log('FROM SIMPLE EMAIL / PASSWORD');
              var axios = require('axios');
              if (email == undefined) {
                var data = JSON.stringify({
                  phoneNumber: phoneNumber,
                  password: password,
                });
              } else {
                var data = JSON.stringify({
                  email: email,
                  password: password,
                });
              }

              var config = {
                method: 'post',
                url: Base_URL + '/user/login',
                headers: {
                  'Content-Type': 'application/json',
                },
                data: data,
              };

              await axios(config)
                .then(async function (response) {
                  console.log(JSON.stringify(response.data));
                  console.log('RESPONSE OF LOGIN=============', response.data);

                  await AsyncStorage.setItem('userid', response.data.Data._id);
                  await AsyncStorage.setItem(
                    'signuptype',
                    response.data.Data.signupType,
                  );
                  await AsyncStorage.setItem('password', password);

                  navigation.navigate('App', {
                    screen: 'PlayScreenScreens',
                  });
                })
                .catch(function (error) {
                  console.log(error);
                });

              setLoading(false);
            } else if (routeFrom == 'google') {
              console.log('FROM GOOGLE');

              var axios = require('axios');
              var data = JSON.stringify({
                email: email,
                password: password,
                ip: '192.168.20.1',
                country: 'japan',
              });

              var config = {
                method: 'post',
                url: Base_URL + '/user/login',
                headers: {
                  'Content-Type': 'application/json',
                },
                data: data,
              };

              await axios(config)
                .then(async function (response) {
                  console.log(JSON.stringify(response.data));
                  if (response.data.message == 'Logged in successfully') {
                    // console.log('THE USER ID==========', response.data);
                    await AsyncStorage.setItem(
                      'userid',
                      response.data.Data._id,
                    );
                    await AsyncStorage.setItem(
                      'signuptype',
                      response.data.Data.signupType,
                    );
                    await AsyncStorage.setItem('password', 'googlesignup');
                    props.navigation.navigate('App', {
                      screen: 'PlayScreenScreens',
                    });
                  }

                  setLoading(false);
                })
                .catch(function (error) {
                  console.log(error);
                  setLoading(false);
                });
            }
          }
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    }
  };
  // const SignUpApi = async image => {
  //   var axios = require('axios');
  //   if (signuptype == 'phoneNumber') {
  //     var data = JSON.stringify({
  //       userName: username,
  //       password: password,
  //       phoneNumber: '+' + email,
  //       signupType: signuptype,
  //       dateOfBirth: apiformatdate,
  //       profileImage: image,
  //       location: {
  //         coordinates: [mylong, mylat],
  //       },
  //       gender: gender,
  //       profession: profession,
  //     });
  //   } else {
  //     var data = JSON.stringify({
  //       userName: username,
  //       password: password,
  //       signupType: signuptype,
  //       dateOfBirth: apiformatdate,
  //       profileImage: image,
  //       email: email,
  //       location: {
  //         coordinates: [mylong, mylat],
  //       },
  //       gender: gender,
  //       profession: profession,
  //     });
  //   }

  //   var config = {
  //     method: 'post',
  //     url: Base_URL + '/user/register',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     data: data,
  //   };

  //   await axios(config)
  //     .then(function (response) {
  //       console.log(JSON.stringify(response.data));
  //       navigation.navigate('Login');
  //       setLoading(false);
  //     })
  //     .catch(function (error) {
  //       console.log(error.response);
  //       setLoading(false);
  //     });
  // };
  return (
    <SafeAreaView style={STYLES.containerJustify}>
      <StatusBar
        hidden={false}
        backgroundColor={'#fff'}
        barStyle={'dark-content'}
      />

      <View pointerEvents={loading ? 'none' : 'auto'}>
        <Text style={styles.maintxt}>Add Profile Image</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            if (myimage != '') {
              setImagevisible(true);
            }
          }}
          style={{
            width: responsiveWidth(44),
            height: responsiveWidth(44),
            alignSelf: 'center',
            marginTop: responsiveHeight(15),
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
            disabled={loading ? true : false}
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
      </View>

      {loading ? (
        <MyButtonLoader
          myStyles={styles.buttonstyle}
          title={'Add'}
          itsTextstyle={{
            color: '#fff',
            
          }}
        />
      ) : (
        <MyButton
          myStyles={styles.buttonstyle}
          title={'Add'}
          
          onPress={() => {
            UploadToCloudinary();
            // props.navigation.navigate('Subscribe')
          }}
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
      <ImageView
        images={images}
        imageIndex={0}
        visible={imagevisible}
        onRequestClose={() => setImagevisible(false)}
      />
    </SafeAreaView>
  );
};

export default AddProfileImage;

const styles = StyleSheet.create({
  maintxt: {
    color: appColor.appColorMain,
    fontSize: responsiveFontSize(3.9),
    // fontSize: 30,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: responsiveHeight(6),
  },
  buttonstyle: {
    backgroundColor: '#FF0047',
    marginBottom: responsiveHeight(12),
  },
});
