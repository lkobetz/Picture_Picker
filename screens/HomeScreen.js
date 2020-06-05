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
  SafeAreaView,
  FlatList,
  Dimensions,
} from "react-native";
import {
  setError,
  setImages,
  newSearch,
  setWindowWidth,
  setScrollRow,
  setContentHeight,
} from "../store/reducer";

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      searchInput: "",
      page: 1,
      input: "",
      columns: Math.floor(Dimensions.get("window").width / 100),
      scrollGoalRow: 0,
    };
  }
  async onSubmit() {
    await this.props.newSearch();
    // these two state changes need to be included in newSearch
    this.setState({ scrollGoalRow: 0 });
    this.setState({ page: 1 });
    let input = this.state.searchInput;
    // reformat the input string to use in URL
    input = input.split(" ").join("+");
    await this.setState({ input: input });
    let results = await this.callApi();
    if (!results.total) {
      this.props.setError(
        `Sorry, we couldn't find any images of ${this.state.input}.`
      );
    } else {
      this.props.setError(``);
      this.props.setImages(results.hits);
    }
  }
  async callApi() {
    const results = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${this.state.input}&image_type=photo&page=${this.state.page}&per_page=30`
    );
    return results.data;
  }
  async onLayout() {
    const oldWidth = this.props.width;
    const { width } = Dimensions.get("window");
    this.props.setWindowWidth(width);
    if (oldWidth !== width) {
      // resetting the goal every time the width changes causes it to incrementally increase
      let prevColumns = this.state.columns;
      const cols = Math.floor(width / 100);
      let rowToScrollTo = Math.floor(
        (this.props.scrollRow * prevColumns) / cols
      );
      await this.setState({
        columns: cols,
        scrollGoalRow: rowToScrollTo,
      });
    }
    this.autoScroll();
  }
  autoScroll() {
    if (this.state.scrollGoalRow) {
      this.flatList.scrollToIndex({
        index: this.state.scrollGoalRow,
        animated: false,
      });
    }
  }
  async handleScroll(event) {
    // get y-coordinate of current location
    let currentScrollLocation = event.nativeEvent.contentOffset.y;
    // this sets the row of the content that the user has currently scrolled to on the state so that we can scroll to that same Rowage on orientation change
    let row = Math.floor(currentScrollLocation / 100);
    await this.props.setScrollRow(row);
  }
  async loadMore() {
    await this.setState((prevState) => ({ page: prevState.page + 1 }));
    const results = await this.callApi();
    if (results.hits) {
      this.props.setImages(results.hits);
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.inputContainer}
          placeholder="Search for an image"
          onChangeText={(value) => this.setState({ searchInput: value })}
        />
        <TouchableOpacity style={styles.button} onPress={() => this.onSubmit()}>
          <Text>Search</Text>
        </TouchableOpacity>
        {!this.props.error && this.props.images.length ? (
          <FlatList
            onLayout={() => this.onLayout()}
            ref={(ref) => {
              this.flatList = ref;
            }}
            horizontal={false}
            numColumns={this.state.columns}
            key={this.state.columns}
            data={this.props.images}
            onScroll={(event) => this.handleScroll(event)}
            onEndReached={() => this.loadMore()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("SingleImage", { item: item })
                }
              >
                <Image
                  key={item.id}
                  style={styles.singleImage}
                  source={{ uri: item.previewURL }}
                  alt="an image"
                />
              </TouchableOpacity>
            )}
            getItemLayout={(data, index) => ({
              length: 100,
              offset: 100 * index,
              index,
            })}
            keyExtractor={(item, index) => String(index)}
            contentContainerStyle={styles.imageContainer}
          ></FlatList>
        ) : (
          <Text style={styles.button}>{this.props.error}</Text>
        )}
      </SafeAreaView>
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
  scrollRow: state.scrollRow,
});

const mapDispatchToProps = (dispatch) => ({
  setError: (message) => dispatch(setError(message)),
  setImages: (images) => dispatch(setImages(images)),
  newSearch: () => dispatch(newSearch()),
  setWindowWidth: (width) => dispatch(setWindowWidth(width)),
  setScrollRow: (position) => dispatch(setScrollRow(position)),
  setContentHeight: (height) => dispatch(setContentHeight(height)),
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
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
    alignItems: "center",
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
