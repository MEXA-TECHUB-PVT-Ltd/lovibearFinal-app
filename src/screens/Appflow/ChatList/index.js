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
import {appColor, appImages} from '../../../assets/utilities';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Carousel from 'react-native-snap-carousel';
import {fontFamily} from '../../../constants/fonts';
import {Base_URL, Base_URL_Socket} from '../../../Base_URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
const ChatList = props => {
  useFocusEffect(
    React.useCallback(() => {
      GetUserMatches();
      GetChatList();
    }, []),
  );
  const [empty, setEmpty] = useState(false);
  const [chatempty, setChatEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const GetChatList = async () => {
    const userid = await AsyncStorage.getItem('userid');
    var axios = require('axios');

    var config = {
      method: 'get',
      url: Base_URL_Socket + '/chat/' + userid,
      headers: {},
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data.result));
        console.log('THE RESULT========', response.data.result);
        if (response.data.result != 0) {
          let myfilter = response.data.result.map(item => {
            console.log('USER IDS=========', item.users);
            let filteruser = item.members.filter(item => {
              return item != userid;
            });
            let detailsfilter = item.userDetails.filter(item => {
              return item._id != userid;
            });
            return {
              ...item,
              members: filteruser[0],
              userDetails: detailsfilter[0],
            };
          });
          console.log(
            'MY FILTER OF CHAT LIST===========',
            JSON.stringify(myfilter),
          );
          setList(myfilter);
         
          setChatEmpty(false);
        } else {
          setChatEmpty(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const GetUserMatches = async () => {
    const userid = await AsyncStorage.getItem('userid');
    console.log('MY USER ID============', userid);
    var axios = require('axios');

    var config = {
      method: 'get',
      url: Base_URL + '/matches/getUserMatches/' + userid,
      headers: {},
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        console.log('USER DETAILS============', response.data);
        if (response.data != 0) {
          let myfilter = response.data.map(item => {
            console.log('USER IDS=========', item.users);
            let filteruser = item.users.filter(item => {
              return item != userid;
            });
            let detailsfilter = item.userDetails.filter(item => {
              return item._id != userid;
            });
            return {
              ...item,
              users: filteruser[0],
              userDetails: detailsfilter[0],
            };
          });
          console.log('MY FILTER===========', JSON.stringify(myfilter));
          setMatchesList(myfilter);
          setEmpty(false);
        } else {
          setEmpty(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const [matcheslist, setMatchesList] = useState([]);
  const [list, setList] = useState([]);
  const renderItem = ({item}) => {
    console.log('THE ITEMIN CHATLIST==============');
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('Messaging', {
            userDetails: item.userDetails,
          })
        }
        activeOpacity={0.7}
        style={{
          marginTop: responsiveHeight(1.7),
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Image
          style={{
            width: responsiveWidth(17),
            height: responsiveWidth(17),
            borderRadius: responsiveWidth(100),
          }}
          source={{uri: item.userDetails.profileImage.userPicUrl}}
          resizeMode="cover"
        />

        <View
          style={{
            // flexDirection: 'row',
            justifyContent: 'space-between',
            width: responsiveWidth(66),
            borderBottomColor: '#E3E3E3',
            borderBottomWidth: responsiveWidth(0.2),
            paddingBottom: responsiveHeight(3.2),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.nametxt}>{item.userDetails.userName}</Text>
            {/* <Text style={styles.timetxt}>3 hours</Text> */}
          </View>
          {/* <View>
            <Text style={styles.worktxt}>Loem ipusm conctracting</Text>
          </View> */}
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem2 = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Messaging', {
            userDetails: item.userDetails,
          });
        }}
        activeOpacity={0.8}
        style={{
          marginTop: responsiveHeight(1.7),
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            width: responsiveWidth(35.5),
            height: responsiveWidth(40.5),
            borderRadius: responsiveWidth(2),
            marginRight: responsiveWidth(3),
            backgroundColor: appColor.appColorMain,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={{
              width: responsiveWidth(35),
              height: responsiveWidth(40),
              borderRadius: responsiveWidth(2),
            }}
            source={{uri: item.userDetails.profileImage.userPicUrl}}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={STYLES.container}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}>
        <View
          style={{
            marginTop: responsiveHeight(1.5),
            marginBottom: responsiveHeight(1.5),
          }}>
          <Text style={styles.txt1}>Your Matches</Text>
          {empty ? (
            <View
              style={{
                flexGrow: 1,
                width: responsiveWidth(80),
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: responsiveHeight(4),
              }}>
              <Text
                style={{
                  
                  color: appColor.appColorMain,
                  fontSize: responsiveFontSize(2.2),
                }}>
                No Matches Found
              </Text>
            </View>
          ) : (
            <FlatList
              data={matcheslist}
              renderItem={renderItem2}
              contentContainerStyle={{
                flexGrow: 1,
                paddingHorizontal: responsiveWidth(5),
              }}
              showsHorizontalScrollIndicator={false}
              horizontal
            />
          )}
          <Text style={[styles.txt1, {marginTop: responsiveHeight(2)}]}>
            Messages
          </Text>
        </View>
        {chatempty ? (
          <View
            style={{
              flexGrow: 1,
              width: responsiveWidth(80),
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginBottom: responsiveHeight(10),
            }}>
            <Text
              style={{
                
                color: appColor.appColorMain,
                fontSize: responsiveFontSize(3.2),
              }}>
              No Chats Found
            </Text>
          </View>
        ) : (
          <FlatList
            data={list}
            renderItem={renderItem}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: responsiveWidth(5),
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  txt1: {
    
    color: appColor.appColorMain,
    fontSize: responsiveFontSize(3.2),
    paddingHorizontal: responsiveWidth(5),
  },

  nametxt: {
    
    color: '#080808',
    fontSize: responsiveFontSize(2.5),
    marginTop: responsiveHeight(2),
  },
  worktxt: {
    
    color: '#080808',
    opacity: 0.3,
    fontSize: responsiveFontSize(1.8),
    marginBottom: responsiveHeight(0.7),
    marginTop: responsiveHeight(1),
  },
  companytxt: {
    
    color: '#080808',
    opacity: 0.3,
    fontSize: responsiveFontSize(1.9),
  },
  timetxt: {
    textAlign: 'right',
    
    color: '#000',
    opacity: 0.55,
    fontSize: responsiveFontSize(1.8),
    marginTop: responsiveHeight(-0.3),
  },
  answertxt: {
    textAlign: 'right',
    
    color: '#000',
    opacity: 0.55,
    fontSize: responsiveFontSize(1.8),
    marginTop: responsiveHeight(0.4),
  },
  selectcategorytxt: {
    color: '#080808',
    
    fontSize: responsiveFontSize(3.2),
  },
  sicon2: {
    width: responsiveWidth(5.5),
    height: responsiveWidth(5.5),
  },
});
