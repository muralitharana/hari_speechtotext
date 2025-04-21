import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();

export function getMMKVToken() {
  return storage.getString('token');
}

export function setMMKVToken(token: string | number | boolean | ArrayBuffer) {
  storage.set('token', token);
}
