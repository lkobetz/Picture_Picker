import React from "react";
import { FlatList, StyleSheet, Dimensions } from "react-native";
import ImageComponent from "../components/ImageComponent";
import { callApi } from "../api/call";
import { connect } from "react-redux";
import {
  setImages,
  setWindowDimensions,
  setScrollRow,
  incrementPage,
  setPerPage,
  setColumns,
  setScrollRowGoal,
  finishedLoadingImages,
} from "../store/actions";
import _throttle from "lodash.throttle";

export default class AllImages extends React.Component {
  constructor() {
    super();
    this.state = {
      noCall: true,
    };
    this.flatList = React.createRef();
    this.onLayout = this.onLayout.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.getItemLayout = this.getItemLayout.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.throttledLoadMore = _throttle(this.loadMore, 300, {
      leading: false,
      trailing: true,
    });
  }
  renderItem({ item, index }) {
    return <ImageComponent item={item} navigation={this.props.navigation} />;
  }
  getItemLayout(data, index) {
    return {
      length: 100,
      offset: 100 * index,
      index,
    };
  }
  onLayout() {
    const oldWidth = this.props.width;
    const { width, height } = Dimensions.get("window");
    this.props.setWindowDimensions({ width, height });
    // if this condition is true, device orientation has changed
    if (oldWidth !== width) {
      const prevColumns = this.props.columns;
      // calculate new number of columns based on new width
      const cols = Math.floor(width / 100);
      // calculate row to autoscroll to based on current scrollRow and new number of columns
      const rowToScrollTo = Math.floor(
        (this.props.scrollRow * prevColumns) / cols
      );
      this.props.setColumns(cols);
      this.props.setScrollRowGoal(rowToScrollTo);
    }
    // call autoScroll outside the condition because onLayout will be called again after the new column number is set
    if (this.props.scrollRow !== this.props.scrollRowGoal) {
      this.autoScroll();
    }
  }
  autoScroll() {
    if (this.props.scrollRowGoal) {
      this.flatList.current.scrollToIndex({
        index: this.props.scrollRowGoal,
        animated: false,
      });
    }
  }
  handleScroll(event) {
    // get y-coordinate of current location
    const currentScrollLocation = event.nativeEvent.contentOffset.y;
    // set the row that the user has currently scrolled to on the state in order to scroll to it on orientation change
    const row = Math.floor(currentScrollLocation / 100);
    this.props.setScrollRow(row);
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
  debouncedApiCall() {
    return this.debounce(this.callApi, 100);
  }
  async callApi() {
    if (this.state.noCall) {
      const results = await callApi(
        this.props.searchInput,
        this.props.page,
        this.props.perPage
      );
      this.props.incrementPage();
      return results;
    }
  }
  async loadMore() {
    if (!this.props.allImagesLoaded) {
      let results = {};
      // condition checks if the following page doesn't have fewer than the designated number of images per page...
      if (
        this.props.total - this.props.images.length >=
        this.props.perPage * 2
      ) {
        results = await this.callApi();
        /// ...if the following page has fewer images, combine the last two pages into one api call and stop loading more.
      } else {
        let unique = {};
        let images = this.props.images;
        for (let i = 0; i < images.length; i++) {
          if (!unique[images[i].id]) {
            unique[images[i].id] = 1;
          } else {
            unique[images[i].id]++;
            console.log("index:", i, "image:", images[i].largeImageURL);
          }
        }
        let newPerPage = this.props.total - this.props.images.length;
        this.setState({ noCall: false });
        this.props.setPerPage(newPerPage);
        results = await this.callApi();
        if (results && results.hits) {
          this.props.setImages(results.hits);
          console.log("final total:", this.props.images.length);
          this.props.finishedLoadingImages();
        }
      }
      if (results && results.hits) {
        this.setState({ noCall: true });
        this.props.setImages(results.hits);
        console.log("all images loaded?", this.props.allImagesLoaded);
      }
    }
    console.log(
      "number of images:",
      this.props.total,
      "images in array:",
      this.props.images.length,
      "page:",
      this.props.page
    );
  }
  render() {
    return (
      <FlatList
        onLayout={this.onLayout}
        ref={this.flatList}
        horizontal={false}
        numColumns={this.props.columns}
        key={this.props.columns}
        data={this.props.images}
        onScroll={(event) => this.handleScroll(event)}
        onEndReached={this.throttledLoadMore}
        onEndReachedThreshold={0.5}
        renderItem={this.renderItem}
        getItemLayout={this.getItemLayout}
        keyExtractor={(item, index) => String(item.id)}
        contentContainerStyle={styles.imageContainer}
      ></FlatList>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  searchInput: ownProps.searchInput,
  navigation: ownProps.navigation,
  total: state.total,
  perPage: state.perPage,
  images: state.images,
  width: state.width,
  scrollRow: state.scrollRow,
  columns: state.columns,
  page: state.page,
  scrollRowGoal: state.scrollRowGoal,
  allImagesLoaded: state.allImagesLoaded,
});

const mapDispatchToProps = (dispatch) => ({
  setPerPage: (num) => dispatch(setPerPage(num)),
  setImages: (images) => dispatch(setImages(images)),
  setWindowDimensions: (dimensions) =>
    dispatch(setWindowDimensions(dimensions)),
  setScrollRow: (position) => dispatch(setScrollRow(position)),
  incrementPage: () => dispatch(incrementPage()),
  setColumns: (columns) => dispatch(setColumns(columns)),
  setScrollRowGoal: (row) => dispatch(setScrollRowGoal(row)),
  finishedLoadingImages: () => dispatch(finishedLoadingImages()),
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(AllImages);

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
  },
});
