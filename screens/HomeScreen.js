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
  setWindowDimensions,
  setScrollRow,
  incrementPage,
  setColumns,
  setScrollRowGoal,
} from "../store/reducer";

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      searchInput: "",
    };
  }
  async callApi() {
    const results = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${this.state.searchInput}&image_type=photo&page=${this.props.page}&per_page=20`
    );
    return results.data;
  }
  async onSubmit() {
    this.props.newSearch();
    let input = this.state.searchInput;
    // reformat the input string to use in URL
    input = input.split(" ").join("+");
    let results = await this.callApi();
    if (!results.total) {
      this.props.setError(
        `Sorry, we couldn't find any images of ${this.state.searchInput}.`
      );
    } else {
      this.props.setError(``);
      this.props.setImages(results.hits);
    }
  }
  async loadMore() {
    // await prevents calling the api twice on the same page
    await this.props.incrementPage();
    const results = await this.callApi();
    if (results.hits) {
      this.props.setImages(results.hits);
    }
  }
  handleScroll(event) {
    // get y-coordinate of current location
    const currentScrollLocation = event.nativeEvent.contentOffset.y;
    // set the row that the user has currently scrolled to on the state so that we can scroll to that same row on orientation change
    const row = Math.floor(currentScrollLocation / 100);
    this.props.setScrollRow(row);
  }
  onLayout() {
    const oldWidth = this.props.width;
    const { width, height } = Dimensions.get("window");
    this.props.setWindowDimensions({ width, height });
    // if this condition is true, device orientation has changed
    if (oldWidth !== width) {
      const prevColumns = this.props.columns;
      // calculate new number of columns based on width
      const cols = Math.floor(width / 100);
      // calculate row to autoscroll to based on current scrollRow and new number of columns
      const rowToScrollTo = Math.floor(
        (this.props.scrollRow * prevColumns) / cols
      );
      this.props.setColumns(cols);
      this.props.setScrollRowGoal(rowToScrollTo);
    }
    // call autoScroll outside the condition because onLayout will be called again after the new column number is set
    this.autoScroll();
  }
  autoScroll() {
    if (this.props.scrollRowGoal) {
      this.flatList.scrollToIndex({
        index: this.props.scrollRowGoal,
        animated: false,
      });
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.inputContainer}
          placeholder="Search for an image..."
          onChangeText={(value) => this.setState({ searchInput: value })}
          onEndEditing={() => this.onSubmit()}
        />
        {!this.props.error && this.props.images.length ? (
          <FlatList
            onLayout={() => this.onLayout()}
            ref={(ref) => {
              this.flatList = ref;
            }}
            horizontal={false}
            numColumns={this.props.columns}
            key={this.props.columns}
            data={this.props.images}
            onScroll={(event) => this.handleScroll(event)}
            onEndReached={() => this.loadMore()}
            renderItem={({ item }) => (
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
  error: state.error,
  width: state.width,
  scrollRow: state.scrollRow,
  columns: state.columns,
  page: state.page,
  scrollRowGoal: state.scrollRowGoal,
});

const mapDispatchToProps = (dispatch) => ({
  setError: (message) => dispatch(setError(message)),
  setImages: (images) => dispatch(setImages(images)),
  newSearch: () => dispatch(newSearch()),
  setWindowDimensions: (dimensions) =>
    dispatch(setWindowDimensions(dimensions)),
  setScrollRow: (position) => dispatch(setScrollRow(position)),
  incrementPage: () => dispatch(incrementPage()),
  setColumns: (columns) => dispatch(setColumns(columns)),
  setScrollRowGoal: (row) => dispatch(setScrollRowGoal(row)),
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
    marginVertical: 10,
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
});
