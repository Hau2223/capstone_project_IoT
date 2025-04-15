import React, {useEffect} from 'react';
import Navigator from './src/Navigator';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '588521441612-1pjvhkki7p97tpp3il21h1bcues1cvkq.apps.googleusercontent.com',
    });
  }, []);
  
  return (
    <>
      <Navigator />
    </>
  );
}
