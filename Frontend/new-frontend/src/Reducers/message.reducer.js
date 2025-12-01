import { messageConstants } from "../Actions/constant";

const initialState = {
  messages: [],
  loading: false,
  error: null,
};
export const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case messageConstants.GET_MESSAGES_REQUEST:
      state = {
        ...state,
        loading: true,
        error: null,
      };
      break;
    case messageConstants.GET_MESSAGES_SUCCESS:
      state = {
        ...state,
        messages: action.payload.messages,
        loading: false,
        error: null,
      };
      break;
    case messageConstants.GET_MESSAGES_FAILURE:
      state = {
        ...state,
        loading: false,
        error: action.payload.message,
      };
      break;
    case messageConstants.ADD_MESSAGE_REQUEST:
      state = {
        ...state,
        loading: true,
        error: null,
      };
      break;
    case messageConstants.ADD_MESSAGE_SUCCESS:
      state = {
        ...state,
        loading: false,
        error: null,
      };
      break;
    case messageConstants.ADD_MESSAGE_FAILURE:
      state = {
        ...state,
        loading: false,
        error: action.payload.message,
      };
      break;
    case messageConstants.DELETE_MESSAGE_REQUEST:
      state = {
        ...state,
        loading: true,
        error: null,
      };
      break;
    case messageConstants.DELETE_MESSAGE_SUCCESS:
      const filteredMessages = state.messages.filter(
        (message) => message._id !== action.payload.id
      );
      state = {
        ...state,
        messages: filteredMessages,
        loading: false,
        error: null,
      };
      break;
    case messageConstants.DELETE_MESSAGE_FAILURE:
      state = {
        ...state,
        loading: false,
        error: action.payload.message,
      };
      break;
    default:
      break;
  }
  return state;
};
