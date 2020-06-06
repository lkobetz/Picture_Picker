import * as React from "react";
import {
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  Dimensions,
} from "react-native";

const { height } = Dimensions.get("window");

export default function SingleImage(props) {
  // console.log("props from SingleImage:", props.route.params.item);
  const image = props.route.params.item;
  return (
    <SafeAreaView style={styles.container}>
      <Image
        key={image.id}
        style={styles.image}
        source={{ uri: image.largeImageURL }}
        alt="an image"
        resizeMode="contain"
      />
      <Text style={styles.text}>User: {image.user}</Text>
      <Text style={styles.text}>Tags: {image.tags}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
  },
  image: {
    height: height / 2,
  },
  text: {
    fontSize: 30,
    marginLeft: 10,
  },
});
