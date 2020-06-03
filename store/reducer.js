// actions:

const SET_ERROR = "SET_ERROR";
const SET_IMAGES = "SET_IMAGES";
const SET_WINDOW_WIDTH = "SET_WINDOW_WIDTH";
const SET_SCROLL_POSITION_PERCENT = "SET_SCROLL_POSITION_PERCENT";
const SET_CONTENT_HEIGHT = "SET_CONTENT_HEIGHT";

// action creators:

export const setError = (message) => {
  return {
    type: SET_ERROR,
    message,
  };
};

export const setImages = (images) => {
  return {
    type: SET_IMAGES,
    images,
  };
};

export const setWindowWidth = (newWidth) => {
  return {
    type: SET_WINDOW_WIDTH,
    newWidth,
  };
};

export const setScrollPositionPercent = (newPosition) => {
  return {
    type: SET_SCROLL_POSITION_PERCENT,
    newPosition,
  };
};

export const setContentHeight = (newHeight) => {
  return {
    type: SET_CONTENT_HEIGHT,
    newHeight,
  };
};

const initialState = {
  images: [],
  error: "",
  width: 0,
  contentHeight: 0,
  scrollPositionPercent: 0,
};

// reducer:

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state,
        error: action.message,
      };
    case SET_IMAGES:
      return {
        ...state,
        images: action.images,
      };
    case SET_WINDOW_WIDTH:
      return {
        ...state,
        width: action.newWidth,
      };
    case SET_SCROLL_POSITION_PERCENT:
      return {
        ...state,
        scrollPositionPercent: action.newPosition,
      };
    case SET_CONTENT_HEIGHT:
      return {
        ...state,
        contentHeight: action.newHeight,
      };
    default:
      return state;
  }
}
