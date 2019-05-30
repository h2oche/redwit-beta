import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native'

export class DocumentListItem extends Component {
  renderVerfied = () => {
    let msg = this.props.data.verified ? "인증완료" : "인증중..";
    return <Text style={styles.verified}>{msg}</Text>
  }

  onItemPress = () => {
    this.props.onItemPress(this.props.data);
  }

  render() {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={this.onItemPress}>
        <View style={styles.thumbnailContainer}>
          <Image
            style={styles.thumbnail}
            source={{uri: this.props.data.thumbnail_url}}/>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.title}> {this.props.data.title} </Text>
          {this.renderVerfied()}
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    width: Dimensions.get('window').width / 3.3,
    margin: Dimensions.get('window').width * 1 / 66,
    height: 210,
    // borderWidth: 1,
    // borderColor: 'black',
  },
  infoContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 5
  },
  thumbnailContainer: {
    width: 120,
    height: 150,
  }, 
  thumbnail: {
    width: 120,
    height: 150
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  verified: {
    fontSize: 18,
    color: 'rgb(22, 172, 143)',
  }
});

export default DocumentListItem
