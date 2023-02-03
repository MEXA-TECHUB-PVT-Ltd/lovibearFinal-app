
import React, { Component,useState
 } from "react";
import { StyleSheet, Text, View,Image,TouchableOpacity } from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import {
    responsiveWidth,
    responsiveFontSize,
    responsiveHeight,
  } from 'react-native-responsive-dimensions';
import {appColor, appImages} from '../../../assets/utilities';
import { useNavigation } from '@react-navigation/native';
const Images= () => { 
    const navigation = useNavigation();
      const [first, setfirst] = useState(global.images)
      return (
        <View  style={{flex:1,}}>
            <TouchableOpacity onPress={ ()=>navigation.goBack()} >
         <Image
                  source={appImages.crossphoto}
                  style={{
                    width: responsiveWidth(5.3),
                    height: responsiveWidth(5.3),
                    marginTop: responsiveHeight(2),
                    marginLeft:responsiveWidth(90),
                    
                  }}
                />
                </TouchableOpacity>
                <View style={{justifyContent:"center",backgroundColor:"#ffffff",marginTop:180}}>
      <SliderBox
    resizeMode='stretch'
    images={first}
    sliderBoxHeight={300}
    //onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
    dotColor="#FF0047"
    autoplay
    circleLoop
    inactiveDotColor="#ffffff"
    dotStyle={{
      width: 15,
      height: 15,
      borderRadius: 15,
      marginHorizontal: 10,
      padding: 0,
      margin: 0
    }}
  />
  </View>
        </View>
      );
};
export default Images;
