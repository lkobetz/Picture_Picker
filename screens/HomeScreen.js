import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import axios from "axios";
import apiKey from "../secrets";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { MonoText } from "../components/StyledText";

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      images: [],
      searchInput: "",
      error: "",
      width: 0,
      contentHeight: 0,
      scrollPositionPercent: 0,
    };
  }
  async onSubmit() {
    let input = this.state.searchInput;
    // reformat the input string to use in URL
    input = input.split(" ").join("+");
    const results = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${input}&image_type=photo&per_page=100`
    );
    if (!results.data.total) {
      this.setState({ error: `We can't find any images of that. :(` });
    } else {
      this.setState({ images: results.data.hits, error: "" });
    }
  }
  onLayout() {
    const oldWidth = this.state.width;
    const { width } = Dimensions.get("window");
    // set the current width of the window so we can use it to compare in the future
    this.setState({ width: width });
    // if the previous width is different from the current width, the device's orientation has changed
    if (oldWidth !== width && oldWidth !== 0) {
      // in that case, use the percentage of the content we left off at to calculate the y-coordinate under the new orientation, and scroll there.
      let position =
        (this.state.scrollPositionPercent * this.state.contentHeight) / 100;
      this.scrollRef.scrollTo({
        y: position,
        animated: false,
      });
    }
  }
  async handleScroll(event) {
    // get y-coordinate of current location
    let currentScrollLocation = event.nativeEvent.contentOffset.y;
    // this sets the % of the content that the user has currently scrolled to on the state so that we can scroll to that same percentage on orientation change
    let position = (currentScrollLocation * 100) / this.state.contentHeight;
    this.setState({ scrollPositionPercent: position });
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          scrollEventThrottle={200}
          ref={(ref) => {
            this.scrollRef = ref;
          }}
          onScroll={(event) => this.handleScroll(event)}
          onLayout={() => this.onLayout()}
          onContentSizeChange={(width, height) =>
            this.setState({ contentHeight: height })
          }
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <TextInput
            style={styles.inputContainer}
            placeholder="Search for an image"
            onChangeText={(value) => this.setState({ searchInput: value })}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.onSubmit()}
          >
            <Text>Search</Text>
          </TouchableOpacity>
          {!this.state.error ? (
            <View style={styles.imageContainer}>
              {this.state.images.map((image) => {
                return (
                  <Image
                    key={image.id}
                    style={styles.singleImage}
                    source={{ uri: image.previewURL }}
                    alt="an image"
                  />
                );
              })}
            </View>
          ) : (
            <Text style={styles.button}>{this.state.error}</Text>
          )}
        </ScrollView>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/workflow/development-mode/"
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/get-started/create-a-new-app/#making-your-first-change"
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inputContainer: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginLeft: 40,
    marginRight: 40,
  },
  button: {
    alignSelf: "center",
    margin: 5,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  singleImage: {
    height: 100,
    width: 100,
    margin: 2,
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  contentContainer: {
    paddingTop: 30,
    justifyContent: "center",
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)",
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center",
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
