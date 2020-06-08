import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { connect } from "react-redux";
import AllImages from "../components/AllImages";
import {
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  View,
} from "react-native";
import {
  setTotal,
  setError,
  setImages,
  newSearch,
  setWindowDimensions,
  setScrollRow,
  incrementPage,
  setPerPage,
  setColumns,
  setScrollRowGoal,
  finishedLoadingImages,
} from "../store/reducer";
import { callApi } from "../api/funcs";

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      searchInput: "",
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  async callApi() {
    const results = await callApi(
      this.state.searchInput,
      this.props.page,
      this.props.perPage
    );
    return results;
  }
  async onSubmit() {
    // await prevents api call before state is cleared
    await this.props.newSearch();
    let results = await this.callApi();
    if (!results.totalHits) {
      this.props.setError(
        `Sorry, we couldn't find any images of ${this.state.searchInput}.`
      );
    } else {
      this.props.setTotal(results.totalHits);
      this.props.setError(``);
      this.props.setImages(results.hits);
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.inputContainer}
            placeholder="Search for an image..."
            onChangeText={(value) => this.setState({ searchInput: value })}
            onEndEditing={this.onSubmit}
          />
          <TouchableOpacity style={styles.button} onPress={this.onSubmit}>
            <Text>Search</Text>
          </TouchableOpacity>
        </View>
        {!this.props.error && this.props.images.length ? (
          <AllImages
            navigation={this.props.navigation}
            searchInput={this.state.searchInput}
          />
        ) : (
          <Text style={styles.error}>{this.props.error}</Text>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  perPage: state.perPage,
  total: state.total,
  images: state.images,
  error: state.error,
  width: state.width,
  scrollRow: state.scrollRow,
  columns: state.columns,
  page: state.page,
  scrollRowGoal: state.scrollRowGoal,
  allImagesLoaded: state.allImagesLoaded,
});

const mapDispatchToProps = (dispatch) => ({
  setTotal: (total) => dispatch(setTotal(total)),
  setError: (message) => dispatch(setError(message)),
  setImages: (images) => dispatch(setImages(images)),
  newSearch: () => dispatch(newSearch()),
  // setWindowDimensions: (dimensions) =>
  //   dispatch(setWindowDimensions(dimensions)),
  // setScrollRow: (position) => dispatch(setScrollRow(position)),
  // incrementPage: () => dispatch(incrementPage()),
  // setColumns: (columns) => dispatch(setColumns(columns)),
  // setScrollRowGoal: (row) => dispatch(setScrollRowGoal(row)),
  // finishedLoadingImages: () => dispatch(finishedLoadingImages()),
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    height: 40,
    width: Dimensions.get("window").width / 1.7,
    borderColor: "gray",
    borderWidth: 1,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    alignSelf: "center",
    padding: 5,
    backgroundColor: "lightgray",
    marginHorizontal: 10,
  },
  error: {
    alignSelf: "center",
    margin: 5,
  },
});
