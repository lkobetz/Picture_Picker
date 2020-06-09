export const SET_PER_PAGE = "SET_PER_PAGE";
export const SET_TOTAL = "SET_TOTAL";
export const SET_ERROR = "SET_ERROR";
export const SET_IMAGES = "SET_IMAGES";
export const NEW_SEARCH = "NEW_SEARCH";
export const SET_WINDOW_DIMENSIONS = "SET_WINDOW_DIMENSIONS";
export const SET_SCROLL_ROW = "SET_SCROLL_ROW";
export const INCREMENT_PAGE = "INCREMENT_PAGE";
export const SET_COLUMNS = "SET_COLUMNS";
export const SET_SCROLL_ROW_GOAL = "SET_SCROLL_ROW_GOAL";
export const FINISHED_LOADING_IMAGES = "FINISHED_LOADING_IMAGES";

export const setPerPage = (num) => {
  return {
    type: SET_PER_PAGE,
    num,
  };
};

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
