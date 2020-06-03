import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import axios from "axios";
import apiKey from "../secrets";
import { connect } from "react-redux";
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
import {
  setError,
  setImages,
  setWindowWidth,
  setScrollPositionPercent,
  setContentHeight,
} from "../store/reducer";
import { ScrollView } from "react-native-gesture-handler";

import { MonoText } from "../components/StyledText";

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      searchInput: "",
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
      this.props.setError(`We can't find any images of that. :(`);
    } else {
      this.props.setError(``);
      this.props.setImages(results.data.hits);
    }
  }
  onLayout() {
    const oldWidth = this.props.width;
    const { width } = Dimensions.get("window");
    // set the current width of the window so we can use it to compare in the future
    this.props.setWindowWidth(width);
    // if the previous width is different from the current width, the device's orientation has changed
    if (oldWidth !== width && oldWidth !== 0) {
      // in that case, use the percentage of the content we left off at to calculate the y-coordinate under the new orientation, and scroll there.
      let position =
        (this.props.scrollPositionPercent * this.props.contentHeight) / 100;
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
    let position = (currentScrollLocation * 100) / this.props.contentHeight;
    this.props.setScrollPositionPercent(position);
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
            this.props.setContentHeight(height)
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
          {!this.props.error ? (
            <View style={styles.imageContainer}>
              {this.props.images.map((image) => {
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
            <Text style={styles.button}>{this.props.error}</Text>
          )}
        </ScrollView>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const mapStateToProps = (state) => ({
  images: state.images,
  searchInput: state.searchInput,
  error: state.error,
  width: state.width,
  contentHeight: state.contentHeight,
  scrollPositionPercent: state.scrollPositionPercent,
});

const mapDispatchToProps = (dispatch) => ({
  setError: (message) => dispatch(setError(message)),
  setImages: (images) => dispatch(setImages(images)),
  setWindowWidth: (width) => dispatch(setWindowWidth(width)),
  setScrollPositionPercent: (position) =>
    dispatch(setScrollPositionPercent(position)),
  setContentHeight: (height) => dispatch(setContentHeight(height)),
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

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
