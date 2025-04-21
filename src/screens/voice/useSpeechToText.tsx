import {
  NativeEventEmitter,
  NativeModules,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';

interface SpeechListenerEvents {
  isPermissionGranted: boolean;
  handleOnPartialResult(event: {partial: any}): void;
  handleOnFinalResult(event: {result: any}): void;
  handleError(event: any): void;
}

const useSpeechToText = ({
  handleError,
  handleOnFinalResult,
  handleOnPartialResult,
  isPermissionGranted = false,
}: SpeechListenerEvents) => {
  useEffect(() => {
    if (isPermissionGranted) {
      const eventEmitter = new NativeEventEmitter(
        NativeModules.NativeSpeechToText,
      );
      const partialListener = eventEmitter.addListener(
        'onSpeechPartialResults',
        handleOnPartialResult,
      );

      const finalListener = eventEmitter.addListener(
        'onSpeechResults',
        handleOnFinalResult,
      );

      const errorListener = eventEmitter.addListener(
        'onSpeechError',
        handleError,
      );

      return () => {
        partialListener.remove();
        finalListener.remove();
        errorListener.remove();
      };
    }
  }, [isPermissionGranted, handleOnFinalResult]);

  return;
};

export default useSpeechToText;

const styles = StyleSheet.create({});
