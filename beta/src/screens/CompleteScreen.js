import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import Loading from "../components/Loading";

export class CompleteScreen extends Component {

  state = {
    showLoadingModal: true,
    size: 0,
    createdAt: new Date(),
  }

  componentDidMount() {
    const {navigation} = this.props;
    const size = navigation.getParam('size');
    const createdAt = navigation.getParam('createdAt');
    this.setState({showLoadingModal: false,size, createdAt});
  }

  formatDate = (_timestamp) => {
    var d = new Date(_timestamp);

    var fill2 = (_num) => {
      _num += "";
      if(_num.length < 2) _num = "0" + _num;
      return _num;
    }

    return `${d.getFullYear()}/${fill2(d.getMonth()+1)}/${fill2(d.getDate())},` +
      `${fill2(d.getHours())}:${fill2(d.getMinutes())}:${fill2(d.getSeconds())}`;
  }

  formatSize = (_size) =>{
    return `${Math.floor(_size * 100 / 1024 / 1024) / 100}`;
  }

  onConfirmPress = () => {
    /* just go back to app main page */
    this.props.navigation.navigate("App");
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          onRequestClose={()=>{}}
          transparent={false}
          visible={this.state.showLoadingModal}>
          <Loading loadingText="연구노트 시점을 등록중입니다.."/>
        </Modal>

        <View style={styles.contentContainer}>
          <Image source={require("../../assets/178.png")}/>
          <Text style={styles.completeText}>연구노트 등록 완료!</Text>
          <Text>{this.formatSize(this.state.size)}MB</Text>
          <Text>{this.formatDate(this.state.createdAt)}</Text>
          <TouchableOpacity style={styles.confirmBtn} onPress={this.onConfirmPress}>
            <Text style={styles.confirmBtnText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgb(236, 240, 241)'
  },
  contentContainer: {
    width: 300,
    height: 270,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  completeText: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 20,
  },
  confirmBtn: {
    marginTop: 20,
    backgroundColor: 'rgb(22,172,143)',
    justifyContent: "center",
    alignItems: "center",
    width: 270,
    height: 40,
  },
  confirmBtnText: {
    color: 'white',
    fontWeight: "bold",
    fontSize: 16
  }
});

export default CompleteScreen
