import React from 'react';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components'

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import theme from './src/global/styles/theme'

import { AuthProvider } from './src/hooks/auth'

import { NavigationContainer } from '@react-navigation/native'
import { AppRoutes } from './src/routes/app.routes';

import { SignIn } from './src/screens/SignIn';
import { Dashboard } from './src/screens/Dashboard';
import { Register } from './src/screens/Register';
import { CategorySelect } from './src/screens/CategorySelect';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  }) 

  if(!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <StatusBar 
          barStyle="light-content" 
        />
        <AuthProvider>
          <SignIn />
        </AuthProvider>

      </NavigationContainer>
    </ThemeProvider>
  )
}