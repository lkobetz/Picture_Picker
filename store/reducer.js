// actions:

import {
  SET_PER_PAGE,
  SET_TOTAL,
  SET_ERROR,
  SET_IMAGES,
  NEW_SEARCH,
  SET_WINDOW_DIMENSIONS,
  SET_SCROLL_ROW,
  INCREMENT_PAGE,
  SET_COLUMNS,
  SET_SCROLL_ROW_GOAL,
  FINISHED_LOADING_IMAGES,
} from "./actions";

const initialState = {
  total: 0,
  images: [],
  error: "",
  width: 0,
  height: 0,
  scrollRow: 0,
  page: 1,
  columns: 1,
  scrollRowGoal: 0,
  allImagesLoaded: false,
  perPage: 50,
};

// reducer:

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_PER_PAGE:
      return {
        ...state,
        perPage: action.num,
      };
    case SET_TOTAL:
      return {
        ...state,
        total: action.total,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.message,
      };
    case SET_IMAGES:
      return {
        ...state,
        images: [...state.images, ...action.images],
      };
    case NEW_SEARCH:
      return {
        ...state,
        total: 0,
        perPage: 30,
        images: [],
        scrollRow: 0,
        scrollRowGoal: 0,
        page: 1,
        error: "",
        allImagesLoaded: false,
      };
    case SET_WINDOW_DIMENSIONS:
      return {
        ...state,
        width: action.dimensions.width,
        height: action.dimensions.height,
      };
    case SET_SCROLL_ROW:
      return {
        ...state,
        scrollRow: action.newPosition,
      };
    case INCREMENT_PAGE:
      return {
        ...state,
        page: state.page + 1,
      };
    case SET_COLUMNS:
      return {
        ...state,
        columns: action.columns,
      };
    case SET_SCROLL_ROW_GOAL:
      return {
        ...state,
        scrollRowGoal: action.row,
      };
    case FINISHED_LOADING_IMAGES:
      return {
        ...state,
        allImagesLoaded: true,
      };
    default:
      return state;
  }
}
