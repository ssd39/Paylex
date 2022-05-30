/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './Screens/Splash';
import NewLogin from './Screens/NewLogin';
import Home from './Screens/Home';
import TopUp from './Screens/TopUp';
import ScanQR from './Screens/ScanQR';
import SwipePay from './Screens/SwipePay';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
const Stack = createNativeStackNavigator();
const forFade = ({ current, closing }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});
const App = () => {
  return (
   
    <NavigationContainer style={{backgroundColor:'black'}}>
      <ApplicationProvider {...eva} theme={eva.dark}>

      <Stack.Navigator screenOptions={{headerShown: false, animation:'none' }}    
>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
        />
          <Stack.Screen
          name="NewLogin"
          component={NewLogin}
        />
 <Stack.Screen
          name="Home"
          component={Home}
        />
         <Stack.Screen
          name="TopUp"
          component={TopUp}
        />
         <Stack.Screen
          name="ScanQR"
          component={ScanQR}
        />
        <Stack.Screen
          name="SwipePay"
          component={SwipePay}
        />
      </Stack.Navigator>
      </ApplicationProvider>

    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: 'black',
    flex:1
  }
});

export default App;
