import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  View,
} from 'react-native';

import FontAwesome from '@react-native-vector-icons/fontawesome6';
import {moderateScale} from '../../configs/ScalingSize';

interface CustomButtonProps {
  title: string;
  color: string;
  icon: 'pause' | 'play' | 'book-open-reader' | 'arrow-right';
  type?: 'fill' | 'outline';
}
const CustomButton = ({
  title = 'Start',
  color,
  icon = 'play',
  type = 'fill',
  disabled,
  ...props
}: CustomButtonProps & TouchableOpacityProps) => {
  const colors = {
    bgColor: type === 'fill' ? color : 'white',
    textColor: type === 'fill' ? 'white' : color,
  };
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: colors.bgColor,
          borderColor: colors.textColor,
          opacity: disabled ? 0.3 : 1,
          borderWidth: type === 'fill' ? 0 : 2,
        },
      ]}
      {...props}>
      <View style={{paddingRight: 10}}>
        <FontAwesome
          name={icon}
          iconStyle="solid"
          color={colors.textColor}
          size={moderateScale(20)}
        />
      </View>
      <Text style={[styles.text, {color: colors.textColor}]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 200,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    flexDirection: 'row',
    marginVertical: 10,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
