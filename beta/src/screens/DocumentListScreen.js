import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, ScrollView, FlatList, TouchableHighlight, Modal, AsyncStorage, Alert } from 'react-native'
import DocumentListItem from '../components/DocumentListItem';
import Loading from "../components/Loading";
import fire from "../fire";

export class DocumentListScreen extends Component {
  static navigationOptions = {
    title: "ReDWIT 연구노트",
    headerStyle: {
      backgroundColor: 'rgb(52, 72, 94)',
    },
    headerTitleStyle: {
      fontWeight: 'bold',
      color: 'white',
      fontSize: 30
    },
  }

  state = {
    documents: [],
    showLoadingModal: true,
  }

  async componentDidMount() {
    const user = await AsyncStorage.getItem("REDWIT.user");
    const {id} = JSON.parse(user);

    const ref = fire.DB.ref("documents");
    const snapshot = await ref.orderByChild("userId").equalTo(id).once("value");
    const val = snapshot.val();

    let documents = [];
    for(let documentKey in val) documents.push(val[documentKey]);
    documents.forEach(_documentObj => _documentObj.key = _documentObj.id);
    documents.sort((_a, _b) => _b.createdAt - _a.createdAt);
    //sort documents
    this.setState({documents, showLoadingModal: false});
  }

  onAddPress = () => {
    this.props.navigation.navigate("Photo");
  }

  onDocumentItemPress = (_documentObj) => {
    this.props.navigation.navigate("DocumentViewer", {
      documentId: _documentObj.id,
      title: _documentObj.title,
    });
  }

  renderDocumentItem = ({item}) => {
    return <DocumentListItem onItemPress={this.onDocumentItemPress} key={item.id} data={item}/>;
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          transparent={false}
          visible={this.state.showLoadingModal}>
          <Loading loadingText="연구노트 데이터블 불러오고 있습니다.."/>
        </Modal>

        <ScrollView
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 10,
          }}>
          <FlatList
            data={this.state.documents}
            renderItem={this.renderDocumentItem}
            numColumns={3}/>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableHighlight style={styles.addBtn} onPress={this.onAddPress}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(236,240,241,1)",
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    width: "100%",
    bottom: 160,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    backgroundColor: "rgb(22, 172, 143)",
    justifyContent: "center",
    alignItems: "center",
    width:50,
    height: 50,
    borderRadius: 25,
  },
  addBtnText: {
    fontSize: 30,
    color: 'white',
    fontWeight: "bold",
  }
});

export default DocumentListScreen
