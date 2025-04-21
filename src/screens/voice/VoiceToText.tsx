import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';

import NativeSpeechToText from '../../../specs/NativeSpeechToText'; // TurboModule interface
import useSpeechToText from './useSpeechToText';
import CustomButton from './CustomButton';

import {Fonts} from '../../configs/Fonts';
import {Colors} from '../../configs/Colors';
import FontAwesome from '@react-native-vector-icons/fontawesome6';
import {moderateScale} from '../../configs/ScalingSize';
import {useNavigation} from '@react-navigation/native';
import {SCREENS} from '../../navigations/utils';
import stringSimilarity from 'string-similarity';
import {PRACTICE_SENTENCES} from './constants';

// ------------------------
// Feedback Tag Helper
// ------------------------
const getFeedbackTag = (score: number | string) => {
  const numericScore = typeof score === 'string' ? parseFloat(score) : score;

  if (isNaN(numericScore)) return '';

  if (numericScore > 5) return '😮 Wow, that was amazing!';
  if (numericScore >= 4) return '🔥 Great!';
  if (numericScore >= 3) return '💡 Needs Improvement';
  return '🗣️ Please keep practicing!';
};

const VoiceToText = () => {
  const navigation = useNavigation();

  const [partialResult, setPartialResult] = useState<string | null>(null);
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isGetStarted, setGetStarted] = useState(false);

  const initialState = {
    isLoading: false,
    text: '',
    score: '',
  };

  const [generatedWordString, setGeneratedString] = useState(initialState);

  const handleFinalResult = useCallback(
    (event: {result: React.SetStateAction<string | null>}) => {
      const result = String(event.result).toLowerCase();
      const target = generatedWordString.text.toLowerCase();
      console.log({result, target});
      setFinalResult(event.result);
      setIsListening(false); // Auto-stop UI toggle
      const score = stringSimilarity.compareTwoStrings(target, result);
      setGeneratedString(prev => ({
        ...prev,
        score: ((score * 10) / 2).toFixed(2),
      }));
    },
    [generatedWordString.text],
  );

  useSpeechToText({
    handleOnPartialResult(event) {
      setPartialResult(event.partial);
      console.log('Partial:', event.partial);
    },
    handleOnFinalResult: handleFinalResult,
    handleError(event) {
      console.error('Speech error:', event);
      setIsListening(false);
    },
    isPermissionGranted,
  });

  const startListening = () => {
    request(PERMISSIONS.ANDROID.RECORD_AUDIO).then(status => {
      console.log(status);
      setIsPermissionGranted(true);
      NativeSpeechToText.startListeningSpeech();
      setFinalResult(null);
      setPartialResult(null);
      setIsListening(true);
      setGeneratedString(prev => ({...prev, score: ''}));
    });
  };

  const stopListening = () => {
    NativeSpeechToText.stopListeningSpeech();
    setIsListening(false);
  };

  const handleGenerateString = async () => {
    setGeneratedString(prev => ({...prev, isLoading: true, score: ''}));

    const randomSentence =
      PRACTICE_SENTENCES[Math.floor(Math.random() * PRACTICE_SENTENCES.length)];

    await new Promise(resolve => setTimeout(resolve, 2000));

    setGeneratedString(prev => ({
      ...prev,
      isLoading: false,
      text: randomSentence,
      score: '',
    }));
    setFinalResult('');
    setPartialResult('');
  };

  function handleSetting() {
    navigation.navigate(SCREENS.settings as never);
  }

  const renderContent = () => {
    const {text, score, isLoading} = generatedWordString;

    if (isGetStarted) {
      return (
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Score your speech</Text>
            {/* <TouchableOpacity onPress={handleSetting}>
              <FontAwesome
                name={'gear'}
                iconStyle="solid"
                color={'white'}
                size={moderateScale(20)}
              />
            </TouchableOpacity> */}
          </View>

          <View style={styles.promptBox}>
            {text && (
              <>
                <Text style={[styles.result, {fontSize: 14}]}>
                  Your target sentence
                </Text>
                <Text style={styles.result}>{text}</Text>
              </>
            )}
          </View>

          <View style={[styles.promptBox]}>
            {(finalResult || partialResult) && (
              <Text style={[styles.result, {color: Colors.primary}]}>
                {finalResult || partialResult}
              </Text>
            )}
          </View>

          {isLoading && (
            <View style={styles.loaderContainer}>
              <Image
                source={require('../../assets/images/loading.gif')}
                style={styles.loaderImage}
                resizeMode="cover"
              />
              <Text style={styles.loadingText}>Generating content</Text>
            </View>
          )}

          {!!score && (
            <View style={{alignItems: 'center', marginVertical: 20}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.scoreText}>{score}</Text>
                <Text style={{fontSize: 30, fontFamily: Fonts.fontSemiBold}}>
                  /5
                </Text>
              </View>
              <Text style={styles.feedbackText}>{getFeedbackTag(score)}</Text>
            </View>
          )}

          {isListening && (
            <View style={styles.loaderContainer}>
              <Image
                source={require('../../assets/images/voice.gif')}
                style={styles.loaderImage}
                resizeMode="cover"
              />
              <Text style={styles.loadingText}>Speak with confidence</Text>
            </View>
          )}

          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <CustomButton
              title="Generate"
              onPress={handleGenerateString}
              color="black"
              icon="book-open-reader"
            />
            <View
              style={{
                height: 1.5,
                width: 150,
                marginVertical: 20,
                backgroundColor: Colors.greyLight,
              }}
            />
            <CustomButton
              title="Start Speaking"
              onPress={startListening}
              disabled={isListening}
              color="black"
              icon="play"
              type="fill"
            />
            <CustomButton
              title="Stop Speaking"
              onPress={stopListening}
              disabled={!isListening}
              color="black"
              icon="pause"
              type="outline"
            />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.introContainer}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={[styles.title, {fontSize: 24}]}>
            Speak it. Score it. Improve it.
          </Text>
          <Image
            source={require('../../assets/images/banner.gif')}
            style={{height: 200}}
            resizeMode="cover"
          />
          <Text style={styles.introText}>
            Practice English speaking with instant AI feedback. Tap to get a
            random word or sentence, speak it out loud, and get a score from 0
            to 5 based on your pronunciation accuracy. Perfect for language
            learners, fluency seekers, and accent improvement!
          </Text>
        </View>

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <CustomButton
            title="Get Started"
            onPress={() => {
              setGetStarted(true);
            }}
            color="black"
            icon="arrow-right"
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <View style={styles.container}>{renderContent()}</View>
    </SafeAreaView>
  );
};

export default VoiceToText;

// ------------------------
// Styles
// ------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: 'black',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: Fonts.fontSemiBold,
    color: Colors.grey,
  },
  promptBox: {
    padding: 20,
    alignItems: 'flex-start',
    backgroundColor: Colors.greyExtraLight,
  },
  result: {
    fontSize: 20,
    marginTop: 5,
    fontWeight: '600',
    color: Colors.grey,
  },
  scoreText: {
    fontFamily: Fonts.fontBold,
    fontSize: 70,
    textAlign: 'center',
    marginRight: 5,
  },
  feedbackText: {
    fontSize: 18,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.primary,
    marginTop: 10,
    textAlign: 'center',
  },
  introContainer: {
    flex: 1,
  },
  introText: {
    fontFamily: Fonts.fontSemiBold,
    fontSize: 14,
    padding: 20,
    color: Colors.grey,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  loaderImage: {
    width: 100,
    height: 100,
  },
  loadingTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: Fonts.fontSemiBold,
  },
});
