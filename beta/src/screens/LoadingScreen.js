import React, { Component } from 'react'
import { Text, View, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native'

export class LoadingScreen extends Component {
  componentDidMount() {
    (async() => {
      const user = await AsyncStorage.getItem("REDWIT.user");
      this.props.navigation.navigate(user ? "App" : "Auth");
      // this.props.navigation.navigate("Complete");
    })();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default LoadingScreen
