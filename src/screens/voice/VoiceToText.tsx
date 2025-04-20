import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Button,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import NativeSpeechToText from '../../../specs/NativeSpeechToText'; // TurboModule interface

const VoiceToText = () => {
  const [partialResult, setPartialResult] = useState<string | null>(null);
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const eventEmitter = new NativeEventEmitter(NativeModules.NativeSpeechToText);

  useEffect(() => {
    const partialListener = eventEmitter.addListener(
      'onSpeechPartialResults',
      event => {
        setPartialResult(event.partial);
        console.log('Partial:', event.partial);
      },
    );

    const finalListener = eventEmitter.addListener('onSpeechResults', event => {
      setFinalResult(event.result);
      setIsListening(false); // auto-stop UI toggle
      console.log('Final:', event.result);
    });

    const errorListener = eventEmitter.addListener('onSpeechError', event => {
      console.error('Speech error:', event);
      setIsListening(false);
    });

    return () => {
      partialListener.remove();
      finalListener.remove();
      errorListener.remove();
    };
  }, []);

  function startListening() {
    NativeSpeechToText.startListeningSpeech();
    setFinalResult(null);
    setPartialResult(null);
    setIsListening(true);
  }

  function stopListening() {
    NativeSpeechToText.stopListeningSpeech();
    setIsListening(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎤 Speech to Text</Text>

      <Text style={styles.label}>Partial Result:</Text>
      <Text style={styles.result}>{partialResult ?? '...'}</Text>

      <Text style={styles.label}>Final Result:</Text>
      <Text style={styles.result}>{finalResult ?? 'No result yet'}</Text>

      <Button
        title="Start Listening"
        onPress={startListening}
        disabled={isListening}
      />
      <Button
        title="Stop Listening"
        onPress={stopListening}
        disabled={!isListening}
      />
    </SafeAreaView>
  );
};

export default VoiceToText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 15,
  },
  result: {
    fontSize: 20,
    marginTop: 5,
    fontWeight: '600',
    color: '#333',
  },
});
