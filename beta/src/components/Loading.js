import React, { Component } from 'react'
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native'

export class Loading extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text> {this.props.loadingText} </Text>
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
    backgroundColor: "rgba(236,240,241,1)"
  }
});


export default Loading
