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
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  BackHandler,
  Alert,
} from 'react-native';
import Camera from 'react-native-vector-icons/FontAwesome5';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import Right from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import STYLES from '../../STYLES';
import {Emoji} from 'emoji-mart-native';
import {appColor, appImages} from '../../../assets/utilities';
import ImageView from 'react-native-image-viewing';
import Dialog from 'react-native-dialog';
import ImagePicker from 'react-native-image-crop-picker';
import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Carousel from 'react-native-snap-carousel';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Picker} from 'emoji-mart-native';
import {fontFamily} from '../../../constants/fonts';
import {
  GiftedChat,
  InputToolbar,
  Composer,
  Send,
  Bubble,
  Message,
  Actions,
} from 'react-native-gifted-chat';
import {io} from 'socket.io-client';

import {MyButton} from '../../../components/MyButton';

import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Base_URL, Base_URL_Socket} from '../../../Base_URL';
import RNFetchBlob from 'rn-fetch-blob';
const Messaging = ({route, navigation}) => {
  const [myidstate, setMyIdState] = useState('');
  const [receiveridstate, setReceiverIdState] = useState('');
  const [myindex, setMyindex] = useState();
  const [mychatid, setMyChatId] = useState('');
  const [messageinput, setMessageinput] = useState('');
  const {userDetails} = route.params;
  const [loading, setLoading] = useState(false);
  const [longpresseditem, setLongPressedItem] = useState('');
  const messagesRef = useRef();
  // console.log('THE USER DETAILS ON MESSAGE SCREEN========', userDetails);
  const socket = useRef();
  const [trigger, setTrigger] = useState(false);
  // console.log('the user details======', userDetails);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    InitiateChat();
    return () => socket.current.close();
  }, []);
  useEffect(() => {
    SetMessagesFunctions();
    return () => socket.current.close();
  }, []);
  const DeleteMsg = async () => {
    var axios = require('axios');

    var config = {
      method: 'delete',
      url: Base_URL_Socket + '/message/' + longpresseditem,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const GetAllMessages = async chatId => {
    var axios = require('axios');

    var config = {
      method: 'get',
      url: Base_URL_Socket + '/message/' + chatId,
      headers: {},
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setMessages(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const PostMedia = (myimg, customtype) => {
    console.log('MY IMAGE========', myimg, customtype);

    RNFetchBlob.fetch(
      'post',
      Base_URL + '/sendFile',

      {
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      [myimg],
    )
      .then(async response => {
        console.log('response:', response.data);
        let myresponse = JSON.parse(response.data);
        console.log('MY RESPONSE IMAGE FROM API ============', myresponse);
        socket.current.emit('send-message', {
          senderId: myidstate,
          receiverId: receiveridstate,
          text: myresponse.fileUrl,
          chatId: mychatid,
          msg_type: customtype,
          public_id: myresponse.public_id,
        });
      })

      .catch(error => {
        console.log(error);
      });
  };

  const SetMessagesFunctions = () => {
    if (socket.current) {
      console.log('GETTING MESSAGE');
      socket.current.on('recieve-message', msg => {
        console.log('recieve-message', msg);
        let myvar = msg;
        console.log('MY VAR===', myvar);
        setTheName(msg.text);
        msg && setMessages(prev => [...prev, msg]);
      });
    }
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     SetMessagesFunctions();
  //   }, []),
  // );

  const InitiateChat = async () => {
    socket.current = io(Base_URL_Socket);

    setLoading(true);
    console.log('INITIATING THE CHAT');
    const userid = await AsyncStorage.getItem('userid');
    const receiverid = userDetails._id;
    console.log('THE USER ID=======', userid);
    await socket.current.emit('new-user-add', userid);
    await socket.current.emit('chat-start', {
      senderId: userid,
      receiverId: receiverid,
    });
    await socket.current.on('get-users', data => {
      console.log('ALL USERS============', data);
    });
    await socket.current.on('chatId-receive', chatId => {
      console.log('CHAT ID============', chatId);
      setLoading(false);

      setMyChatId(chatId);
      GetAllMessages(chatId);
    });
    setMyIdState(userid);
    setReceiverIdState(receiverid);
  };
  const imageTakeFromGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'any',
    }).then(async image => {
      if (image.duration == undefined) {
        console.log('CHECKING DURATION', image);

        console.log(image.path);
        setMyimage(image.path);
        const filename = image.path.substring(image.path.lastIndexOf('/') + 1);
        let apiimage = {
          name: 'file',
          filename: filename,
          type: image.mime,
          data: RNFetchBlob.wrap(image.path),
        };
        let customtype = 'image';
        PostMedia(apiimage, customtype);
        let myarr = [...messages];
        await myarr.push({
          senderId: myidstate,
          chatId: mychatid,
          text: image.path,
          msg_type: 'image',
        });
        await setMessages(myarr);
      } else {
        console.log('CHECKING DURATION', image);
        console.log(image.path);
        setMyimage(image.path);
        const filename = image.path.substring(image.path.lastIndexOf('/') + 1);
        let apiimage = {
          name: 'file',
          filename: filename,
          type: image.mime,
          data: RNFetchBlob.wrap(image.path),
        };
        let customtype = 'video';
        PostMedia(apiimage, customtype);
        let myarr = [...messages];
        await myarr.push({
          senderId: myidstate,
          chatId: mychatid,
          text: image.path,
          msg_type: 'video',
        });
        await setMessages(myarr);
      }
    });
  };
  const imageTakeFromCamera = () => {
    ImagePicker.openCamera({
      cropping: false,
      width: 300,
      height: 400,
    }).then(async image => {
      console.log('CHECKING DURATION', image);
      console.log(image.path);
      setMyimage(image.path);
      const filename = image.path.substring(image.path.lastIndexOf('/') + 1);
      let apiimage = {
        name: 'file',
        filename: filename,
        type: image.mime,
        data: RNFetchBlob.wrap(image.path),
      };
      let customtype = 'image';
      PostMedia(apiimage, customtype);
      let myarr = [...messages];
      await myarr.push({
        senderId: myidstate,
        chatId: mychatid,
        text: image.path,
        msg_type: 'image',
      });
      await setMessages(myarr);
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
  const [myfocus, setMyfocus] = useState('');
  const [myimage, setMyimage] = useState('');
  const [thename, setTheName] = useState('Kyo');
  const refContainer = useRef();
  const [selectedImage, setSelectedImage] = useState('');
  const images = [{uri: selectedImage}];
  const renderItemMessages = ({item, index}) => {
    // console.log('THE TEXT DATA=========', item);
    return (
      <>
        {item.msg_type == 'text' ? (
          <TouchableOpacity
            onPress={() => {
              console.log('THE TOUCHED ITEM=========', item._id);
            }}
            activeOpacity={0.7}
            onLongPress={() => {
              if (item.senderId == myidstate) {
                setMyindex(index);
                setLongPressedItem(item._id);
                refContainer.current.open();
              } else {
                null;
              }
            }}
            style={
              item.senderId == myidstate
                ? styles.rightmessage
                : styles.leftmessage
            }>
            <Text
              style={
                item.senderId == myidstate ? styles.righttxt : styles.lefttxt
              }>
              {item.text}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onLongPress={() => {
              if (item.senderId == myidstate) {
                setMyindex(index);
                setLongPressedItem(item._id);
                refContainer.current.open();
              } else {
                null;
              }
            }}
            activeOpacity={0.7}
            style={
              item.senderId == myidstate
                ? styles.rightcontent
                : styles.leftcontent
            }
            onPress={() => {
              if (item.msg_type == 'image') {
                setSelectedImage(item.text);
                setImagevisible(true);
                console.log(selectedImage);
              } else {
                navigation.navigate('VideoScreen', {
                  mysource: item.text,
                });
              }
            }}>
            <FastImage
              source={{uri: item.text}}
              style={{
                width: responsiveWidth(59),
                height: responsiveWidth(71),
                borderRadius: responsiveWidth(2),
              }}
              resizeMode="cover"
            />
            {item.msg_type == 'text' ? null : item.msg_type == 'video' ? (
              <View
                style={{
                  width: responsiveWidth(60.5),
                  height: responsiveWidth(72.5),
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: responsiveWidth(10),
                    height: responsiveWidth(10),
                    backgroundColor: appColor.appColorMain,
                    borderRadius: responsiveWidth(100),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={appImages.musicplay}
                    style={{
                      width: responsiveWidth(13),
                      height: responsiveWidth(13),
                    }}
                  />
                </View>
              </View>
            ) : null}
          </TouchableOpacity>
        )}
      </>
    );
  };
  const [inputText, setinputText] = useState('');
  const [stateemoji, setStateemoji] = useState(false);
  const [check, setCheck] = useState(true);
  const [currentposition, setCurrentposition] = useState(0);
  useFocusEffect(
    React.useCallback(() => {
      if (stateemoji == true) {
        const backAction = () => {
          setStateemoji(false);
          return true;
        };
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
        return () => backHandler.remove();
      } else {
        BackHandler.removeEventListener();
      }
    }, [stateemoji]),
  );

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        navigation.navigate('ChatListScreens');
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, []),
  );


  return (
    <SafeAreaView style={STYLES.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: responsiveHeight(1),
          borderBottomColor: '#D3D3D3',
          borderBottomWidth: responsiveWidth(0.2),
          paddingBottom: responsiveHeight(2.8),
          //   paddingHorizontal: responsiveWidth(5),
          width: responsiveWidth(90),
          alignSelf: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.goBack()}
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
              style={{width: responsiveWidth(5), height: responsiveWidth(5)}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.65}
            onPress={() =>
              navigation.navigate('ViewMatchProfile', {
                userid: userDetails._id,
                name: userDetails.userName,
              })
            }
            style={{
              marginLeft: responsiveWidth(1),
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={{uri: userDetails.profileImage.userPicUrl}}
              resizeMode="contain"
              style={{
                width: responsiveWidth(16),
                height: responsiveWidth(16),
                borderRadius: responsiveWidth(100),
              }}
            />
            <View style={{marginLeft: responsiveWidth(2.5)}}>
              <Text style={styles.txt1}>{userDetails.userName}</Text>
              <Text style={styles.txt2}>{userDetails.profession}, 24</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: responsiveWidth(12),
            height: responsiveWidth(12),
            backgroundColor: '#FFC6D6',
            borderRadius: responsiveWidth(100),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={appImages.callicon}
            resizeMode="contain"
            style={{
              width: responsiveWidth(6),
              height: responsiveWidth(6),
            }}
          />
        </TouchableOpacity> */}
      </View>
      <FlatList
        ref={messagesRef}
        keyboardShouldPersistTaps={'always'}
        data={messages}
        onContentSizeChange={() =>
          messagesRef.current?.scrollToEnd({animated: false})
        }
        renderItem={renderItemMessages}
        contentContainerStyle={{
          width: responsiveWidth(90),
          // flex: 1,
          alignSelf: 'center',
          marginTop: responsiveHeight(2),

          // backgroundColor: 'red',
        }}
        ListFooterComponent={() => {
          return <View style={{paddingBottom: responsiveHeight(2)}}></View>;
        }}
      />
      <View style={styles.txtinputview}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.emojicontainer}
          onPress={async () => {
            await Keyboard.dismiss();
            await setStateemoji(!stateemoji);
          }}>
          <Image source={appImages.emojiicon} style={styles.emojistyle} />
        </TouchableOpacity>
        <TextInput
          onFocus={() => {
            // messagesRef.current?.scrollToIndex({
            //   index: messages.length - 1,
            // });
            setStateemoji(false);
          }}
          multiline={true}
          onSelectionChange={event => {
            console.log(
              'SELECTION CHANGE============',
              event.nativeEvent.selection,
              setCurrentposition(event.nativeEvent.selection.end),
            );
          }}
          style={styles.txtinputstyle}
          placeholder={'Message ...'}
          placeholderTextColor={'#fff'}
          value={messageinput}
          onChangeText={text => setMessageinput(text)}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.sendcontainer}
          onPress={async () => {
            showDialog();
          }}>
          <Image source={appImages.camerawhite} style={styles.emojistyle} />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={loading ? true : false}
          activeOpacity={0.8}
          style={styles.sendcontainer}
          onPress={async () => {
            if (messageinput == null || messageinput == '') {
              null;
            } else {
              let thearr = [...messages];
              thearr.push({
                senderId: myidstate,
                receiverId: receiveridstate,
                text: messageinput,
                chatId: mychatid,
                msg_type: 'text',
              });
              setMessages(thearr);
              socket.current.emit('send-message', {
                senderId: myidstate,
                receiverId: receiveridstate,
                text: messageinput,
                chatId: mychatid,
                msg_type: 'text',
              });
              setMessageinput('');
              // let myarr = [...messages];
              // await myarr.push({
              //   user: 0,
              //   time: '12:31',
              //   content: messageinput,
              // });
              // await setMessages(myarr);
            }
          }}>
          <Image source={appImages.sendicon} style={styles.sendiconstyle} />
        </TouchableOpacity>
      </View>
      {stateemoji == true ? (
        <View
          style={{
            backgroundColor: appColor.appColorMain,
          }}>
          <Picker
            color={appColor.appColorMain}
            emojiSize={responsiveFontSize(5)}
            onSelect={item => {
              setMessageinput(
                [
                  messageinput.slice(0, currentposition),
                  item.native,
                  messageinput.slice(currentposition),
                ].join(''),
              );
              //   messagesRef.current?.scrollToIndex({
              //     index: messages.length - 1,
              //   });
            }}
          />
        </View>
      ) : null}
      <Dialog.Container
        visible={visible}
        verticalButtons={true}
        onRequestClose={() => handleCancel()}>
        <Dialog.Title
          style={{
            
            alignSelf: 'center',
            color: '#FF0047',
          }}>
          Upload Photos Or Videos
        </Dialog.Title>
        {/* <Dialog.Description>
            Take a photo or choose from your library
          </Dialog.Description> */}
        <Dialog.Button
          style={{
            
            alignSelf: 'center',
            backgroundColor:"#FF0047",
            borderRadius:20,
            width: responsiveWidth(54)
          }}
          label="Take a Photo"
          onPress={() => {
            imageTakeFromCamera();
            handleCancel();
          }}
          //color={appColor.appColorMain}
          color="#fff"
        />
        <Dialog.Button
          style={{
            
            alignSelf: 'center',
            backgroundColor:"#FF0047",
            borderRadius:20,
            marginTop:responsiveHeight(1),
            width: responsiveWidth(54)
          }}
          label="Choose from Gallery"
          onPress={() => {
            imageTakeFromGallery();
            handleCancel();
          }}
          //color={appColor.appColorMain}
          color="#fff"
        />
        <Dialog.Button
          style={{
            
            alignSelf: 'center',
            backgroundColor:"#FF0047",
            borderRadius:20,
            marginTop:responsiveHeight(1),
            width: responsiveWidth(54)
          }}
          label="Cancel"
          onPress={handleCancel}
          //color={appColor.appColorMain}
          color="#fff"
        />
      </Dialog.Container>
      <ImageView
        images={images}
        imageIndex={0}
        visible={imagevisible}
        onRequestClose={() => setImagevisible(false)}
      />
      <RBSheet
        ref={refContainer}
        openDuration={250}
        animationType="fade"
        customStyles={{
          container: {
            // height: responsiveHeight(50),
            borderTopRightRadius: responsiveWidth(7),
            borderTopLeftRadius: responsiveWidth(7),
          },
        }}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <Image
            source={appImages.alert}
            style={{
              width: responsiveWidth(18),
              height: responsiveWidth(18),
              alignSelf: 'center',
              marginTop: responsiveHeight(2.8),
            }}
          />
          <View>
            <Text
              style={{
                alignSelf: 'center',
                color: appColor.appColorMain,
                
                fontSize: responsiveFontSize(2.3),
                textAlign: 'center',
                width: responsiveWidth(90),
                marginBottom: responsiveHeight(1.5),
              }}>
              Delete message
            </Text>
            <Text
              style={{
                alignSelf: 'center',
                color: appColor.appColorMain,
                
                fontSize: responsiveFontSize(1.8),
                textAlign: 'center',
                width: responsiveWidth(90),
                marginBottom: responsiveHeight(2),
              }}>
              Are you Sure you wanna Delete this sms?
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: responsiveHeight(2.8),
              justifyContent: 'space-between',
              width: responsiveWidth(82),
              alignSelf: 'center',
            }}>
            <MyButton
              myStyles={{
                width: responsiveWidth(39),
                backgroundColor: appColor.appColorMain,
              }}
              title={'Yes'}
              itsTextstyle={{
                color: '#fff',
              }}
              onPress={() => {
                let arr = [...messages];
                arr.splice(myindex, 1);
                console.log(arr);
                setMessages([...arr]);
                refContainer.current.close();
                DeleteMsg();
              }}
            />
            <MyButton
              myStyles={{
                width: responsiveWidth(39),
                backgroundColor: appColor.appColorMain,
              }}
              title={'No'}
              itsTextstyle={{
                color: '#fff',
              }}
              onPress={() => refContainer.current.close()}
            />
          </View>
        </ScrollView>
      </RBSheet>
    </SafeAreaView>
  );
};

export default Messaging;

const styles = StyleSheet.create({
  txt1: {
    
    color: appColor.appColorMain,
    fontSize: responsiveFontSize(2.6),
  },
  txt2: {
    
    color: appColor.appColorMain,
    fontSize: responsiveFontSize(2.1),
    marginTop: responsiveHeight(0.4),
  },
  sendcontainer: {
    backgroundColor: '#fff',
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(100),
  },
  sendiconstyle: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    marginRight: responsiveWidth(1),
    resizeMode: 'contain',
  },
  emojicontainer: {
    backgroundColor: '#FF2461',
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(100),
  },
  emojistyle: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    // marginRight: responsiveWidth(0.7),
    resizeMode: 'contain',
  },
  emojipickerview: {},
  txtemoji: {
    fontSize: responsiveFontSize(2.9),
    color: '#fff',
    // 
  },
  rightmessage: {
    backgroundColor: appColor.appColorMain,
    paddingHorizontal: responsiveWidth(4),
    borderRadius: responsiveWidth(3),
    borderBottomRightRadius: responsiveWidth(3),
    borderTopRightRadius: responsiveWidth(3),
    alignSelf: 'flex-end',
    paddingVertical: responsiveHeight(1.6),
    marginBottom: responsiveHeight(1.5),
  },
  leftmessage: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.6),
    borderRadius: responsiveWidth(3),
    borderBottomRightRadius: responsiveWidth(3),
    borderTopRightRadius: responsiveWidth(3),
    alignSelf: 'flex-start',
    marginBottom: responsiveHeight(1.5),
  },
  rightcontent: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(1.5),
    width: responsiveWidth(60.5),
    height: responsiveWidth(72.5),
    borderRadius: responsiveWidth(3),
    backgroundColor: appColor.appColorMain,
    overflow: 'hidden',
  },
  leftcontent: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(1.5),
    width: responsiveWidth(60.5),
    height: responsiveWidth(72.5),
    borderRadius: responsiveWidth(3),
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  righttxt: {
    color: '#fff',
    
    fontSize: responsiveFontSize(2),
  },
  lefttxt: {
    color: '#000',
    opacity: 0.6,
    
    fontSize: responsiveFontSize(2),
  },
  txtinputview: {
    backgroundColor: appColor.appColorMain,
    alignItems: 'center',
    width: responsiveWidth(100),
    paddingVertical: responsiveHeight(1.3),
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(2.5),
  },
  txtinputstyle: {
    // backgroundColor: 'red',
    width: responsiveWidth(53),
    
    color: '#fff',
    fontSize: responsiveFontSize(2),
    maxHeight: responsiveHeight(20),
  },
});
