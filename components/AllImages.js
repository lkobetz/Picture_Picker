import React from "react";
import { FlatList, StyleSheet, Dimensions } from "react-native";
import ImageComponent from "../components/ImageComponent";
import { callApi } from "../api/funcs";
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

export default class AllImages extends React.Component {
  constructor() {
    super();
    this.onLayout = this.onLayout.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.getItemLayout = this.getItemLayout.bind(this);
    this.loadMore = this.loadMore.bind(this);
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
  async onLayout() {
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
      await this.props.setColumns(cols);
      await this.props.setScrollRowGoal(rowToScrollTo);
    }
    // call autoScroll outside the condition because onLayout will be called again after the new column number is set
    if (this.props.scrollRow !== this.props.scrollRowGoal) {
      await this.autoScroll();
    }
  }
  autoScroll() {
    if (this.props.scrollRowGoal) {
      this.flatList.scrollToIndex({
        index: this.props.scrollRowGoal,
        animated: false,
      });
    }
  }
  async handleScroll(event) {
    // get y-coordinate of current location
    const currentScrollLocation = event.nativeEvent.contentOffset.y;
    // set the row that the user has currently scrolled to on the state so that we can scroll to that same row on orientation change
    const row = Math.floor(currentScrollLocation / 100);
    await this.props.setScrollRow(row);
  }
  async callApi() {
    const results = await callApi(
      this.props.searchInput,
      this.props.page,
      this.props.perPage
    );
    return results;
  }
  async loadMore() {
    // only load more if we haven't reached the end of all images
    if (!this.props.allImagesLoaded) {
      // const totalSoFar = this.props.page * this.props.perPage;
      let results = {};
      // condition checks if the page is within range/exists in order to make a valid axios request
      if (
        this.props.total - this.props.images.length >=
        this.props.perPage * 2
      ) {
        // await prevents calling the api twice on the same page
        await this.props.incrementPage();
        results = await this.callApi();
      } else {
        // reset number per page to the number of images that remain to be loaded
        let newPerPage = this.props.total - this.props.images.length;
        await this.props.incrementPage();
        await this.props.setPerPage(newPerPage);
        results = await this.callApi();
        // we've reached the last image, so set allImagesLoaded to true
        await this.props.finishedLoadingImages();
      }
      if (results.hits) {
        await this.props.setImages(results.hits);
      }
    }
  }
  render() {
    return (
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
        getItemLayout={this.getItemLayout}
        keyExtractor={(item, index) => String(index)}
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
