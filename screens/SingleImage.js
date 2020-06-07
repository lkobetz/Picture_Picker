import * as React from "react";
import { Image, StyleSheet, Text, SafeAreaView, View } from "react-native";
import { connect } from "react-redux";

export default function SingleImage(props) {
  const image = props.route.params.item;
  return (
    <SafeAreaView style={styles.container}>
      <Image
        key={image.id}
        style={{ height: props.height / 1.5 }}
        source={{ uri: image.largeImageURL }}
        alt="an image"
        resizeMode="contain"
      />
      <View style={{ flexDirection: "column" }}>
        <Text style={styles.text}>User: {image.user}</Text>
        <Text style={styles.text}>Tags: {image.tags}</Text>
        <Text style={styles.text}>
          Resolution: {image.imageWidth} x {image.imageHeight}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const mapStateToProps = (state) => ({
  width: state.width,
  height: state.height,
});

module.exports = connect(mapStateToProps)(SingleImage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
  },
});
