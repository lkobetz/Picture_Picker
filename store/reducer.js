// actions:

const SET_TOTAL = "SET_TOTAL";
const SET_ERROR = "SET_ERROR";
const SET_IMAGES = "SET_IMAGES";
const NEW_SEARCH = "NEW_SEARCH";
const SET_WINDOW_DIMENSIONS = "SET_WINDOW_DIMENSIONS";
const SET_SCROLL_ROW = "SET_SCROLL_ROW";
const INCREMENT_PAGE = "INCREMENT_PAGE";
const SET_COLUMNS = "SET_COLUMNS";
const SET_SCROLL_ROW_GOAL = "SET_SCROLL_ROW_GOAL";
const FINISHED_LOADING_IMAGES = "FINISHED_LOADING_IMAGES";

// action creators:

export const setTotal = (total) => {
  return {
    type: SET_TOTAL,
    total,
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

export const setWindowDimensions = (dimensions) => {
  return {
    type: SET_WINDOW_DIMENSIONS,
    dimensions,
  };
};

export const setScrollRow = (newPosition) => {
  return {
    type: SET_SCROLL_ROW,
    newPosition,
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

export const finishedLoadingImages = () => {
  return {
    type: FINISHED_LOADING_IMAGES,
  };
};

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
};

// reducer:

export default function reducer(state = initialState, action) {
  switch (action.type) {
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
        input: "",
        images: [],
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
