import { getExploreName } from '../utils/platform';

export const devConfig = {
  sdkKey: process.env.REACT_APP_SDK_KEY,
  sdkSecret: process.env.REACT_APP_SDK_SECRET,
  topic: 'Meeting1023',
  name: `${getExploreName()}-${Math.floor(Math.random() * 1000)}`,
  password: '123',
  signature: '',
};
