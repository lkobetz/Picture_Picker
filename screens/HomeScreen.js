import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import axios from "axios";
import apiKey from "../secrets";
import { connect } from "react-redux";
import ImageComponent from "../components/ImageComponent";
import {
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  FlatList,
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
  setColumns,
  setScrollRowGoal,
  finishedLoadingImages,
} from "../store/reducer";

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      searchInput: "",
      perPage: 30,
    };
    this.loadMore = this.loadMore.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.debouncedLoadMore = this.debouncedLoadMore.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }
  async callApi() {
    let results = [];
    try {
      results = await axios.get(
        `https://pixabay.com/api/?key=${apiKey}&q=${this.state.searchInput}&image_type=photo&page=${this.props.page}&per_page=${this.state.perPage}`
      );
      return results.data;
    } catch (err) {
      if (err.request) {
        console.log(this.props.page, err.request);
      }
    }
    return results;
  }
  async onSubmit() {
    // await prevents api call before state is cleared
    await this.props.newSearch();
    this.setState({ perPage: 30 });
    let input = this.state.searchInput;
    // reformat the input string to use in URL
    input = input.split(" ").join("+");
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
  debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args);
      }, ms);
    };
  }
  debouncedLoadMore() {
    const debounced = this.debounce(this.loadMore, 300);
    return debounced();
  }
  async loadMore() {
    // only load more if we haven't reached the end of all images
    if (!this.props.allImagesLoaded) {
      const totalSoFar = this.props.page * this.state.perPage;
      let results = {};
      // condition prevents page from incrementing if images array hasn't caught up
      if (totalSoFar <= this.props.images.length) {
        // condition checks if the page is within range/exists in order to make a valid axios request
        if (totalSoFar <= this.props.total) {
          // await prevents calling the api twice on the same page
          await this.props.incrementPage();
          results = await this.callApi();
        } else {
          // reset number per page to the number of images that remain to be loaded
          let oldPerPage = this.state.perPage;
          await this.setState({
            perPage: this.props.total - (totalSoFar - oldPerPage),
          });
          results = await this.callApi();
          // we've reached the last image, so set allImagesLoaded to true
          await this.props.finishedLoadingImages();
        }
        if (results.hits) {
          await this.props.setImages(results.hits);
        }
      }
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
  renderItem({ item }) {
    return <ImageComponent item={item} navigation={this.props.navigation} />;
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
          <FlatList
            onLayout={this.onLayout}
            ref={(ref) => {
              this.flatList = ref;
            }}
            horizontal={false}
            numColumns={this.props.columns}
            key={this.props.columns}
            data={this.props.images}
            onScroll={(event) => this.handleScroll(event)}
            onEndReached={this.loadMore}
            onEndReachedThreshold={0.5}
            renderItem={this.renderItem}
            getItemLayout={(data, index) => ({
              length: 100,
              offset: 100 * index,
              index,
            })}
            keyExtractor={(item, index) => String(index)}
            contentContainerStyle={styles.imageContainer}
          ></FlatList>
        ) : (
          <Text style={styles.error}>{this.props.error}</Text>
        )}
      </SafeAreaView>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const mapStateToProps = (state) => ({
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
  setWindowDimensions: (dimensions) =>
    dispatch(setWindowDimensions(dimensions)),
  setScrollRow: (position) => dispatch(setScrollRow(position)),
  incrementPage: () => dispatch(incrementPage()),
  setColumns: (columns) => dispatch(setColumns(columns)),
  setScrollRowGoal: (row) => dispatch(setScrollRowGoal(row)),
  finishedLoadingImages: () => dispatch(finishedLoadingImages()),
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
  },
  imageContainer: {
    alignItems: "center",
  },
});
