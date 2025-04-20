import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

// Define a type for your TurboModule
export interface Spec extends TurboModule {
  startListeningSpeech(): void;
  stopListeningSpeech(): void;
}

// Register the TurboModule with the codegen system
export default TurboModuleRegistry.getEnforcing<Spec>('NativeSpeechToText');
