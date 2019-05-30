import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, TextInput, TouchableHighlight, ScrollView, Alert, AsyncStorage } from 'react-native';
import fire from "../fire";

export class LoginScreen extends Component {
  state = {code: ''}

  onConfirmPress = () => {
    fire.DB.ref('users/' + this.state.code).once("value", (_snapshot) => {
      const val = _snapshot.val();
      if(!val) Alert.alert("잘못된 코드입니다.");
      else {
        // Alert.alert(JSON.stringify(val));
        AsyncStorage.setItem("REDWIT.user", JSON.stringify(val))
        .then(_val => {
          Alert.alert("베타테스트에 참가해주셔서 감사합니다!");
          this.props.navigation.navigate('App');
        }); 
      }
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.label}>쉽고 빠른 연구노트</Text>
          <Text style={styles.label}>ReDWit</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>코드를 입력하세요</Text>
          <TextInput style={styles.code} onChangeText={code => this.setState({code})}/>
          <TouchableHighlight style={styles.confirmBtn} onPress={this.onConfirmPress}>
            <Text style={styles.confirmText}>확인</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(236,240,241,1)"
  },
  header : {
    marginTop: 150,
    marginBottom: 100, 
  },
  content: {
    alignItems: "center"
  },  
  label: {
    fontSize: 30,
    lineHeight: 34,
    textAlign: "center"
  },
  code: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: "left",
    color: "rgb(38, 153, 251)",
    marginTop: 20,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: "rgb(22, 172, 143)",
    width: 300, 
    padding: 10
  },
  confirmBtn: {
    width: 150,
    height: 48,
    marginTop: 10,
    backgroundColor: "rgb(22, 172, 143)",
    justifyContent: "center",
    alignItems: "center"
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default LoginScreen
