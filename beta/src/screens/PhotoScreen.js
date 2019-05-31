import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, Button, AsyncStorage, Modal, ActivityIndicator} from 'react-native';
import { Camera, Permissions, FileSystem } from 'expo';
// import RNFetchBlob from 'react-native-fetch-blob';
// import RNfs from 'react-native-fs';
import fire from "../fire";
import Loading from "../components/Loading";

const DisplayStatus = {
  LOADING: "Loading camera",
  ENABLED: "Camera enabled",
  DISABLED: "Camera disabled",
  UPLOADING: "Uploading data"
};

export class PhotoScreen extends Component {
  static navigationOptions = ({navigation}) => {
    var action = navigation.getParam('onComplete');
    if (!action) {
      action = () => { console.log("Button is not active yet"); }
    }
    return {
      headerRight: (
        <Button
          onPress={ action }
          title="완료"
        />
      ),
    }
  }

  getFommatedDate = () => {
    var d = new Date();
    var month = (d.getMonth() + 1) + "";
    if(month.length < 2) month = "0" + month;
    var day = d.getDate() + "";
    if(day.length < 2) day = "0" + day;
    return `${d.getFullYear()}${month}${day}`
  }

  state = {
    type: Camera.Constants.Type.back,
    displayStatus: DisplayStatus.LOADING,
  };

  camera = null;
  uri = "";
  newPhotos = [];

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.props.navigation.setParams({onComplete: this.onComplete});
    if (status === 'granted') {
      this.setState({ displayStatus: DisplayStatus.ENABLED });
    } else {
      this.setState({ displayStatus: DisplayStatus.DISABLED });
    }
  }

  onComplete = async () => {
    if(this.newPhotos.length == 0) {
      Alert.alert("최소 1개 이상의 이미지를 촬영해주세요");
      return;
    }

    const user = await AsyncStorage.getItem("REDWIT.user");
    const {id} = JSON.parse(user);

    /* TODO
    0. show loading screen
    1. upload photos to firebase(retrieve url) - done
    + before upload apply image filter to photo(ContrastKey:7, SaturationKey: 1, BrightnessKey : 1.2)
    2. create new document item - done
    3. create new photo items - done
    4. navigate to complete screen - done */

    this.setState({ displayStatus: DisplayStatus.UPLOADING });

    var updates = {};
    /* create key for new document item */
    const newDocumentKey = (await fire.DB.ref("documents").push()).key;

    /* create new photo item */
    var thumbnailURL = null;

    this.newPhotos.forEach( async (_photoObj, _index) => {
      const newPhotoKey = (await fire.DB.ref("photos").push()).key;

      let response = await fetch(_photoObj.uri);
      // HTTP header is sent, HTTP response header is received, but the payload is not received yet.
      let blob = await response.blob();

      const ref = fire.Storage.ref().child(`${id}/${this.getFommatedDate()}/${newDocumentKey}/[${_index+1}]${newPhotoKey}.jpg`);
      await ref.put(blob);
      blob.close();
      const imageURL = await ref.getDownloadURL();

      if(thumbnailURL == null)
        thumbnailURL = imageURL;

      updates["photos/" + newPhotoKey] = {
        id: newPhotoKey,
        documentId : newDocumentKey,
        image_url: imageURL,
        index: _index
      };
    });

    const newDocumentObj = {
      id: newDocumentKey,
      createdAt: (new Date()).getTime(),
      userId: id,
      size: this.newPhotos.reduce((_acc, _cur) => _acc + _cur.size, 0),
      count: this.newPhotos.length,
      title: `${this.getFommatedDate()}에 만들어진 문서`, /* fill -> 완료 단계에서 채우도록? */
      verified: true, 
      thumbnail_url: thumbnailURL,
    };
    /* create new document item */
    updates["documents/" + newDocumentKey] = newDocumentObj;

    // for(let key in updates) Alert.alert(`${key}`);

    /* update new photos, document to firebase */
    await fire.DB.ref().update(updates);

    /* navigate to complete screen */
    this.props.navigation.navigate("Complete", newDocumentObj);
  }

  onTakeDocument = async() => {
    //setTimeout(() => this.setState({ isTakingImage: true }), 1);
    let photo = await this.camera.takePictureAsync({quality:0.3});
    let {size} = await FileSystem.getInfoAsync(photo.uri, {size: true});
    this.newPhotos.push({uri: photo.uri, size: size*1});
    //this.setState({ isTakingImage: false });
  }

  render() {
    var cameraPart;

    switch (this.state.displayStatus) {
      case DisplayStatus.UPLOADING:
        cameraPart = [<Modal key="cameraPartUploading"
          onRequestClose={()=>{}}
          transparent={false}>
          <Loading loadingText="연구노트를 업로드 하는 중입니다.."/>
        </Modal>];
        break;
      case DisplayStatus.LOADING:
        cameraPart = [<Modal key="cameraPartLoading"
          onRequestClose={()=>{}}
          transparent={false}>
          <Loading loadingText="카메라 로딩중.."/>
        </Modal>];
        break;
      case DisplayStatus.ENABLED:
        cameraPart = [<View key="cameraPart0" style={styles.cameraContainer}>
          <Camera style={{ flex: 1 }} type={this.state.type} ref={ref=>{this.camera = ref}}>
            <View style={styles.camera}>
              <View style={styles.cameraGuideContainer}><Text style={{fontSize:14, color:'white'}}>문서를 화면에 맞추세요!</Text></View>
            </View>
          </Camera>
          </View>,
          <View key="cameraPart1" style={styles.toolbarContainer}>
            <TouchableOpacity onPress={this.onTakeDocument} style={styles.takeDocumentBtn}/>
        </View>];
        break;
      default:
        console.log("ERROR: Unexpected status " + this.state.displayStatus);
      case DisplayStatus.DISABLED:
        cameraPart = [
          <Text key="cameraPartDisabled">카메라가 켜져있지 않습니다</Text>
        ];
        break;
    }

    return (
      <View style={styles.container}>
        {cameraPart}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 6,
    backgroundColor: 'black'
  },
  toolbarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  camera: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  cameraGuideContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 60
  },
  takeDocumentBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgb(22, 172, 143)'
  },
  
});

export default PhotoScreen
