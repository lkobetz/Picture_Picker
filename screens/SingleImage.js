import * as React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
} from "react-native";

const { height } = Dimensions.get("window");

export default function SingleImage(props) {
  console.log("props from SingleImage:", props.route.params.item);
  const image = props.route.params.item;
  return (
    <SafeAreaView>
      <Image
        key={image.id}
        style={{ height: height / 2 }}
        source={{ uri: image.largeImageURL }}
        alt="an image"
        resizeMode="contain"
      />
      <Text>User: {image.user}</Text>
      <Text>Tags: {image.tags}</Text>
    </SafeAreaView>
  );
}
