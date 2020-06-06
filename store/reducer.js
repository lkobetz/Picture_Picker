// actions:

const SET_INPUT = "SET_INPUT";
const SET_ERROR = "SET_ERROR";
const SET_IMAGES = "SET_IMAGES";
const NEW_SEARCH = "NEW_SEARCH";
const SET_WINDOW_WIDTH = "SET_WINDOW_WIDTH";
const SET_SCROLL_ROW = "SET_SCROLL_ROW";
const INCREMENT_PAGE = "INCREMENT_PAGE";
const SET_COLUMNS = "SET_COLUMNS";
const SET_SCROLL_ROW_GOAL = "SET_SCROLL_ROW_GOAL";

// action creators:

export const setInput = (input) => {
  return {
    type: SET_INPUT,
    input,
  };
};

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

export const newSearch = () => {
  return {
    type: NEW_SEARCH,
  };
};

export const setWindowWidth = (newWidth) => {
  return {
    type: SET_WINDOW_WIDTH,
    newWidth,
  };
};

export const setScrollRow = (newPosition) => {
  return {
    type: SET_SCROLL_ROW,
    newPosition,
  };
};

export const setContentHeight = (newHeight) => {
  return {
    type: SET_CONTENT_HEIGHT,
    newHeight,
  };
};

export const setColumns = (columns) => {
  return {
    type: SET_COLUMNS,
    columns,
  };
};

export const incrementPage = () => {
  return {
    type: INCREMENT_PAGE,
  };
};

export const setScrollRowGoal = (row) => {
  return {
    type: SET_SCROLL_ROW_GOAL,
    row,
  };
};

const initialState = {
  images: [],
  error: "",
  width: 0,
  scrollRow: 0,
  page: 1,
  input: "",
  columns: 0,
  scrollRowGoal: 0,
};

// reducer:

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_INPUT:
      return {
        ...state,
        input: action.input,
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
        images: [],
        scrollGoalRow: 0,
        page: 1,
        error: "",
      };
    case SET_WINDOW_WIDTH:
      return {
        ...state,
        width: action.newWidth,
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
    default:
      return state;
  }
}
