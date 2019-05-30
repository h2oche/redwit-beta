import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, Dimensions, Modal } from 'react-native';
import ImageViewer from "react-native-image-slider";
// import ImageViewer from "react-native-image-zoom-viewer";

import Loading from "../components/Loading";
import fire from "../fire";

export class DocumentViewerScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('title')
    }
  }

  async componentDidMount() {
    const {navigation} = this.props;
    const documentId = navigation.getParam('documentId', 'NO-ID');

    const ref = fire.DB.ref("photos");
    const snapshot = await ref.orderByChild("documentId").equalTo(documentId).once("value");
    const val = snapshot.val();

    let photos = [];
    for(let photoKey in val) photos.push(val[photoKey]);
    photos.sort((_a, _b) => _a.index - _b.index);
    this.setState({showLoadingModal: false, photos});
  }

  state = {
    showLoadingModal: true,
    photos: []
  }

  render() {
    const images = this.state.photos.map(_photoObj => _photoObj.image_url);

    return (
      <View style={styles.container}>
        <Modal
          transparent={false}
          visible={this.state.showLoadingModal}>
          <Loading loadingText="연구노트 데이터를 불러오고 있습니다.."/>
        </Modal>
        {/* <ImageViewer imageUrls={this.state.images}/> */}
        <ImageViewer
          loopBothSides
          images={images}
          customSlide={({ index, item, style, width }) => (
            // It's important to put style here because it's got offset inside
            <View key={index} style={[style, styles.slideContainer]}>
              <Image source={{ uri: item }} style={styles.slide}/>
            </View>
          )}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideContainer: {
    width: Dimensions.get('window').width,
    padding: 0,
    height: "100%",
    // borderWidth: 5,
    // borderColor: 'black'
  },
  slide: {
    width: "100%",
    height: "100%",
    // borderWidth: 3,
    // borderColor: 'blue'
  }
});

export default DocumentViewerScreen
