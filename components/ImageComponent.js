import React from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";

export default class ImageComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("SingleImage", {
            item: this.props.item,
          })
        }
      >
        <Image
          key={this.props.item.id}
          style={styles.singleImage}
          source={{ uri: this.props.item.previewURL }}
          alt="an image"
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  singleImage: {
    height: 100,
    width: 100,
    margin: 2,
  },
});
