import { authConstants } from "../Actions/constant";

const initialState = {
  token: localStorage.getItem("token") || null,
  username: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).username
    : "",
  role: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).role
    : "",
  authenticate: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case authConstants.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        username: action.payload.user.username,
        role: action.payload.user.role,
        authenticate: true,
        loading: false,
        error: null,
      };

    case authConstants.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };

    case authConstants.LOGOUT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case authConstants.LOGOUT_SUCCESS:
      return {
        ...initialState,
        token: null,
        authenticate: false,
      };

    case authConstants.LOGOUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };

    case authConstants.REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case authConstants.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case authConstants.REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };

    default:
      return state;
  }
};

export default authReducer;
