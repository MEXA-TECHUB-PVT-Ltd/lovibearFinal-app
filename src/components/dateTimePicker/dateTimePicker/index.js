import {Text, TouchableOpacity, TextInput, Image} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
// import { buttonColor, textColor } from '../../constants/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {styles} from './style';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {fontFamily} from '../../../constants/fonts';
import {Icon} from 'react-native-elements';
import {appColor, appImages} from '../../../assets/utilities';
const DateSelect = props => {
  const {iconStyle, labelstyle} = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(
    props.isVisible || false,
  );
  const [date, setDate] = useState('');
  useEffect(() => {
    setDate(props.initialDate);
  }, [props]);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDatePickerVisibility(false);
    setDate(moment(date).format('DD-MM-YYYY'));
    props.getDate(moment(date).format('DD-MM-YYYY'));
    props.getApiDate(moment(date).format('MM-DD-YYYY'));
  };
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        props.style,
        {
          borderRadius: responsiveWidth(3),
          borderWidth: responsiveWidth(0.3),
          borderColor:
            isDatePickerVisible == false ? '#D7D7D7' : appColor.appColorMain,
          marginTop: responsiveHeight(2.8),
          paddingVertical: responsiveHeight(0.9),
          flexDirection: 'row',
          alignItems: 'center',
          width: responsiveWidth(85),
          alignSelf: 'center',
        },
      ]}
      onPress={showDatePicker}>
      <DateTimePickerModal
        isVisible={props.isVisible || isDatePickerVisible}
        mode="date"
        // date={new Date()}
        // value={date}
        maximumDate={new Date()}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        pickerContainerStyleIOS={{}}
        display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
        ref={props.ref}
      />
      <Image
        source={appImages.dateicon}
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
        selectionColor={'#FF0047'}
        placeholder="Date of Birth"
        placeholderTextColor={'#8D8D8D'}
        style={{
          width: responsiveWidth(70),
          paddingLeft: responsiveWidth(3),
          color: '#080808',
          
          fontSize: responsiveFontSize(1.95),
        }}
        defaultValue={props.value}
      />
      {console.log(isDatePickerVisible)}
      {/* {console.log(Myvar)} */}
    </TouchableOpacity>
  );
};
const TimeSelect = props => {
  const {iconStyle, TextStyle} = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState('');
  useEffect(() => {
    setDate(props.initialDate);
  }, [props]);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDate(moment(date).format('hh:mm A'));
    props.getDate(moment(date).format('hh:mm A'));
    hideDatePicker();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.dataPickerContainer}
      onPress={showDatePicker}>
      <Text style={TextStyle}>{date != '' ? date : props.placeHolder}</Text>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        // date={new Date()}
        // value={date}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        pickerContainerStyleIOS={{}}
        display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
      />
    </TouchableOpacity>
  );
};

export {DateSelect, TimeSelect};
