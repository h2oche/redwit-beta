import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer, createStackNavigator, createSwitchNavigator} from "react-navigation";

import CompleteScreen from "./src/screens/CompleteScreen";
import DocumentListScreen from "./src/screens/DocumentListScreen";
import DocumentViewerScreen from "./src/screens/DocumentViewerScreen";
import LoginScreen from "./src/screens/LoginScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import PhotoScreen from './src/screens/PhotoScreen';

var MainNavigator = createStackNavigator({
  DocumentList: DocumentListScreen,
  DocumentViewer: DocumentViewerScreen,
  Photo: PhotoScreen,
});

export default createAppContainer(createSwitchNavigator(
  {
    Complete: CompleteScreen,
    Loading: LoadingScreen,
    App: createAppContainer(MainNavigator),
    Auth: LoginScreen,
  },
  {
    initialRouteName: 'Loading',
  }
));