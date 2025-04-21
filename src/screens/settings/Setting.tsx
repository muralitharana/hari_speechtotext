import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../configs/Colors';
import {verticalScale} from '../../configs/ScalingSize';
import Button from '../../components/Button';
import {Fonts} from '../../configs/Fonts';
import BackButton from '../../components/BackButton';
import useBackHandler from '../../hooks/useBackHandler';
import {getMMKVToken, setMMKVToken} from '../../utils/mmkvStorage';

const Setting = () => {
  const [apiToken, setApiToken] = useState('');

  useEffect(() => {
    const token = getMMKVToken();
    if (token) {
      setApiToken(token);
    }
  }, []);

  async function handleSave() {
    setMMKVToken(apiToken);
    Keyboard.dismiss();
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        padding: 10,
      }}>
      <View
        style={{
          height: verticalScale(50),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <BackButton
          color="black"
          onPress={useBackHandler().getBackToThePreviousScreen}
        />
        <Text style={{fontFamily: Fonts.fontSemiBold, fontSize: 24}}>
          Settings
        </Text>
      </View>
      <View style={{flex: 1, padding: 10}}>
        <View
          style={{
            borderWidth: 2,
            borderColor: Colors.black,
            borderRadius: 5,
            marginBottom: 40,
          }}>
          <TextInput
            placeholder="Enter the token"
            style={{height: verticalScale(40), color: Colors.black}}
            value={apiToken}
            onChangeText={text => setApiToken(text)}
          />
        </View>
        <Button
          title="Save"
          buttonColor="black"
          buttonStyles={{borderRadius: 10}}
          onPress={handleSave}
        />
      </View>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({});
