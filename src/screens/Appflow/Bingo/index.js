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
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Right from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import STYLES from '../../STYLES';
import {appImages} from '../../../assets/utilities';
import RBSheet from 'react-native-raw-bottom-sheet';

import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Carousel from 'react-native-snap-carousel';
import {fontFamily} from '../../../constants/fonts';
import {MyButton} from '../../../components/MyButton';
import LinearGradient from 'react-native-linear-gradient';
import MyHeart from '../../../components/MyHeart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {Base_URL} from '../../../Base_URL';
const Bingo = ({route, navigation}) => {
  const {myuserid, myimg, userdata} = route.params;
  useFocusEffect(
    React.useCallback(() => {
      getotheruser();
    }, []),
  );
  console.log('MY USER DATA==============', userdata, myimg, myuserid);
  const [userimg, setUserImg] = useState('');
  const [userDetails, setUserDetails] = useState();
  const getotheruser = async () => {
    var axios = require('axios');
    console.log('SWIPED USER ID=============', userdata);
    var config = {
      method: 'get',
      url: Base_URL + '/user/specificUser/' + userdata,
      headers: {},
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        console.log('USER DETAILS FROM BINGO===========', response.data[0]);
        setUserDetails(response.data[0]);
        setUserImg(response.data[0].profileImage.userPicUrl);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <SafeAreaView style={[STYLES.container]}>
      <StatusBar
        backgroundColor={'rgba(234, 51, 77, 1)'}
        barStyle={'light-content'}
        hidden={false}
        translucent={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <LinearGradient
          style={{
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
          colors={['rgba(234, 51, 77, 1)', 'rgba(234, 51, 77, 0.75)']}>
          <View>
            <View
              style={{
                width: responsiveWidth(90),
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: responsiveHeight(8),
              }}>
              <View
                style={{
                  width: responsiveWidth(54),
                  height: responsiveHeight(32),
                  borderRadius: responsiveWidth(8),
                  transform: [{rotate: '-15deg'}],
                  backgroundColor: '#FC2252',
                  alignItems: 'center',
                  justifyContent: 'center',

                  borderRadius: responsiveWidth(8),
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.37,
                  shadowRadius: 7.49,

                  elevation: 12,
                }}>
                <Image
                  source={{uri: myimg}}
                  style={{
                    width: responsiveWidth(54),
                    height: responsiveHeight(32),
                    resizeMode: 'cover',
                    borderRadius: responsiveWidth(8),
                    // backgroundColor: 'red',
                  }}
                />
              </View>
              <View
                style={{
                  width: responsiveWidth(54),
                  height: responsiveHeight(32),
                  transform: [{rotate: '15deg'}],
                  marginTop: responsiveHeight(13.5),
                  marginLeft: responsiveWidth(-33),
                  backgroundColor: '#FC2252',

                  borderRadius: responsiveWidth(8),
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.37,
                  shadowRadius: 7.49,

                  elevation: 12,
                }}>
                {userimg != '' ? (
                  <Image
                    source={{uri: userimg}}
                    style={{
                      width: responsiveWidth(54),
                      height: responsiveHeight(32),
                      resizeMode: 'cover',
                      borderRadius: responsiveWidth(8),
                      // backgroundColor: 'red',
                    }}
                  />
                ) : null}
              </View>
            </View>
            <View
              style={{
                alignSelf: 'center',
                alignItems: 'center',

                // backgroundColor: 'red',
              }}>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <Text style={styles.txt2}>Bingo</Text>
                <Text style={styles.txt1}>,</Text>
                <Text style={styles.txt1}>you score a match</Text>
              </View>
            </View>
            <View
              style={{
                alignItems: 'center',
                marginTop: responsiveHeight(2),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={appImages.heartwhite}
                style={{
                  width: responsiveWidth(3),
                  height: responsiveWidth(3),
                  resizeMode: 'contain',
                  marginBottom: responsiveHeight(2),
                  marginRight: responsiveWidth(1),
                }}
              />
              <Image
                source={appImages.heartwhite}
                style={{
                  width: responsiveWidth(11),
                  height: responsiveWidth(11),
                  resizeMode: 'contain',
                }}
              />
              <Image
                source={appImages.heartwhite}
                style={{
                  width: responsiveWidth(3),
                  height: responsiveWidth(3),
                  resizeMode: 'contain',
                  marginTop: responsiveHeight(2),
                  marginLeft: responsiveWidth(1),
                  transform: [{rotate: '45deg'}],
                }}
              />
            </View>
          </View>

          <View style={styles.fixedfooter}>
            <MyButton
              myStyles={styles.button1}
              title={'Send Message'}
              itsTextstyle={styles.txt3}
              disabled={
                userDetails == null
                  ? true
                  : userDetails == undefined
                  ? true
                  : false
              }
              onPress={() =>
                navigation.navigate('Messaging', {userDetails: userDetails})
              }
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('PlayScreen')}
              activeOpacity={0.6}
              style={{
                borderRadius: responsiveWidth(100),

                width: responsiveWidth(70),
                height: responsiveHeight(7.5),
                alignSelf: 'center',
                alignItems: 'center',
                //   marginTop: responsiveHeight(1),
                //   backgroundColor: 'red',
                justifyContent: 'center',
              }}>
              <Text style={styles.txt4}>Continue to Play</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Bingo;

const styles = StyleSheet.create({
  txt1: {
    color: '#fff',
    
    fontSize: responsiveFontSize(2.5),
    // marginBottom: responsiveHeight(1),
    textAlign: 'center',
    marginTop: responsiveHeight(0.5),
  },
  txt2: {
    color: '#fff',
    

    fontSize: responsiveFontSize(5),
    marginTop: responsiveHeight(3.5),

    // marginBottom: responsiveHeight(3),
  },
  button1: {
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(100),

    width: responsiveWidth(70),
    height: responsiveHeight(7.5),
  },

  txt3: {
    

    color: '#FB3F71',
    fontSize: responsiveFontSize(2),
  },
  txt4: {
    
    color: '#fff',
    fontSize: responsiveFontSize(2),
  },
  fixedfooter: {
    marginBottom: responsiveHeight(2),
  },
});
