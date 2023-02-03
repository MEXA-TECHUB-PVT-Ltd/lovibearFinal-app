import {
  PlayScreen,
  Post,
  Discover,
  Notifications,
  ChatList,
  Messaging,
  Settings,
  Search,
  EditProfile,
  AddPhoto,
  SubscribeInApp,
  Bingo,
  VideoScreen,
  UpdatePasswordInApp,
  ImageChecker,
  ViewMatchProfile,

} from '../../screens';
import Images from '../../screens/Appflow/Post/Images';
import {appColor, appImages} from '../../assets/utilities';
import {StyleSheet, View, Text, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {fontFamily} from '../../constants/fonts';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const styles = StyleSheet.create({
  imgstyle: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    // backgroundColor: 'red',
  },
  imgstyle2: {
    width: responsiveWidth(7),
    height: responsiveWidth(7),
    // backgroundColor: 'red',
  },
  imgstylebig: {
    width: responsiveWidth(13),
    height: responsiveWidth(13),
  },
  myshadow: {
    shadowColor: appColor.appColorMain,
    backgroundColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 5,
    width: responsiveWidth(13),
    height: responsiveWidth(13),
    borderRadius: responsiveWidth(100),
  },
});

const AppStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const PlayScreenTabStack = createStackNavigator();
const NotificationsTabStack = createStackNavigator();
const DiscoverTabStack = createStackNavigator();
const ChatListTabStack = createStackNavigator();
const PostTabStack = createStackNavigator();

const PlayScreenTab = () => {
  return (
    <PlayScreenTabStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'PlayScreen'}>
      <PlayScreenTabStack.Screen name={'PlayScreen'} component={PlayScreen} />
    </PlayScreenTabStack.Navigator>
  );
};
const NotificationsTab = () => {
  return (
    <NotificationsTabStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'Notifications'}>
      <NotificationsTabStack.Screen
        name={'Notifications'}
        component={Notifications}
      />
    </NotificationsTabStack.Navigator>
  );
};
const DiscoverTab = () => {
  return (
    <DiscoverTabStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'Discover'}>
      <DiscoverTabStack.Screen name={'Discover'} component={Discover} />
    </DiscoverTabStack.Navigator>
  );
};
const ChatListTab = () => {
  return (
    <ChatListTabStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'ChatList'}>
      <ChatListTabStack.Screen name={'ChatList'} component={ChatList} />
    </ChatListTabStack.Navigator>
  );
};
const PostTab = () => {
  return (
    <PostTabStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'Post'}>
      <PostTabStack.Screen name={'Post'} component={Post} />
    </PostTabStack.Navigator>
  );
};

const MyTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: responsiveHeight(9.5),

          paddingHorizontal: responsiveWidth(1),
          // position: 'absolute',
          // position: 'absolute',
          // borderTopColor: 'lightgray',
        },
      }}>
      <Tab.Screen
        name="PlayScreenScreens"
        component={PlayScreenTab}
        // initialParams={{
        //   fromRoute: 'default',
        //   cardDetail: 'default',
        // }}
        options={{
          // unmountOnBlur: true,
          tabBarIcon: ({focused}) => (
            <View>
              {focused ? (
                <View style={styles.myshadow}>
                  <Image
                    source={appImages.playfocused}
                    style={styles.imgstylebig}
                    resizeMode={'contain'}
                  />
                </View>
              ) : (
                <Image
                  source={appImages.play}
                  style={styles.imgstyle2}
                  resizeMode={'contain'}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ChatListScreens"
        component={ChatListTab}
        options={{
          // unmountOnBlur: true,
          tabBarIcon: ({focused}) => (
            <View>
              {focused ? (
                <View style={styles.myshadow}>
                  <Image
                    source={appImages.chatfocused}
                    style={styles.imgstylebig}
                    resizeMode={'contain'}
                  />
                </View>
              ) : (
                <Image
                  source={appImages.chat}
                  style={styles.imgstyle}
                  resizeMode={'contain'}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="DiscoverScreens"
        component={DiscoverTab}
        options={{
          // unmountOnBlur: true,
          tabBarIcon: ({focused}) => (
            <View>
              {focused ? (
                <View style={styles.myshadow}>
                  <Image
                    source={appImages.discoverfocused}
                    style={styles.imgstylebig}
                    resizeMode={'contain'}
                  />
                </View>
              ) : (
                <Image
                  source={appImages.discover}
                  style={styles.imgstyle}
                  resizeMode={'contain'}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="NotificationsScreens"
        component={NotificationsTab}
        options={{
          // unmountOnBlur: true,
          tabBarIcon: ({focused}) => (
            <View>
              {focused ? (
                <View style={styles.myshadow}>
                  <Image
                    source={appImages.notificationsfocused}
                    style={styles.imgstylebig}
                    resizeMode={'contain'}
                  />
                </View>
              ) : (
                <Image
                  source={appImages.notifications}
                  style={styles.imgstyle}
                  resizeMode={'contain'}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="PostScreens"
        component={PostTab}
        options={{
          // unmountOnBlur: true,
          tabBarIcon: ({focused}) => (
            <View>
              {focused ? (
                <View style={styles.myshadow}>
                  <Image
                    source={appImages.postfocused}
                    style={styles.imgstylebig}
                    resizeMode={'contain'}
                  />
                </View>
              ) : (
                <Image
                  source={appImages.post}
                  style={styles.imgstyle2}
                  resizeMode={'contain'}
                />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <AppStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'MyTabs'}>
      <AppStack.Screen name={'MyTabs'} component={MyTabs} />
      <AppStack.Screen name={'ImageChecker'} component={ImageChecker} />
      <AppStack.Screen name={'Messaging'} component={Messaging} />
      <AppStack.Screen name={'Settings'} component={Settings} />
      <AppStack.Screen name={'Search'} component={Search} />
      <AppStack.Screen name={'EditProfile'} component={EditProfile} />
      <AppStack.Screen name={'AddPhoto'} component={AddPhoto} />
      <AppStack.Screen name={'SubscribeInApp'} component={SubscribeInApp} />
      <AppStack.Screen name={'Bingo'} component={Bingo} />
      <AppStack.Screen name={'VideoScreen'} component={VideoScreen} />
      <AppStack.Screen
        name={'UpdatePasswordInApp'}
        component={UpdatePasswordInApp}
      />
      <AppStack.Screen name={'ViewMatchProfile'} component={ViewMatchProfile} />
      <AppStack.Screen name={'Images'} component={Images} />
    </AppStack.Navigator>
  );
};

export default App;
